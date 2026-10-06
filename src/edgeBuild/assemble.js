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
 * Each class's OMC-JSON entityType, by the class's own name.
 *
 * @param {Object} document - The published document
 * @returns {Map<string, string|null>}
 */
const jsonTypeIndex = ((document) => new Map((document?.classes ?? [])
    .map((entry) => [bare(entry.id ?? entry.name), entry.jsonType ?? null])));

/**
 * The publication's RDF properties, keyed `verb|domain|range`: how a built row finds its RDF name.
 *
 * **An end names an RDF class; a row is keyed by the entityType that class projects to.** They are
 * the same word for the thirty classes that are their own entityType, and a different one for every
 * end worth narrowing — `omc:neededByNarrativeProp` ranges over `NarrativeProp`, which publishes as
 * a `NarrativeObject`, and keying it as written finds no row at all. A class the publication says
 * projects to nothing has no row to find. A name it does not know at all is taken as written, which
 * is what a document with no `classes` block gets.
 *
 * @param {Object} document - The published document
 * @param {Map<string, string|null>} jsonTypes - From `jsonTypeIndex`
 * @returns {Map<string, string[]>}
 */
const rdfPropertyIndex = ((document, jsonTypes) => {
    const index = new Map();
    const projected = ((term) => (jsonTypes.has(bare(term)) ? jsonTypes.get(bare(term)) : bare(term)));
    (document?.rdf?.properties ?? []).forEach((property) => {
        (property.verbs ?? []).forEach((verb) => {
            (property.domains ?? []).forEach((domain) => {
                (property.ranges ?? []).forEach((range) => {
                    const from = projected(domain);
                    const to = projected(range);
                    if (!from || !to) return;
                    const key = `${bare(verb)}|${from}|${to}`;
                    index.set(key, [...new Set([...(index.get(key) ?? []), property.id])]);
                });
            });
        });
    });
    return index;
});

/**
 * What a row's RDF properties call the ends it admits, where they call them something narrower
 * than the entityType.
 *
 * Two ways an end is narrowed, and both read the same on a diagram — `Collection (CaptureDetails)`:
 *
 * - **A qualifier.** `omc:hasScript` ranges over `omc:Asset` and states beside it that the Asset's
 *   `hasAssetFunction` is `Script`. The end is still an Asset; the property says which kind.
 * - **A subclass.** `omc:hasCaptureDetails` ranges over `omc:CaptureDetails`, a class that
 *   publishes as a `Collection`. The entityType is the projection; the class is the thing.
 *
 * Both assert rather than restrict: what the edge accepts is the entityType either way.
 *
 * @param {string[]} properties - The row's RDF property ids
 * @param {Map<string, Object>} byId - Every published property, by id
 * @param {string[]} allowed - The ranges the row admits
 * @param {Map<string, string|null>} jsonTypes - From `jsonTypeIndex`
 * @returns {Array<{range: string, as: string, kind: 'qualifier'|'class', via?: string, property: string}>}
 */
const narrowingsFor = ((properties, byId, allowed, jsonTypes) => properties
    .flatMap((id) => {
        const property = byId.get(id);
        if (!property) return [];
        const qualified = (property.rangeOf ?? [])
            .filter((one) => one.function?.class)
            .map((one) => ({
                range: bare(one.class),
                as: bare(one.function.class),
                kind: 'qualifier',
                via: bare(one.function.path),
                property: id,
            }));
        const subclassed = (property.ranges ?? [])
            .map((range) => bare(range))
            .filter((name) => jsonTypes.get(name) && jsonTypes.get(name) !== name)
            .map((name) => ({
                range: jsonTypes.get(name), as: name, kind: 'class', property: id,
            }));
        return [...qualified, ...subclassed];
    })
    .filter((one) => allowed.includes(one.range)));

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
export function edgeTableFrom(document, schema, where = 'the document') {
    const definitions = definitionsFrom(document, where);
    const { table, collisions } = buildEdgeTable(definitions, buildMaxItemsIndex(schema));
    const jsonTypes = jsonTypeIndex(document);
    const rdfIndex = rdfPropertyIndex(document, jsonTypes);
    const propertyById = new Map((document?.rdf?.properties ?? []).map((property) => [property.id, property]));
    const claimed = new Set();
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
                properties.forEach((id) => claimed.add(id));
                if (properties.length) rdfNamed += 1;
                if (properties.length === 1) [entry.omcPredicate] = properties;

                const narrowed = narrowingsFor(properties, propertyById, entry.allowed ?? [], jsonTypes);
                if (narrowed.length) entry.narrowedRanges = narrowed;
            });
        });
    });

    // A property no row claimed publishes a relationship the OMC-JSON side does not carry. Some are
    // RDF-only and correct; a join that quietly found nothing looks exactly the same, so both are
    // reported rather than neither.
    const rdfUnmatched = [...propertyById.keys()].filter((id) => !claimed.has(id));

    return {
        table,
        inverseEdges: inverseMapFrom(definitions),
        definitions,
        collisions,
        rows,
        rdfNamed,
        rdfUnmatched,
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
