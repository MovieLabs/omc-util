/**
 * Whether a mapping's property path is one the schema has.
 *
 * Asked by {@link module:omcMapping/check} before a run, and by {@link module:omcMapping/mapRow}
 * during one, so the two agree on which paths are written and which are skipped.
 *
 * @module omcMapping/paths
 */

import { omcTemplate } from '../../templates/index.js';

import { parseSegment } from './shapedValue.js';

/**
 * Walk a dotted path through a shape, descending into `$items` for array-of-object nodes.
 *
 * @param {Object} shape - The entity shape
 * @param {string} path - Dotted path, possibly with `[n]` indices
 * @returns {(Object|null)} The shape node at that path, or null when it does not resolve
 */
export function resolvePath(shape, path) {
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
export function resolveEdgePath(edgeTable, schemaVersion, path) {
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
 * Why a mapping cannot write this path, or null when it can: the entity has no such property, or
 * the path is a relationship slot rather than a value in one.
 *
 * @param {Object} params
 * @param {string} params.entityType
 * @param {string} params.schemaVersion
 * @param {string} params.path - The mapping's property path
 * @returns {({node: null, detail: string}|{node: Object, detail: null})} The shape node the path
 *   reaches, or why there is none
 */
export function pathNode({ entityType, schemaVersion, path }) {
    const edgeTable = omcTemplate.edgeTable({ entityType, schemaVersion }) ?? {};
    // A relationship path resolves against the edge table, not the shape.
    const asEdge = resolveEdgePath(edgeTable, schemaVersion, path);
    if (asEdge) {
        if (asEdge.node) return { node: asEdge.node, detail: null };
        return {
            node: null,
            detail: `"${path}" is a relationship to ${asEdge.edge.allowed.join(' or ')}, not a value. Map `
                + 'onto its identifierValue to reference an entity by an id the source carries, or link '
                + 'the two entities on the canvas',
        };
    }
    const node = resolvePath(omcTemplate.shape({ entityType, schemaVersion }), path);
    if (node) return { node, detail: null };
    return { node: null, detail: `${entityType} has no property "${path}" in ${omcTemplate.versionLabel(schemaVersion)}` };
}
