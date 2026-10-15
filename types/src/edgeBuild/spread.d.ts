/**
 * The table with its spread edges expanded into rows.
 *
 * A row the table already holds at the same path is kept, so an edge drawn between two particular
 * entities still says what it says. Returns a new table; neither argument is changed.
 *
 * @param {Object} table - Per-entity edge tables
 * @param {Object<string, object>} [spreadEdges] - Definitions holding only spread groups, `rdf` as a token
 * @returns {Object} The table, with a row for every pairing the spread edges state
 */
export function expandSpread(table: any, spreadEdges?: {
    [x: string]: any;
}): any;
export function spreadRowCount(spreadEdges: any): any;
//# sourceMappingURL=spread.d.ts.map