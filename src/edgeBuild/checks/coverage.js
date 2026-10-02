/**
 * Check: every relationship the v3.0 schema declares as a named property is in the edge table, at
 * the path the schema declares, with the targets and cap the schema declares.
 *
 * The INTRINSIC partition is checked in full, because a named capitalised property is declared per
 * entity, and because it is where a mistake produces invalid OMC: v3.0 sets
 * `unevaluatedProperties: false`, so an intrinsic edge written at a path the schema does not declare
 * makes the whole entity fail validation.
 *
 * The `edges` partition is checked only as far as the schema allows. An entity's `edges` object is
 * one shared `$ref` declaring 19 predicates and their (predicate, range) pairs, with
 * `additionalProperties: true` at both levels — so a verb nobody declared, or a declared verb at a
 * new range, validates silently. Those are reported as undeclared rather than wrong: the Edge
 * Editor is where the modelling happens, and the schema is what needs catching up.
 *
 * The publication is checked the other way too: an RDF property that lands on no row publishes a
 * relationship the OMC-JSON side does not carry. Some are RDF-only and right to be there, and a
 * join that quietly matched nothing looks identical, so they are reported rather than assumed.
 *
 * @module edgeBuild/checks/coverage
 * @ignore
 */

import { isCapitalized } from '../../mlHelpers/util.js';
import { listEntities, mergeAllOf, resolveRef } from '../../templates/schemaDerive.js';

import { isObject, schemaEdgeDeclarations } from './declarations.js';

export const name = 'EDGE COVERAGE';

/**
 * What each finding costs, which is what decides whether it can refuse a build.
 *
 * The intrinsic partition is where a mistake mints invalid OMC. A named capitalised property is
 * declared per entity, and v3.0 sets `unevaluatedProperties: false`, so one written at a path the
 * schema does not declare — or with a target or cap the schema disagrees with — makes the whole
 * entity fail `omcValidate`. Shipping a table that does that is not a judgement call.
 *
 * The `edges` partition cannot be wrong in that way: it is one shared `$ref` with
 * `additionalProperties: true` at both levels, so an undeclared verb or pair validates silently.
 * What it costs is that the schema has no record of the relationship, so nothing can be narrowed
 * onto it. That is outstanding work, and MISSING likewise: the table is incomplete, not invalid.
 */
export const severity = {
    'MISSING': 'warning',
    'MISPLACED': 'blocking',
    'OTHER-BUCKET': 'blocking',
    'TABLE-ONLY': 'blocking',
    'TARGETS': 'blocking',
    'MAXITEMS': 'blocking',
    'VERB-UNDECLARED': 'warning',
    'PAIR-UNDECLARED': 'warning',
    'RDF-UNMATCHED': 'warning',
};

/**
 * Top-level keys that carry no intrinsic relationship, whatever their shape.
 *   edges        — the shared predicate block, checked separately below
 *   instanceInfo — provenance the derived shape excludes, and no consumer edits as an edge
 *   Context      — the v2.x edge carrier, kept in v3.0 for migration
 */
const SKIP_KEYS = new Set(['edges', 'instanceInfo', 'Context']);

/** How deep a data container may nest before a relationship inside it stops being looked for. */
const MAX_DEPTH = 3;

const refTail = (ref) => (typeof ref === 'string' ? ref.split('/').pop() : null);

/** A reference branch: the `anyOf` member that allows a bare `{ identifier }` in place of an entity. */
const isReferenceBranch = (node) => isObject(node)
    && typeof node.$ref === 'string'
    && node.$ref.endsWith('core/properties/reference');

/**
 * The reference-bearing branch list of a relationship property, or null. An array of references
 * keeps it under `items.anyOf`; a single reference in the property's own `anyOf`.
 */
const relationshipBranches = ((node) => {
    const asArray = node.items?.anyOf;
    if (Array.isArray(asArray) && asArray.some(isReferenceBranch)) return asArray;
    if (Array.isArray(node.anyOf) && node.anyOf.some(isReferenceBranch)) return node.anyOf;
    return null;
});

/** The alternative forms a property may take: `oneOf` (exactly one) or `anyOf` (at least one). */
const branchesOf = ((node) => (Array.isArray(node.oneOf) && node.oneOf)
    || (Array.isArray(node.anyOf) && node.anyOf)
    || null);

/** The schemas an array's `items` holds — one, or a tuple of them. */
const itemSchemasOf = ((node) => {
    if (Array.isArray(node.items)) return node.items;
    return isObject(node.items) ? [node.items] : [];
});

/**
 * Every intrinsic relationship the schema declares, as `{ domain, path, targets, maxItems }`.
 *
 * A property is a relationship when its key is capitalised and it offers a reference branch. Three
 * shapes stand between a property and the relationships under it, all real in v3.0:
 *
 *   - `oneOf` / `anyOf` at the property. `Collection.includes` offers three encodings of the same
 *     members; **branches are tried in order and the first that yields anything wins**, since
 *     reading the rest would invent paths that cannot coexist with the ones found.
 *   - `items` as a tuple (`Composition.software`, with `ConfigurationFile` inside).
 *   - a `$ref` standing in for either, resolved at each step.
 *
 * @param {Object} schema
 * @returns {Array<{domain: string, path: string, targets: string[], maxItems: number|null}>}
 */
function schemaRelationships(schema) {
    const found = [];
    const deref = (node) => (isObject(node) && node.$ref ? resolveRef(schema, node.$ref) : node);

    /** Record what this node contributes at `path`, and say how much. */
    const consider = (node, path, key, domain, depth, seen) => {
        if (!isObject(node) || seen.has(node)) return 0;

        if (isCapitalized(key)) {
            const branches = relationshipBranches(node);
            if (branches) {
                found.push({
                    domain,
                    path,
                    targets: branches.filter((branch) => !isReferenceBranch(branch))
                        .map((branch) => refTail(branch.$ref))
                        .filter(Boolean)
                        .sort(),
                    maxItems: node.maxItems ?? null,
                });
                return 1;
            }
        }
        if (depth >= MAX_DEPTH) return 0;

        const nested = new Set(seen).add(node);

        if (isObject(node.properties)) return walk(node, path, domain, depth + 1, nested);

        const alternatives = branchesOf(node);
        if (alternatives) {
            let contributed = 0;
            alternatives.some((branch) => {
                contributed = consider(deref(branch), path, key, domain, depth, nested);
                return contributed > 0;
            });
            return contributed;
        }

        return itemSchemasOf(node)
            .reduce((total, item) => total + consider(deref(item), path, key, domain, depth, nested), 0);
    };

    function walk(node, prefix, domain, depth, seen) {
        const { properties } = mergeAllOf(schema, node) || {};
        if (!isObject(properties)) return 0;

        return Object.entries(properties).reduce((total, [key, declared]) => {
            if (!prefix && SKIP_KEYS.has(key)) return total;
            const path = prefix ? `${prefix}.${key}` : key;
            return total + consider(deref(declared), path, key, domain, depth, seen);
        }, 0);
    }

    listEntities(schema).forEach((def, entityType) => walk(def, '', entityType, 0, new Set()));
    return found;
}

/**
 * Compare a built table with the schema.
 *
 * @param {{table: Object, schema: Object}} subject
 * @returns {{findings: Object<string, string[]>, summary: string[], report: string[]}}
 */
export function run({ table, schema, rdfUnmatched = [] }) {
    const declared = schemaRelationships(schema);
    const { verbs: schemaVerbs, pairs: schemaPairs } = schemaEdgeDeclarations(schema);

    const intrinsicOf = (domain) => table[domain]?.intrinsic || {};
    const tableEntries = Object.entries(table).flatMap(([domain, partitions]) => (
        Object.keys(partitions.intrinsic || {}).map((path) => `${domain} ${path}`)
    ));
    const declaredKeys = new Set(declared.map(({ domain, path }) => `${domain} ${path}`));

    const findings = {
        'MISSING': [],
        'MISPLACED': [],
        'OTHER-BUCKET': [],
        'TABLE-ONLY': [],
        'TARGETS': [],
        'MAXITEMS': [],
        'VERB-UNDECLARED': [],
        'PAIR-UNDECLARED': [],
        'RDF-UNMATCHED': [...rdfUnmatched].sort(),
    };
    let matched = 0;

    /** Paths already reported as MISPLACED, so TABLE-ONLY does not report the same fact again. */
    const accountedFor = new Set();

    declared.forEach(({
        domain, path, targets, maxItems,
    }) => {
        const entry = intrinsicOf(domain)[path];
        if (!entry) {
            // Not at the declared path is three situations. Look for the relationship elsewhere
            // before calling it absent.
            const leaf = path.split('.').pop();
            const elsewhere = Object.keys(intrinsicOf(domain))
                .filter((other) => other.split('.').pop() === leaf);
            const inEdges = Object.values(table[domain]?.edges || {})
                .filter((edge) => targets.some((target) => (edge.allowed || []).includes(target)));

            if (elsewhere.length) {
                elsewhere.forEach((other) => accountedFor.add(`${domain} ${other}`));
                findings.MISPLACED.push(`${domain} ${path} -> the table has it at `
                    + `${elsewhere.map((other) => `"${other}"`).join(', ')}`);
            } else if (inEdges.length) {
                // Matched on the (domain, target) pair, which does NOT prove it is the same
                // relationship. Report what was found and let a person judge.
                findings['OTHER-BUCKET'].push(`${domain} ${path} -> [${targets.join(',')}] not `
                    + `intrinsic; the edges bucket has ${inEdges.map((e) => e.path).sort().join(', ')} `
                    + '(same types — may or may not be the same relationship)');
            } else {
                findings.MISSING.push(`${domain} ${path} -> [${targets.join(',')}]`
                    + `${maxItems ? ` max ${maxItems}` : ''}`);
            }
            return;
        }
        matched += 1;

        const tableTargets = [...(entry.allowed || [])].sort().join(',');
        const schemaTargets = targets.join(',');
        if (tableTargets !== schemaTargets) {
            findings.TARGETS.push(`${domain} ${path} table [${tableTargets}] schema [${schemaTargets}]`);
        }
        if ((entry.maxItems ?? null) !== maxItems) {
            findings.MAXITEMS.push(`${domain} ${path} table ${entry.maxItems ?? 'none'} schema ${maxItems ?? 'none'}`);
        }
    });

    tableEntries.filter((key) => !declaredKeys.has(key) && !accountedFor.has(key))
        .forEach((key) => findings['TABLE-ONLY'].push(key));

    // ---- the edges partition: which verbs, and at which ranges ----
    const usedPairs = new Map();
    Object.entries(table).forEach(([domain, partitions]) => {
        Object.values(partitions.edges || {}).forEach(({ path }) => {
            const [, verb, range] = path.split('.');
            if (!verb || !range) return;
            const pair = `${verb}.${range}`;
            usedPairs.set(pair, [...(usedPairs.get(pair) || []), domain]);
        });
    });
    const usedVerbs = new Set([...usedPairs.keys()].map((pair) => pair.split('.')[0]));

    [...usedVerbs].filter((verb) => !schemaVerbs.has(verb)).sort()
        .forEach((verb) => findings['VERB-UNDECLARED'].push(verb));

    [...usedPairs.keys()]
        .filter((pair) => schemaVerbs.has(pair.split('.')[0]) && !schemaPairs.has(pair))
        .sort()
        .forEach((pair) => findings['PAIR-UNDECLARED'].push(
            `${pair} (used by ${[...new Set(usedPairs.get(pair))].sort().join(', ')})`,
        ));

    /** Declared by the schema and used by nobody: the schema is ahead, which is harmless. */
    const unusedPairs = [...schemaPairs].filter((pair) => !usedPairs.has(pair)).sort();

    /** A TABLE-ONLY path whose leaf the schema declares elsewhere on the same entity. */
    const misplaced = findings['TABLE-ONLY'].filter((key) => {
        const [domain, path] = key.split(' ');
        const leaf = path.split('.').pop();
        return declared.some((rel) => rel.domain === domain
            && rel.path !== path
            && rel.path.split('.').pop() === leaf);
    });

    const report = [
        `declared by the schema, used by no edge (${unusedPairs.length}): the schema is ahead here,`,
        `  which costs nothing. ${unusedPairs.slice(0, 6).join(', ')}${unusedPairs.length > 6 ? ', …' : ''}`,
    ];
    if (misplaced.length) {
        report.push(
            `the same relationship at a path the schema does not declare (${misplaced.length}):`,
            ...misplaced.map((key) => `  ${key}`),
            'An entity carrying one of these fails omcValidate — v3.0 sets `unevaluatedProperties:',
            'false`. Re-pointing the path is a change to make in the Edge Editor and re-publish.',
        );
    }

    return {
        findings,
        summary: [
            `intrinsic — schema declares ${declared.length}; table holds ${tableEntries.length}; ${matched} matched`,
            `edges — schema declares ${schemaVerbs.size} verbs / ${schemaPairs.size} pairs; `
            + `table uses ${usedVerbs.size} verbs / ${usedPairs.size} pairs`,
        ],
        report,
    };
}
