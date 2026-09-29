/**
 * The edge table the library ships, built from what the Edge Editor published and nothing else.
 *
 * `edgeDefinitions.json` is that publication — the OMC-JSON projection of the edges authored in the
 * tool, exported from `/api/vocab/v1/edges/publish`. Replace that file with a fresh export and the
 * shipped table follows.
 *
 * ## The seed is parked
 *
 * `edges.js` is the hand-written set the tool was seeded from, and for one commit it filled the
 * rows the publication did not build. It no longer does. A table half from a file nobody edits is
 * one nobody can reason about, and there was no way to tell, in the graph or anywhere else, which
 * half an edge had come from.
 *
 * Nothing on the path from the publication to the shipped table imports it: the RDF name templates
 * it used to own are in `rdfTemplates.js`, `buildEdgeTable` has no default definitions, so a caller
 * cannot reach the seed by omission, and the inverse map no longer merges its supplemental pairs.
 *
 * What the seed used to supply and the publication does not is therefore **absent**, not hidden.
 * `npm run edges:missing` lists it, so the gap is a worklist rather than a surprise.
 *
 * @module edgeTable
 */

import { buildEdgeTable } from './buildEdgeTable.js';
import publishedDocument from './edgeDefinitions.json' with { type: 'json' };
import { definitionsOf, hydrateEdgeDefinitions } from './edgesHydrate.js';
import { inverseEdgesFrom } from './inverseEdges.js';

/** The published definitions, with each `rdf` token turned back into its generator. */
export const publishedDefinitions = hydrateEdgeDefinitions(definitionsOf(publishedDocument));

/** What the publication says about itself: the view, and how much of it there is. */
export const publishedInfo = publishedDocument?.generated ?? {};

/**
 * The shipped edge table, straight from the publication.
 *
 * @returns {{table: Object, collisions: Array, rows: number}}
 */
export function shippedEdgeTable() {
    const { table, collisions } = buildEdgeTable(publishedDefinitions);
    const rows = Object.values(table).reduce((total, partitions) => (
        total + ['intrinsic', 'edges', 'cxtEdges']
            .reduce((n, partition) => n + Object.keys(partitions[partition] || {}).length, 0)
    ), 0);
    return { table, collisions, rows };
}

/**
 * The inverse map the library ships: the publication's, with nothing merged underneath.
 *
 * @returns {Object<string, string>}
 */
export function shippedInverseEdges() {
    return inverseEdgesFrom(publishedDefinitions);
}

export default {
    publishedDefinitions, publishedInfo, shippedEdgeTable, shippedInverseEdges,
};
