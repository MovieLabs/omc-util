/**
 * @param {Object} edgeDefinitions - Definitions as `definitionsFrom` returns them
 * @param {Map<string, number>} maxItemsIndex - From `buildMaxItemsIndex(schema)`
 * @param {Object} [inverseDefinitions] - Where each row's inverse is looked up, when that is a wider
 *   set than the rows are built from; defaults to `edgeDefinitions`
 * @returns {{ table: Object, collisions: Array<string> }} The per-entity edge table, and any two
 *   definitions that claimed one storage path
 */
export function buildEdgeTable(edgeDefinitions: any, maxItemsIndex: Map<string, number>, inverseDefinitions?: any): {
    table: any;
    collisions: Array<string>;
};
//# sourceMappingURL=buildEdgeTable.d.ts.map