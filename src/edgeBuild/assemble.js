/**
 * The edge table omc-util ships, built from a published edge document and the JSON Schema.
 *
 * Nothing supplements the publication. A relationship the Edge Editor has not modelled is absent
 * from the table rather than filled in from somewhere else, and the coverage check is where that
 * gap shows.
 *
 * @module edgeBuild/assemble
 * @ignore
 */

import { buildMaxItemsIndex } from '../templates/schemaFacts.js';

import { buildEdgeTable } from './buildEdgeTable.js';
import { definitionsFrom, inverseMapFrom } from './definitions.js';

/** A term as the index keys it: without the `omc:` prefix. `omc:usedIn` and `usedIn` are one key. */
const bare = (term) => String(term).replace(/^omc:/, '');

/**
 * The publication's RDF properties, keyed `verb|domain|range`: how a built row finds its RDF name
 * instead of falling back to the generated `omcT:` template.
 *
 * @param {Object} document - The published document
 * @returns {Map<string, string[]>}
 */
const rdfPropertyIndex = ((document) => {
    const index = new Map();
    (document?.rdf?.properties ?? []).forEach((property) => {
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
});

/**
 * The narrowings a row's RDF properties state, for the ranges that row admits.
 *
 * A narrowing is a qualifier rather than a subclass: `omc:hasScript` ranges over `omc:Asset` and
 * states beside it that the Asset's `hasAssetFunction` is `Script`, which is how an end reads as
 * `Asset (Script)`. It asserts rather than restricts — an Asset reached this way is a Script — so
 * it names the end without narrowing what the edge accepts.
 *
 * @param {string[]} properties - The row's RDF property ids
 * @param {Map<string, Object>} byId - Every published property, by id
 * @param {string[]} allowed - The ranges the row admits
 * @returns {Array<{range: string, qualifier: string, via: string, property: string}>}
 */
const narrowingsFor = ((properties, byId, allowed) => properties
    .flatMap((id) => (byId.get(id)?.rangeOf ?? []).map((one) => ({
        range: bare(one.class),
        qualifier: bare(one.function?.class),
        via: bare(one.function?.path),
        property: id,
    })))
    .filter((one) => one.qualifier && allowed.includes(one.range)));

/**
 * Build the table and the flat inverse map from a published document.
 *
 * Each row gains `rdfProperties`, the RDF model's own names for it, and `omcPredicate` becomes that
 * name where the row has exactly one. The `omcT:` template survives only where the RDF model names
 * nothing, and an empty `rdfProperties` is what says so.
 *
 * A row whose properties narrow a range also gains `narrowedRanges`. It is left off the rest rather
 * than written empty, because two rows of the table carry one and 181 would carry nothing.
 *
 * @param {Object} document - The published edge document
 * @param {object} schema - The OMC v3.0 JSON Schema, for `maxItems`
 * @param {string} [where] - What to call the document in an error
 * @returns {{table: Object, inverseEdges: Object<string, string>, definitions: Object,
 *   collisions: string[], rows: number, rdfNamed: number}}
 */
export function edgeTableFrom(document, schema, where = 'the document') {
    const definitions = definitionsFrom(document, where);
    const { table, collisions } = buildEdgeTable(definitions, buildMaxItemsIndex(schema));
    const rdfIndex = rdfPropertyIndex(document);
    const propertyById = new Map((document?.rdf?.properties ?? []).map((property) => [property.id, property]));
    let rows = 0;
    let rdfNamed = 0;

    Object.entries(table).forEach(([domain, partitions]) => {
        ['intrinsic', 'edges', 'cxtEdges'].forEach((partition) => {
            Object.values(partitions[partition] ?? {}).forEach((entry) => {
                rows += 1;
                const properties = [...new Set((entry.allowed ?? []).flatMap((range) => (
                    rdfIndex.get(`${bare(entry.predicate)}|${bare(domain)}|${bare(range)}`) ?? []
                )))];
                entry.rdfProperties = properties;
                if (properties.length) rdfNamed += 1;
                if (properties.length === 1) [entry.omcPredicate] = properties;

                const narrowed = narrowingsFor(properties, propertyById, entry.allowed ?? []);
                if (narrowed.length) entry.narrowedRanges = narrowed;
            });
        });
    });

    return {
        table, inverseEdges: inverseMapFrom(definitions), definitions, collisions, rows, rdfNamed,
    };
}

/**
 * Every row as `domain|partition|path`, sorted — what a change to the table is measured in.
 *
 * @param {Object} table
 * @returns {string[]}
 */
export const rowKeys = ((table) => Object.entries(table ?? {})
    .flatMap(([domain, partitions]) => ['intrinsic', 'edges', 'cxtEdges']
        .flatMap((partition) => Object.keys(partitions?.[partition] ?? {})
            .map((path) => `${domain}|${partition}|${path}`)))
    .sort());
