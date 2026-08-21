/**
 * Start a run.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {{add: Function, result: Function}} The accumulator
 *
 * @example
 * const run = createRun({ mapping, options });
 * rows.forEach((row) => run.add(row));
 * const { entities, notes, counts } = run.result();
 */
export function createRun({ mapping, options }: {
    mapping: Array<OmcMapping.EntityMapping>;
    options?: OmcMapping.MappingOptions;
}): {
    add: Function;
    result: Function;
};
export default createRun;
//# sourceMappingURL=createRun.d.ts.map