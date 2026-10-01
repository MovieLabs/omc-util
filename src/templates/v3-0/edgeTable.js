/**
 * The edge table the library ships, built from what the Edge Editor published and nothing else.
 *
 * `edgeDefinitions.json` is that publication — the OMC-JSON projection of the edges authored in the
 * tool, exported from `/api/vocab/v1/edges/publish`. `npm run edges:update` puts a fresh export
 * here, and the shipped table follows.
 *
 * Nothing supplements it. A relationship the tool has not modelled is absent from the table rather
 * than filled in from somewhere else, so `npm run edges:coverage` — the table against the JSON
 * Schema — is where a gap shows.
 *
 * @module edgeTable
 */

import { buildEdgeTable } from './buildEdgeTable.js';
import publishedDocument from './edgeDefinitions.json' with { type: 'json' };
import { definitionsOf, hydrateEdgeDefinitions } from './edgesHydrate.js';
import { inverseEdgesFrom } from './inverseEdges.js';

/** The published definitions, with each `rdf` token turned back into its generator. */
export const publishedDefinitions = hydrateEdgeDefinitions(definitionsOf(publishedDocument));

/** A term as the index keys it: without the `omc:` prefix. `omc:usedIn` and `usedIn` are one key. */
const bare = (term) => String(term).replace(/^omc:/, '');

/**
 * The publication's RDF properties, keyed `verb|domain|range`.
 *
 * The document carries two projections of each stored edge: `json`, which the table is built from,
 * and `rdf`, whose `properties` name an actual property per domain/range pairing
 * (`omc:usedInProductionScene`). This index is how a built row finds its RDF name there, instead of
 * falling back to the generated `omcT:` template.
 *
 * @type {Map<string, string[]>}
 */
const rdfPropertyIndex = (() => {
    const index = new Map();
    (publishedDocument?.rdf?.properties ?? []).forEach((property) => {
        (property.verbs ?? []).forEach((verb) => {
            (property.domains ?? []).forEach((domain) => {
                (property.ranges ?? []).forEach((range) => {
                    const key = `${bare(verb)}|${bare(domain)}|${bare(range)}`;
                    index.set(key, [...new Set([...(index.get(key) ?? []), property.id])]);
                });
            });
        });
    });
    return index;
})();

/**
 * The RDF properties a table row corresponds to: one per allowed range that the RDF model names.
 *
 * @param {string} domain - The entityType the edge is on
 * @param {Object} entry - A built edge-table row
 * @returns {string[]}
 */
const rdfPropertiesFor = ((domain, entry) => [...new Set(
    (entry.allowed ?? []).flatMap((range) => (
        rdfPropertyIndex.get(`${bare(entry.predicate)}|${bare(domain)}|${bare(range)}`) ?? []
    )),
)]);

/**
 * The shipped edge table, straight from the publication.
 *
 * Each row gains `rdfProperties`, the RDF model's own names for it, and `omcPredicate` becomes that
 * name where the row has exactly one — which is what `omcPredicate` has always claimed to be, "the
 * formal predicate for this edge, from RDF model". The `omcT:` template survives only where the RDF
 * model names nothing, and `rdfProperties` being empty is what says so.
 *
 * @returns {{table: Object, collisions: Array, rows: number, rdfNamed: number}}
 */
export function shippedEdgeTable() {
    const { table, collisions } = buildEdgeTable(publishedDefinitions);
    let rows = 0;
    let rdfNamed = 0;

    Object.entries(table).forEach(([domain, partitions]) => {
        ['intrinsic', 'edges', 'cxtEdges'].forEach((partition) => {
            Object.values(partitions[partition] ?? {}).forEach((entry) => {
                rows += 1;
                const properties = rdfPropertiesFor(domain, entry);
                entry.rdfProperties = properties;
                if (properties.length) rdfNamed += 1;
                if (properties.length === 1) [entry.omcPredicate] = properties;
            });
        });
    });

    return { table, collisions, rows, rdfNamed };
}

/**
 * The inverse map the library ships: the publication's, with nothing merged underneath.
 *
 * @returns {Object<string, string>}
 */
export function shippedInverseEdges() {
    return inverseEdgesFrom(publishedDefinitions);
}

export default { publishedDefinitions, shippedEdgeTable, shippedInverseEdges };
