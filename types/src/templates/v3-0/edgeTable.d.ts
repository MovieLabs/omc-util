/**
 * The shipped edge table: the published rows, with the seed's own rows added where the publication
 * has none.
 *
 * @returns {{table: Object, collisions: Array, provenance: {published: number, seed: string[]}}}
 *   `provenance.seed` names every row still coming from edges.js, as `<EntityType>.<partition> <path>`.
 */
export function unionEdgeTable(): {
    table: any;
    collisions: any[];
    provenance: {
        published: number;
        seed: string[];
    };
};
/**
 * The inverse map the library ships, unioned the same way: a predicate the publication names takes
 * the publication's inverse, and the seed answers for the predicates it does not name.
 *
 * Merged per predicate rather than per row, because that is the shape the map has — one inverse per
 * predicate — and it is what `omcTemplate.inverseEdge()` hands to fMam.
 *
 * @returns {Object<string, string>}
 */
export function unionInverseEdges(): {
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
    export { unionEdgeTable };
    export { unionInverseEdges };
}
export default _default;
//# sourceMappingURL=edgeTable.d.ts.map