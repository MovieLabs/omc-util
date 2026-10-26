/**
 * The columns a source reads.
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {Array<string>}
 */
export function sourceColumns(source: (OmcMapping.ValueSource | null | undefined)): Array<string>;
/**
 * The inputs a source reads.
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {Array<string>}
 */
export function sourceInputs(source: (OmcMapping.ValueSource | null | undefined)): Array<string>;
/**
 * The values an input path gives on one row, from every entity the row carries under that name.
 *
 * @param {MappingRow} row
 * @param {{input: string, path: string}} source
 * @returns {Array<*>} The distinct non-empty values
 */
export function inputValues(row: MappingRow, source: {
    input: string;
    path: string;
}): Array<any>;
/**
 * The value a source gives on one row: a column's cell as it is, a template's text filled from the
 * row, or an input's values — an array when there is more than one. An input read with no path gives
 * its entities' identities. A template token reading several values gives one text for each.
 *
 * @param {MappingRow} row
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @param {OmcMapping.MappingOptions} [options] - `identifierScope` chooses an entity's identity
 * @returns {*} The value, or null when the cell is empty, any token the template names is, or the
 *   input finds nothing
 */
export function sourceValue(row: MappingRow, source: (OmcMapping.ValueSource | null | undefined), options?: OmcMapping.MappingOptions): any;
/**
 * A source as a note names it: `column "Scene"`, `template "scene-{Scene}"` or
 * `input "video" path "label"`.
 *
 * @param {OmcMapping.ValueSource} source
 * @returns {string}
 */
export function sourceLabel(source: OmcMapping.ValueSource): string;
/**
 * Do two sources read the same thing?
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} a
 * @param {(OmcMapping.ValueSource|null|undefined)} b
 * @returns {boolean}
 */
export function sameSource(a: (OmcMapping.ValueSource | null | undefined), b: (OmcMapping.ValueSource | null | undefined)): boolean;
//# sourceMappingURL=source.d.ts.map