/**
 * The verbs the schema declares, and the `verb.Range` pairs. The `edges` object and most predicates
 * leave `additionalProperties` open, so anything absent here still validates — which is why an
 * omission has to be reported rather than left to validation.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {{verbs: Set<string>, pairs: Set<string>}}
 */
export function schemaEdgeDeclarations(schema: object): {
    verbs: Set<string>;
    pairs: Set<string>;
};
export function isObject(v: any): boolean;
//# sourceMappingURL=declarations.d.ts.map