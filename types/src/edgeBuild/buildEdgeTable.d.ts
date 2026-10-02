/**
 * @param {Object} edgeDefinitions - Definitions as `definitionsFrom` returns them
 * @param {Map<string, number>} maxItemsIndex - From `buildMaxItemsIndex(schema)`
 * @returns {{ table: Object, collisions: Array<string> }} The per-entity edge table, and any two
 *   definitions that claimed one storage path
 */
export function buildEdgeTable(edgeDefinitions: any, maxItemsIndex: Map<string, number>): {
    table: any;
    collisions: Array<string>;
};
//# sourceMappingURL=buildEdgeTable.d.ts.map