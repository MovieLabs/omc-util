/**
 * Walk a dotted path through a shape, descending into `$items` for array-of-object nodes.
 *
 * @param {Object} shape - The entity shape
 * @param {string} path - Dotted path, possibly with `[n]` indices
 * @returns {(Object|null)} The shape node at that path, or null when it does not resolve
 */
export function resolvePath(shape: any, path: string): (any | null);
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
export function resolveEdgePath(edgeTable: any, schemaVersion: string, path: string): ({
    node: any;
    edge: any;
} | null);
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
export function pathNode({ entityType, schemaVersion, path }: {
    entityType: string;
    schemaVersion: string;
    path: string;
}): ({
    node: null;
    detail: string;
} | {
    node: any;
    detail: null;
});
//# sourceMappingURL=paths.d.ts.map