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
 * The spec a mapping gives the scope beside its mapped identifierValue, if it gives one.
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {(OmcMapping.PropertyMapping|undefined)} The spec, or undefined when the scope is the run's
 */
export function identifierScopeSpec(mapping: OmcMapping.EntityMapping): (OmcMapping.PropertyMapping | undefined);
/**
 * What identifies this entity — either the nominated key, or the source feeding a mapped
 * `identifierValue`.
 *
 * Mapping the source's own id **is** nominating a key: it says "this names the thing", which is the
 * only question `key` asks. Requiring both would mean stating it twice, and hashing over a name the
 * source already gave would make the entity unreachable by that name.
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {(OmcMapping.ValueSource|null)} The column or template, or null when the mapping has
 *   neither
 */
export function identitySource(mapping: OmcMapping.EntityMapping): (OmcMapping.ValueSource | null);
/**
 * Does this entity take its identifier from the source rather than a hash?
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {boolean}
 */
export function hasSuppliedIdentifier(mapping: OmcMapping.EntityMapping): boolean;
/**
 * What an edge points at: the entry it names with `to`; with `toType`, an entityType that no entry
 * in this template builds; or, with `input`, the entities the row carries under that name.
 *
 * @param {Array<OmcMapping.EntityMapping>} mapping - The whole template
 * @param {OmcMapping.EdgeMapping} edge - One of its edges
 * @returns {({entry: (OmcMapping.EntityMapping|null), entityType: (string|null)}|null)} The target
 *   entry (null for a `toType` or `input` reference) and its entityType (null for an `input` edge
 *   with no `toType`, whose type only the row knows), or null when `to` names no entry or the edge
 *   names no target
 */
export function edgeTarget(mapping: Array<OmcMapping.EntityMapping>, edge: OmcMapping.EdgeMapping): ({
    entry: (OmcMapping.EntityMapping | null);
    entityType: (string | null);
} | null);
/**
 * Map one row to OMC entities.
 *
 * @param {Object} params
 * @param {MappingRow} params.row - One row, keyed by column heading, and by input name for inputs
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {{entities: Object.<string, Object>, notes: Array<OmcMapping.MappingNote>, inverses: Array<Object>}}
 *   The entities by entry id, already linked to one another, anything worth reporting, and the
 *   inverses whose target another row, or no row, builds. Two entries that build the same entity
 *   each hold a copy; {@link module:omcMapping/createRun} folds them and writes those inverses. A
 *   row with a `severalValues` note builds nothing
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
    inverses: Array<any>;
};
export function specSource(spec: OmcMapping.PropertyMapping): (OmcMapping.ValueSource | null);
export default mapRow;
//# sourceMappingURL=mapRow.d.ts.map