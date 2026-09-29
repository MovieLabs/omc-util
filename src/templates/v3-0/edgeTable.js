/**
 * The edge table the library ships, built from what the Edge Editor published.
 *
 * `edgeDefinitions.json` is that publication — the OMC-JSON projection of the edges authored in the
 * tool, exported from `/api/vocab/v1/edges/publish`. It is the source of the relationship model now;
 * `edges.js` is the seed it grew from and is kept as a fallback, not as an authority.
 *
 * ## Published wins, the seed fills
 *
 * The two are unioned **row by row**, keyed by entityType, partition and storage path. Every row the
 * published document builds is taken as published. Every row only the seed builds is added
 * underneath. A row both produce is the published one, whole — never a field-by-field blend, which
 * would make an entry neither source ever stated.
 *
 * Row-level rather than per-predicate, because the two disagree *within* a predicate as often as
 * about one: the document and the seed both carry `has`, and the seed reaches six domain/range pairs
 * the document does not.
 *
 * **What the fallback costs, deliberately accepted.** A relationship deleted in the Edge Editor is
 * restored from the seed if the seed still carries it, so a removal does not take effect until the
 * seed drops it too. That is the price of losing nothing on the day of the cut-over, and it is why
 * `provenance` exists: what the seed is still holding up is a number anybody can ask for, and the
 * intention is that it falls to zero.
 *
 * @module edgeTable
 */

import { buildEdgeTable } from './buildEdgeTable.js';
import publishedDocument from './edgeDefinitions.json' with { type: 'json' };
import { edgeDefinitions as seedDefinitions } from './edges.js';
import { definitionsOf, hydrateEdgeDefinitions } from './edgesHydrate.js';
import { inverseEdgesFrom } from './inverseEdges.js';

/** The published definitions, with each `rdf` token turned back into its generator. */
export const publishedDefinitions = hydrateEdgeDefinitions(definitionsOf(publishedDocument));

/** What the publication says about itself: the view, and how much of it there is. */
export const publishedInfo = publishedDocument?.generated ?? {};

const PARTITIONS = ['intrinsic', 'edges', 'cxtEdges'];

/** An empty set of partitions, so a merge never has to test for one. */
const emptyPartitions = () => ({ intrinsic: {}, edges: {}, cxtEdges: {} });

/**
 * The shipped edge table: the published rows, with the seed's own rows added where the publication
 * has none.
 *
 * @returns {{table: Object, collisions: Array, provenance: {published: number, seed: string[]}}}
 *   `provenance.seed` names every row still coming from edges.js, as `<EntityType>.<partition> <path>`.
 */
export function unionEdgeTable() {
    const { table: published, collisions } = buildEdgeTable(publishedDefinitions);
    const { table: seed } = buildEdgeTable(seedDefinitions);

    const table = {};
    const fromSeed = [];
    let fromPublished = 0;

    new Set([...Object.keys(published), ...Object.keys(seed)]).forEach((entityType) => {
        const here = published[entityType] || emptyPartitions();
        const there = seed[entityType] || emptyPartitions();
        table[entityType] = emptyPartitions();

        PARTITIONS.forEach((partition) => {
            const rows = { ...here[partition] };
            // An intrinsic row is named by its property, so the same property at a different path
            // is the same relationship in the wrong place, not a second one. The seed holds
            // `CreativeWork.Series` where the publication now says
            // `creativeWorkProperties.Series`; adding both would put a path back that makes the
            // entity fail validation, which is the opposite of filling a gap. Only for intrinsic:
            // an `edges.<verb>.<Range>` path ends in the range, and two verbs may share one.
            const placed = partition === 'intrinsic'
                ? new Set(Object.keys(here[partition] || {}).map((path) => path.split('.').pop()))
                : new Set();

            Object.entries(there[partition] || {}).forEach(([path, entry]) => {
                if (rows[path] || placed.has(path.split('.').pop())) return;
                rows[path] = entry;
                fromSeed.push(`${entityType}.${partition} ${path}`);
            });
            fromPublished += Object.keys(here[partition] || {}).length;
            table[entityType][partition] = rows;
        });
    });

    return { table, collisions, provenance: { published: fromPublished, seed: fromSeed.sort() } };
}

/**
 * The inverse map the library ships, unioned the same way: a predicate the publication names takes
 * the publication's inverse, and the seed answers for the predicates it does not name.
 *
 * Merged per predicate rather than per row, because that is the shape the map has — one inverse per
 * predicate — and it is what `omcTemplate.inverseEdge()` hands to fMam.
 *
 * @returns {Object<string, string>}
 */
export function unionInverseEdges() {
    return { ...inverseEdgesFrom(seedDefinitions), ...inverseEdgesFrom(publishedDefinitions) };
}

export default { publishedDefinitions, publishedInfo, unionEdgeTable, unionInverseEdges };
