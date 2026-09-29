/**
 * @param {Object} [edgeDefinitions] - Edge definitions in the edges.js shape; defaults to
 * the bundled edges.js
 * @returns {{ table: Object, collisions: Array<string> }} The generated per-entity
 * edgeTable plus any same-key collisions detected during expansion.
 */
export function buildEdgeTable(edgeDefinitions?: any): {
    table: any;
    collisions: Array<string>;
};
//# sourceMappingURL=buildEdgeTable.d.ts.map