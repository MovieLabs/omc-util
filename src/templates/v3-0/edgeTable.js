/**
 * The edge table the library ships, built from what the Edge Editor published and nothing else.
 *
 * `edgeDefinitions.json` is that publication — the OMC-JSON projection of the edges authored in the
 * tool, exported from `/api/vocab/v1/edges/publish`. `npm run edges:update` puts a fresh export
 * here, and the shipped table follows.
 *
 * The hand-written set the tool was seeded from is gone, along with everything that diffed against
 * it. A table half from a file nobody edits is one nobody can reason about, and there was no way to
 * tell, in the graph or anywhere else, which half an edge had come from. What the tool has not
 * modelled is therefore **absent**, not quietly supplied: `npm run edges:coverage` says where the
 * table and the JSON Schema disagree, which is the question that actually matters.
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
 * `omc:usedIn` and `usedIn` name the same thing; the index is keyed without the prefix, and folded
 * to lower case.
 *
 * The case has to be folded because the two projections disagree about it by design. An intrinsic
 * predicate is the capitalised verb — `Has`, so the property reads `AssetStructure` and not
 * `assetStructure` — while the RDF model keys by the verb itself, `omc:has`. Matching them verbatim
 * silently missed every intrinsic row: `Participant.ParticipantStructure` took the name of the
 * predicate's other group and published `omc:hasAssetStructure`.
 */
const bare = (term) => String(term).replace(/^omc:/, '').toLowerCase();

/**
 * The publication's RDF properties, keyed `verb|domain|range`.
 *
 * The document carries two projections of each stored edge. `json` is the OMC-JSON one the table is
 * built from; `rdf` is the RDF model — `properties` naming an actual property per domain/range
 * pairing (`omc:usedInProductionScene`), over `verbs` naming the predicate families. Only the
 * OMC-JSON half was ever read, so an edge whose definition carries no curated `const:` name fell to
 * the machine-expanded `omcT:` template even where the RDF model names it properly: of 74 rows
 * showing a templated name, 67 had a real property sitting in this half of the same document.
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
 * model names nothing, and `rdfTemplated` keeps the generated name so the two can be told apart.
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
                entry.rdfTemplated = entry.omcPredicate;
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

export default {
    publishedDefinitions, publishedInfo, shippedEdgeTable, shippedInverseEdges,
};
