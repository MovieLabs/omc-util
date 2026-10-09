/**
 * Check a mapping against the schema.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Schema version comes from here
 * @returns {{valid: boolean, schemaVersion: string, checked: Object,
 *   problems: Array<OmcMapping.MappingNote>, warnings: Array<OmcMapping.MappingNote>}} The outcome.
 *   `valid` reflects `problems` only; a warning, such as a fixed value outside a property's
 *   controlled values, never stops a save or a run
 */
export function check({ mapping, options }: {
    mapping: Array<OmcMapping.EntityMapping>;
    options?: OmcMapping.MappingOptions;
}): {
    valid: boolean;
    schemaVersion: string;
    checked: any;
    problems: Array<OmcMapping.MappingNote>;
    warnings: Array<OmcMapping.MappingNote>;
};
/**
 * Check a mapping against the columns it will actually be given.
 *
 * The schema check cannot do this — it never learns what the data looks like — and a mapping that
 * is perfectly legal OMC still produces nothing if it names a column that is not there. Which is
 * the failure people actually hit, because column headings change.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {Array<string>} params.columns - The column headings available
 * @returns {{valid: boolean, problems: Array<OmcMapping.MappingNote>, missing: Array<string>}}
 *   The outcome, and every column named but absent
 */
export function checkColumns({ mapping, columns }: {
    mapping: Array<OmcMapping.EntityMapping>;
    columns: Array<string>;
}): {
    valid: boolean;
    problems: Array<OmcMapping.MappingNote>;
    missing: Array<string>;
};
//# sourceMappingURL=check.d.ts.map