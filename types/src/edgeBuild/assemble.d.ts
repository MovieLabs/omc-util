/**
 * Build the table and the flat inverse map from a published document.
 *
 * Each row gains `rdfProperties`, the RDF model's own names for it, and `omcPredicate` becomes that
 * name where the row has exactly one. Where the model names none, `omcPredicate` keeps what the
 * predicate's own `rdf` states — null for a tentative one — and an empty `rdfProperties` says so.
 *
 * A row whose properties call a range something narrower also gains `narrowedRanges`. It is left
 * off the rest rather than written empty, because few rows carry one and the rest would carry an
 * empty array.
 *
 * @param {Object} document - The published edge document
 * @param {object} schema - The OMC v3.0 JSON Schema, for `maxItems`
 * @param {string} [where] - What to call the document in an error
 * @returns {{table: Object, inverseEdges: Object<string, string>, definitions: Object,
 *   collisions: string[], rows: number, rdfNamed: number, rdfUnmatched: string[]}}
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
    rdfUnmatched: string[];
};
export function rowKeys(table: any): string[];
//# sourceMappingURL=assemble.d.ts.map