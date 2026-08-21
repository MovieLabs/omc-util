/**
 * Check a mapping before it is saved or run.
 *
 * Two checks, deliberately separate because they answer different questions and are available at
 * different times. {@link check} asks whether the mapping describes legal OMC — it needs only the
 * schema, so an editor can run it on every keystroke. {@link checkColumns} asks whether it fits the
 * data in front of it, which needs a set of column headings but still not a single row.
 *
 * Neither ever sees data. That is what keeps them usable in an authoring UI, where the point is to
 * make an invalid mapping unauthorable rather than merely rejected.
 *
 * @module omcMapping/check
 */

import { omcTemplate } from '../../templates/index.js';

import { resolveOptions } from './entity.js';
import { identityColumn } from './mapRow.js';
import { parseSegment } from './shapedValue.js';

import './types.js'; // Type definitions, resolved globally by JSDoc

/**
 * Walk a dotted path through a shape, descending into `$items` for array-of-object nodes.
 *
 * @param {Object} shape - The entity shape
 * @param {string} path - Dotted path, possibly with `[n]` indices
 * @returns {(Object|null)} The shape node at that path, or null when it does not resolve
 */
function resolvePath(shape, path) {
    let node = shape;
    for (const segment of path.split('.')) {
        const { name } = parseSegment(segment);
        if (!node || typeof node !== 'object') return null;
        const next = node[name];
        if (!next) return null;
        node = next.$type === 'array' && next.$items ? next.$items : next;
        if (node !== next && Object.keys(node).every((k) => k.startsWith('$'))) node = next;
    }
    return node;
}

/**
 * Resolve a path that writes into a relationship slot.
 *
 * `omcTemplate.shape()` is deliberately data-only — relationships are delivered by `edgeTable()` —
 * so a path like `edges.has.Slate[0].identifier[0].identifierValue` resolves against neither the
 * shape nor anything else, and was reported as a property the entity does not have.
 *
 * It is a legitimate and useful mapping: it references an entity by an identifier the source
 * already carries, without building that entity. So the edge part is checked against the edge
 * table, and the remainder against the reference template — which is stricter than the shape walk
 * would have been, since it also rejects writing an arbitrary property into a reference.
 *
 * @param {Object} edgeTable - `omcTemplate.edgeTable()` for this entity
 * @param {string} schemaVersion
 * @param {string} path - The mapping's property path
 * @returns {({node: Object, edge: Object}|null)} The resolved leaf and the edge it sits in, or
 *   null when the path is not a relationship path at all
 */
function resolveEdgePath(edgeTable, schemaVersion, path) {
    const all = { ...edgeTable.intrinsic ?? {}, ...edgeTable.edges ?? {} };
    // Longest first, so `edges.has.Slate` wins over a shorter entry that also prefixes the path.
    const entry = Object.values(all)
        .filter((e) => path === e.path || path.startsWith(`${e.path}[`) || path.startsWith(`${e.path}.`))
        .sort((a, b) => b.path.length - a.path.length)[0];
    if (!entry) return null;

    const rest = path.slice(entry.path.length).replace(/^\[\d+\]\.?/, '').replace(/^\./, '');
    // The slot itself, with nothing after it, is a relationship — not something a column fills.
    if (!rest) return { node: null, edge: entry };

    const node = resolvePath(omcTemplate.referenceTemplate({ schemaVersion }), rest);
    return { node, edge: entry };
}

/**
 * Check a mapping against the schema.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Schema version comes from here
 * @returns {{valid: boolean, schemaVersion: string, checked: Object,
 *   problems: Array<OmcMapping.MappingNote>}} The outcome
 */
export function check({ mapping, options = {} }) {
    const { schemaVersion } = resolveOptions(options);
    const problems = [];
    const known = new Set(omcTemplate.allEntityTypes({ schemaVersion }) ?? []);
    const seenTypes = new Set();
    let properties = 0;
    let edges = 0;

    for (const entry of mapping ?? []) {
        const { entityType } = entry;
        const where = entityType ?? '(no entityType)';

        if (!entityType || !known.has(entityType)) {
            problems.push({
                kind: 'unknownEntityType',
                where,
                detail: `${omcTemplate.versionLabel(schemaVersion)} has no entity type "${entityType}"`,
            });
            continue;
        }
        // A template maps several entities from one row, each of a distinct type — the type is the
        // entity's identity, and two entries sharing one would be indistinguishable to an edge.
        if (seenTypes.has(entityType)) {
            problems.push({
                kind: 'duplicateEntityType',
                where,
                detail: `${entityType} is mapped more than once; each entity in a template must be `
                    + 'of a different type',
            });
        }
        seenTypes.add(entityType);

        // Mapping the source's own id counts as nominating a key: it already says which column
        // names the thing, and the identifier is taken verbatim rather than hashed.
        if (!identityColumn(entry)) {
            problems.push({
                kind: 'missingKey',
                where,
                detail: 'no key column, so this entity has nothing to identify it by and a re-run '
                    + 'would duplicate rather than update it. Nominate a key, or map the source\'s '
                    + 'own id onto identifierValue',
            });
        }

        const shape = omcTemplate.shape({ entityType, schemaVersion });
        const edgeTable = omcTemplate.edgeTable({ entityType, schemaVersion }) ?? {};

        for (const path of [...Object.keys(entry.properties ?? {}), ...Object.keys(entry.notes ?? {})]) {
            properties += 1;
            // A relationship path resolves against the edge table, not the shape.
            const asEdge = resolveEdgePath(edgeTable, schemaVersion, path);
            if (asEdge) {
                if (!asEdge.node) {
                    problems.push({
                        kind: 'unknownProperty',
                        where,
                        detail: `"${path}" is a relationship to ${asEdge.edge.allowed.join(' or ')}, not a `
                            + 'value. Map onto its identifierValue to reference an entity by an id '
                            + 'the source carries, or link the two entities on the canvas',
                    });
                }
                continue;
            }
            const node = resolvePath(shape, path);
            if (!node) {
                problems.push({
                    kind: 'unknownProperty',
                    where,
                    detail: `${entityType} has no property "${path}" in `
                        + `${omcTemplate.versionLabel(schemaVersion)}`,
                });
                continue;
            }
            const spec = entry.properties?.[path];
            const fixed = spec && typeof spec === 'object' ? spec.const : undefined;
            if (fixed !== undefined && Array.isArray(node.$controlledValues)
                && !node.$controlledValues.includes(fixed)) {
                problems.push({
                    kind: 'valueNotAllowed',
                    where,
                    detail: `"${fixed}" is not an allowed value for ${path}; the schema permits `
                        + `${node.$controlledValues.join(', ')}`,
                });
            }
        }

        const allEdges = { ...edgeTable.intrinsic ?? {}, ...edgeTable.edges ?? {} };
        for (const edge of entry.edges ?? []) {
            edges += 1;
            // `edgeKey` names the relationship being filled. When it is given, that relationship is
            // what has to admit the target — "some edge somewhere allows this type" would pass a
            // mapping that writes the reference into a different relationship than it names. It is
            // optional, so a mapping that names no relationship is still checked the old way.
            const named = edge.edgeKey ? allEdges[edge.edgeKey] : null;
            if (edge.edgeKey && !named) {
                problems.push({
                    kind: 'edgeNotAllowed',
                    where,
                    detail: `${entityType} has no relationship "${edge.edgeKey}" in `
                        + `${omcTemplate.versionLabel(schemaVersion)}`,
                });
                continue;
            }
            const allowed = named
                ? named.allowed?.includes(edge.to)
                : Object.values(allEdges).some((e) => e.allowed?.includes(edge.to));
            if (!allowed) {
                problems.push({
                    kind: 'edgeNotAllowed',
                    where,
                    detail: named
                        ? `${entityType}.${edge.edgeKey} cannot reference ${edge.to} in `
                            + `${omcTemplate.versionLabel(schemaVersion)}; it admits `
                            + `${named.allowed?.join(' or ') || 'nothing'}`
                        : `${entityType} cannot reference ${edge.to} in `
                            + `${omcTemplate.versionLabel(schemaVersion)}`,
                });
            }
        }
    }

    // An inverse written from both ends produces the relationship twice. Nothing at run time
    // notices, so it has to be caught here.
    const pairs = new Map();
    for (const entry of mapping ?? []) {
        for (const edge of entry.edges ?? []) {
            if (!edge.inverse) continue;
            const key = [entry.entityType, edge.to].sort().join('::');
            if (pairs.has(key)) {
                problems.push({
                    kind: 'inverseDeclaredTwice',
                    where: key.replace('::', ' <-> '),
                    detail: 'both ends declare inverse: true, so this relationship would be written '
                        + 'twice. Declare it on one side only',
                });
            }
            pairs.set(key, true);
        }
    }

    return {
        valid: problems.length === 0,
        schemaVersion,
        checked: { entityTypes: [...seenTypes], properties, edges },
        problems,
    };
}

/**
 * Check a mapping against the columns it will actually be given.
 *
 * The schema check cannot do this — it never learns what the data looks like — and a mapping that
 * is perfectly legal OMC still produces nothing if it names a column that is not there. Which is
 * the failure people actually hit, because column headings change.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {Array<string>} params.columns - The column headings available
 * @returns {{valid: boolean, problems: Array<OmcMapping.MappingNote>, missing: Array<string>}}
 *   The outcome, and every column named but absent
 */
export function checkColumns({ mapping, columns }) {
    const have = new Set(columns ?? []);
    const problems = [];
    const missing = new Set();

    const want = (column, where, what) => {
        if (!column || have.has(column)) return;
        missing.add(column);
        problems.push({
            kind: 'unknownColumn',
            where,
            detail: `${what} names column "${column}", which is not in this data`,
        });
    };

    for (const entry of mapping ?? []) {
        const where = entry.entityType ?? '(no entityType)';
        // Only when it is the identity — an entity naming itself through identifierValue has no
        // separate key column to check.
        if (entry.key) want(entry.key, where, 'the key');
        for (const [path, spec] of Object.entries(entry.properties ?? {})) {
            const source = typeof spec === 'string' ? { from: spec } : spec;
            if (source.const === undefined) want(source.from, where, path);
        }
        for (const [path, entries] of Object.entries(entry.notes ?? {})) {
            (entries ?? []).forEach((n) => want(n.from, where, path));
        }
        for (const edge of entry.edges ?? []) {
            want(edge.via, where, `the edge to ${edge.to}`);
        }
        for (const column of entry.customData?.exclude ?? []) {
            want(column, where, 'customData.exclude');
        }
    }

    return { valid: problems.length === 0, problems, missing: [...missing] };
}
