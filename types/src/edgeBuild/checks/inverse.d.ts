/**
 * @param {{table: Object, definitions: Object, schema: Object, collisions?: string[]}} subject
 * @returns {{findings: Object<string, string[]>, summary: string[], report: string[]}}
 */
export function run({ table, definitions, schema, collisions, }: {
    table: any;
    definitions: any;
    schema: any;
    collisions?: string[];
}): {
    findings: {
        [x: string]: string[];
    };
    summary: string[];
    report: string[];
};
export const name: "EDGE INVERSE";
/**
 * What each finding costs. Nothing here mints invalid OMC: a reverse edge lands in the shared
 * `edges` block, which is `additionalProperties: true`, so every one of these validates. They are
 * incomplete or unrecorded relationships, which is work rather than breakage.
 */
export const severity: {
    'NO-INVERSE': string;
    'NOT-INVOLUTIVE': string;
    'INVERSE-UNDECLARED': string;
    'INVERSE-UNREACHABLE': string;
};
//# sourceMappingURL=inverse.d.ts.map