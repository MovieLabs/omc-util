/**
 * Split a delimited cell into trimmed, de-duplicated, sorted members.
 *
 * Sorting matters: a source that writes the same set in two orders — `13; 15` on one row and
 * `15; 13` on another — would otherwise produce two different sets of edges for one relationship.
 * Numeric-looking members sort numerically, so `2` precedes `10`.
 *
 * @param {*} value - The cell value
 * @param {string} delimiter - What to split on
 * @returns {Array<string>} The members
 */
export function splitList(value: any, delimiter: string): Array<string>;
/**
 * Cast a cell to the type OMC declares for the property.
 *
 * A spreadsheet has no types worth trusting — every cell may arrive as a string — so a mapping says
 * what the value is and this makes it so.
 *
 * @param {*} value - The cell value
 * @param {string} as - Target type
 * @returns {*} The cast value, or null when it cannot be cast
 */
export function cast(value: any, as: string): any;
/**
 * The column that identifies this entity — either the nominated key, or the column feeding a
 * mapped `identifierValue`.
 *
 * Mapping the source's own id **is** nominating a key: it says "this column names the thing", which
 * is the only question `key` asks. Requiring both would mean stating it twice, and hashing over a
 * name the source already gave would make the entity unreachable by that name.
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {(string|null)} The column, or null when the mapping has neither
 */
export function identityColumn(mapping: OmcMapping.EntityMapping): (string | null);
/**
 * Does this entity take its identifier from the source rather than a hash?
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {boolean}
 */
export function hasSuppliedIdentifier(mapping: OmcMapping.EntityMapping): boolean;
/**
 * Map one row to OMC entities.
 *
 * @param {Object} params
 * @param {MappingRow} params.row - One row, keyed by column heading
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {{entities: Object.<string, Object>, notes: Array<OmcMapping.MappingNote>}} The
 *   entities by entityType, already linked to one another, and anything worth reporting
 * @throws {Error} When a mapping names a property or entityType the schema does not have
 */
export function mapRow({ row, mapping, options }: {
    row: MappingRow;
    mapping: Array<OmcMapping.EntityMapping>;
    options?: OmcMapping.MappingOptions;
}): {
    entities: {
        [x: string]: any;
    };
    notes: Array<OmcMapping.MappingNote>;
};
export default mapRow;
//# sourceMappingURL=mapRow.d.ts.map