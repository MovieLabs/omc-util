/**
 * Spread edges: a relationship between every listed domain and every listed range, carried in the
 * edge table as its definitions and expanded into ordinary rows when the table is loaded.
 *
 * `informs` joins any entity to any other. Written out, that is a row for every pair on both ends,
 * which would be most of the table; as definitions it is two lists of names. Expanding at load keeps
 * the table small while every reader still finds a row at `edges.<predicate>.<Range>`.
 *
 * A spread row sits under `edges`, which the schema never caps, so it carries no `maxItems`.
 *
 * Browser-safe: `src/templates` calls it on the bundled table and on one installed at runtime.
 *
 * @module edgeBuild/spread
 * @ignore
 */

import { buildEdgeTable } from './buildEdgeTable.js';
import { definitionsFrom } from './definitions.js';

const PARTITION_NAMES = ['intrinsic', 'edges', 'cxtEdges'];

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
export function expandSpread(table, spreadEdges) {
    if (!spreadEdges || !Object.keys(spreadEdges).length) return table;
    const definitions = definitionsFrom({ edgeDefinitions: spreadEdges }, 'spreadEdges');
    const { table: spread } = buildEdgeTable(definitions, new Map());

    const expanded = { ...table };
    Object.entries(spread).forEach(([entityType, partitions]) => {
        const held = table[entityType] ?? {};
        expanded[entityType] = Object.fromEntries(PARTITION_NAMES.map((partition) => {
            const rows = { ...held[partition] ?? {} };
            Object.entries(partitions[partition] ?? {}).forEach(([path, row]) => {
                if (rows[path]) return;
                rows[path] = { ...row, rdfProperties: row.omcPredicate ? [row.omcPredicate] : [] };
            });
            return [partition, rows];
        }));
    });
    return expanded;
}

/**
 * How many rows the spread edges expand to, counting every domain × range of every group.
 *
 * @param {Object<string, object>} [spreadEdges]
 * @returns {number}
 */
export const spreadRowCount = ((spreadEdges) => Object.values(spreadEdges ?? {})
    .flatMap((def) => def.connects ?? [])
    .reduce((sum, group) => sum + (group.domain?.length ?? 0) * (group.range?.length ?? 0), 0));
