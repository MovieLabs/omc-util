/**
 * The shipped edge table, straight from the publication.
 *
 * @returns {{table: Object, collisions: Array, rows: number}}
 */
export function shippedEdgeTable(): {
    table: any;
    collisions: any[];
    rows: number;
};
/**
 * The inverse map the library ships: the publication's, with nothing merged underneath.
 *
 * @returns {Object<string, string>}
 */
export function shippedInverseEdges(): {
    [x: string]: string;
};
/** The published definitions, with each `rdf` token turned back into its generator. */
export const publishedDefinitions: {
    [x: string]: any;
};
/** What the publication says about itself: the view, and how much of it there is. */
export const publishedInfo: {};
declare namespace _default {
    export { publishedDefinitions };
    export { publishedInfo };
    export { shippedEdgeTable };
    export { shippedInverseEdges };
}
export default _default;
//# sourceMappingURL=edgeTable.d.ts.map