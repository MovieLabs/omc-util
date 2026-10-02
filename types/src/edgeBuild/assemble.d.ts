/**
 * Build the table and the flat inverse map from a published document.
 *
 * Each row gains `rdfProperties`, the RDF model's own names for it, and `omcPredicate` becomes that
 * name where the row has exactly one. The `omcT:` template survives only where the RDF model names
 * nothing, and an empty `rdfProperties` is what says so.
 *
 * @param {Object} document - The published edge document
 * @param {object} schema - The OMC v3.0 JSON Schema, for `maxItems`
 * @param {string} [where] - What to call the document in an error
 * @returns {{table: Object, inverseEdges: Object<string, string>, definitions: Object,
 *   collisions: string[], rows: number, rdfNamed: number}}
 */
export function edgeTableFrom(document: any, schema: object, where?: string): {
    table: any;
    inverseEdges: {
        [x: string]: string;
    };
    definitions: any;
    collisions: string[];
    rows: number;
    rdfNamed: number;
};
export function rowKeys(table: any): string[];
//# sourceMappingURL=assemble.d.ts.map