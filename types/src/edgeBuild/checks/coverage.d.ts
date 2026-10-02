/**
 * Compare a built table with the schema.
 *
 * @param {{table: Object, schema: Object}} subject
 * @returns {{findings: Object<string, string[]>, summary: string[], report: string[]}}
 */
export function run({ table, schema, rdfUnmatched }: {
    table: any;
    schema: any;
}): {
    findings: {
        [x: string]: string[];
    };
    summary: string[];
    report: string[];
};
export const name: "EDGE COVERAGE";
/**
 * What each finding costs, which is what decides whether it can refuse a build.
 *
 * The intrinsic partition is where a mistake mints invalid OMC. A named capitalised property is
 * declared per entity, and v3.0 sets `unevaluatedProperties: false`, so one written at a path the
 * schema does not declare — or with a target or cap the schema disagrees with — makes the whole
 * entity fail `omcValidate`. Shipping a table that does that is not a judgement call.
 *
 * The `edges` partition cannot be wrong in that way: it is one shared `$ref` with
 * `additionalProperties: true` at both levels, so an undeclared verb or pair validates silently.
 * What it costs is that the schema has no record of the relationship, so nothing can be narrowed
 * onto it. That is outstanding work, and MISSING likewise: the table is incomplete, not invalid.
 */
export const severity: {
    MISSING: string;
    MISPLACED: string;
    'OTHER-BUCKET': string;
    'TABLE-ONLY': string;
    TARGETS: string;
    MAXITEMS: string;
    'VERB-UNDECLARED': string;
    'PAIR-UNDECLARED': string;
    'RDF-UNMATCHED': string;
};
//# sourceMappingURL=coverage.d.ts.map