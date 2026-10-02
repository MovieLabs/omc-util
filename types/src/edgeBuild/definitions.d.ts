/**
 * The definitions of a published document with each `rdf` token turned into its function, refused
 * unless they look like definitions.
 *
 * Without the refusal, a document shaped differently from expected is read as a set of predicates
 * named after its top-level keys — `generated`, `namespace`, `json`, `rdf`. A nonsense build that
 * runs is worse than one that refuses.
 *
 * @param {Object} doc - A parsed published document
 * @param {string} where - What to name in the error
 * @returns {Object<string, object>}
 * @throws {Error} When the document holds nothing shaped like edge definitions
 */
export function definitionsFrom(doc: any, where: string): {
    [x: string]: any;
};
export function tentativeRdf({ domain, predicate, range }: {
    domain: string;
    predicate: string;
    range: string;
}): string;
export function intrinsicRdf({ predicate }: {
    predicate: string;
}): string;
export function definitionsOf(doc: any): any;
export function inverseMapFrom(definitions: any): {
    [x: string]: string;
};
//# sourceMappingURL=definitions.d.ts.map