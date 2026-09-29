/**
 * Guard: every relationship the v3.0 schema declares as a named property is in the edge table,
 * at the path the schema declares, with the targets and cap the schema declares.
 *
 * Scope is the INTRINSIC partition only, and that is a property of the schema rather than a
 * simplification. An entity's `edges` object is one shared `$ref` to core.properties.edges, so
 * the schema permits every predicate/range slot on every entity type and says nothing about
 * which ones a given type participates in — that is edges.js's own judgment, and edgeParity.js
 * guards it against a baseline instead. A named capitalized property IS declared per entity, so
 * it can be checked, and it is the half where a mistake produces invalid OMC: v3.0 sets
 * `unevaluatedProperties: false`, so an intrinsic edge written at a path the schema does not
 * declare makes the whole entity fail validation.
 *
 * That is not hypothetical. edges.js writes CreativeWork's Series/Season/Episode at the top
 * level while the schema declares them under creativeWorkProperties, so edgeCreate() currently
 * mints CreativeWork entities omcValidate rejects. The same shape applies to the Member
 * properties of AssetStructure, InfrastructureStructure, ParticipantStructure and TaskStructure.
 *
 * Differences are matched verbatim against an accept file, exactly as edgeParity.js does, so the
 * known gaps are declared in one reviewable place and anything new fails. This is a development
 * gate, not a runtime one: the shipped table has to be static, and the point is that it cannot
 * quietly fall behind the schema while it is being worked on.
 *
 *   Usage: node test/omc-v3-0/edgeCoverage.js [--accept <file>]
 *       default accept file: test/omc-v3-0/edgeCoverage.accept.txt
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isCapitalized } from '../../src/mlHelpers/util.js';
import schemav30 from '../../src/omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import { listEntities, mergeAllOf, resolveRef } from '../../src/templates/schemaDerive.js';
import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';

const here = dirname(fileURLToPath(import.meta.url));
const defaultAcceptPath = join(here, 'edgeCoverage.accept.txt');

/**
 * Top-level keys that carry no intrinsic relationship, whatever their shape.
 *   edges        — the shared predicate block (see the header); guarded by edgeParity instead
 *   instanceInfo — provenance the derived shape excludes, and no consumer edits as an edge
 *   Context      — the v2.x edge carrier, kept in v3.0 for migration, modelled in edges.js
 */
const SKIP_KEYS = new Set(['edges', 'instanceInfo', 'Context']);

/** How deep a data container may nest before a relationship inside it stops being looked for. */
const MAX_DEPTH = 3;

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

const line = (s = '') => console.log(s);
const isObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);
const refTail = (ref) => (typeof ref === 'string' ? ref.split('/').pop() : null);

/** A reference branch: the `anyOf` member that allows a bare `{ identifier }` in place of an entity. */
const isReferenceBranch = (node) => isObject(node)
    && typeof node.$ref === 'string'
    && node.$ref.endsWith('core/properties/reference');

/**
 * Every intrinsic relationship the schema declares, as `{ domain, path, targets, maxItems }`.
 *
 * A property is a relationship when its key is capitalized — the library's own convention, see
 * omcTemplate.isRelationshipKey — and its `items.anyOf` offers a reference branch. Reading
 * `items.anyOf` is the one thing the existing walkers decline to do (schemaDerive walks data
 * shapes, and following an edge's target list would recurse into other entities without end), so
 * it is read here, one level, for the target types only.
 *
 * @param {Object} schema - The JSON Schema document
 * @returns {Array<{domain: string, path: string, targets: string[], maxItems: number|null}>}
 */
function schemaRelationships(schema) {
    const found = [];

    const walk = (node, prefix, domain, depth) => {
        const { properties } = mergeAllOf(schema, node) || {};
        if (!isObject(properties)) return;

        Object.entries(properties).forEach(([key, declared]) => {
            if (!prefix && SKIP_KEYS.has(key)) return;
            const resolved = isObject(declared) && declared.$ref
                ? resolveRef(schema, declared.$ref)
                : declared;
            if (!isObject(resolved)) return;

            const path = prefix ? `${prefix}.${key}` : key;
            const branches = resolved.items?.anyOf;

            if (isCapitalized(key) && Array.isArray(branches) && branches.some(isReferenceBranch)) {
                found.push({
                    domain,
                    path,
                    targets: branches.filter((branch) => !isReferenceBranch(branch))
                        .map((branch) => refTail(branch.$ref))
                        .filter(Boolean)
                        .sort(),
                    maxItems: resolved.maxItems ?? null,
                });
                return;
            }
            // A lowercase key may be a data container holding relationships (versionInfo,
            // creativeWorkProperties, assetStructureProperties.assetGroup); descend into it.
            if (!isCapitalized(key) && depth < MAX_DEPTH
                && (resolved.type === 'object' || isObject(resolved.properties))) {
                walk(resolved, path, domain, depth + 1);
            }
        });
    };

    listEntities(schema).forEach((def, entityType) => walk(def, '', entityType, 0));
    return found;
}

// ---- the two sides ----------------------------------------------------------

const declared = schemaRelationships(schemav30);
const { table } = buildEdgeTable();

const intrinsicOf = (domain) => table[domain]?.intrinsic || {};
const tableEntries = Object.entries(table).flatMap(([domain, partitions]) => (
    Object.keys(partitions.intrinsic || {}).map((path) => `${domain} ${path}`)
));
const declaredKeys = new Set(declared.map(({ domain, path }) => `${domain} ${path}`));

// ---- differences ------------------------------------------------------------

const differences = { 'MISSING': [], 'TABLE-ONLY': [], 'TARGETS': [], 'MAXITEMS': [] };
let matched = 0;

declared.forEach(({
    domain, path, targets, maxItems,
}) => {
    const entry = intrinsicOf(domain)[path];
    if (!entry) {
        differences.MISSING.push(`${domain} ${path} -> [${targets.join(',')}]`
            + `${maxItems ? ` max ${maxItems}` : ''}`);
        return;
    }
    matched += 1;

    const tableTargets = [...(entry.allowed || [])].sort().join(',');
    const schemaTargets = targets.join(',');
    if (tableTargets !== schemaTargets) {
        differences.TARGETS.push(`${domain} ${path} table [${tableTargets}] schema [${schemaTargets}]`);
    }
    if ((entry.maxItems ?? null) !== maxItems) {
        differences.MAXITEMS.push(`${domain} ${path} table ${entry.maxItems ?? 'none'} schema ${maxItems ?? 'none'}`);
    }
});

tableEntries.filter((key) => !declaredKeys.has(key))
    .forEach((key) => differences['TABLE-ONLY'].push(key));

/**
 * A TABLE-ONLY path whose last segment also appears, on the same entity, at a path the schema
 * does declare: the same relationship written to the wrong place. These are the ones that make
 * an entity fail validation, so they are called out rather than left in a list of 30.
 */
const misplaced = differences['TABLE-ONLY'].filter((key) => {
    const [domain, path] = key.split(' ');
    const leaf = path.split('.').pop();
    return declared.some((rel) => rel.domain === domain
        && rel.path !== path
        && rel.path.split('.').pop() === leaf);
});

// ===== GATE ==================================================================
line('=== EDGE COVERAGE GATE (intrinsic partition) ===');
line(`  schema declares ${declared.length}; table holds ${tableEntries.length}; ${matched} matched`);

const acceptPath = argValue('--accept') || defaultAcceptPath;
const accepted = new Set(existsSync(acceptPath)
    ? readFileSync(acceptPath, 'utf8').split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter((entry) => entry && !entry.startsWith('#'))
    : []);

let failing = 0;
Object.entries(differences).forEach(([kind, lines]) => {
    if (!lines.length) {
        console.log(`  ✓ ${kind}: none`);
        return;
    }
    line(`\n  ${kind} (${lines.length})`);
    lines.forEach((entry) => {
        const full = `${kind} ${entry}`;
        const ok = accepted.has(full);
        if (!ok) failing += 1;
        console.log(`    ${ok ? '=' : '!'} ${full}`);
    });
});

// ===== REPORT (informational — not a gate) ===================================
if (misplaced.length) {
    line('');
    line('=== REPORT (informational — not a gate) ===');
    line(`  the same relationship at a path the schema does not declare (${misplaced.length}):`);
    misplaced.forEach((key) => line(`    ${key}`));
    line('  An entity carrying one of these fails omcValidate — v3.0 sets');
    line('  `unevaluatedProperties: false`, so the undeclared property invalidates the whole');
    line('  entity. Re-pointing the path in edges.js changes where consumers read, so it is its');
    line('  own change, not a fix to make from here.');
}

// ===== RESULT ================================================================
line('');
line(`Schema ${declared.length} intrinsic relationships; `
    + `${failing} unaccepted difference${failing === 1 ? '' : 's'}.`);
if (failing) {
    console.error(`EDGE COVERAGE GATE FAILED. Fix edges.js, or declare the difference in ${acceptPath}.`);
    process.exit(1);
}
line('EDGE COVERAGE GATE PASSED.');
