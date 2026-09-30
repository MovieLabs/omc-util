/**
 * @param {Object} edgeDefinitions - The published edge definitions. No default: a caller must
 * name its subject, so nothing can reach a table built from something it did not ask for.
 * @returns {{ table: Object, collisions: Array<string> }} The generated per-entity
 * edgeTable plus any same-key collisions detected during expansion.
 */
export function buildEdgeTable(edgeDefinitions: any): {
    table: any;
    collisions: Array<string>;
};
//# sourceMappingURL=buildEdgeTable.d.ts.map