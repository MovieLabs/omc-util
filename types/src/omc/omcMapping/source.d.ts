/**
 * The columns a source reads.
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {Array<string>}
 */
export function sourceColumns(source: (OmcMapping.ValueSource | null | undefined)): Array<string>;
/**
 * The value a source gives on one row: a column's cell as it is, or a template's text filled from
 * the row.
 *
 * @param {MappingRow} row
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {*} The value, or null when the cell is empty, or any column the template names is
 */
export function sourceValue(row: MappingRow, source: (OmcMapping.ValueSource | null | undefined)): any;
/**
 * A source as a note names it: `column "Scene"` or `template "scene-{Scene}"`.
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