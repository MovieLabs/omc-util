/**
 * Edge definitions from their published JSON form.
 *
 * The Edge Editor publishes the definitions as JSON, where an edge's RDF name generator cannot be a
 * function. Each definition carries a token instead, and this turns it back into the function
 * `buildEdgeTable` calls: `tentative` and `intrinsic` name the two templates in edges.js, and
 * `const:<name>` is a fixed name.
 *
 * @module edgesHydrate
 */

import { intrinsicRdf, tentativeRdf } from './rdfTemplates.js';

/**
 * The `edgeDefinitions` of a published document, wherever the document carries them.
 *
 * The document nests its OMC-JSON projection under `json`, beside the `rdf` one — two projections
 * of the same stored edge. The barer forms are accepted for a hand-cut file or an older export.
 *
 * @param {Object} doc - A parsed published document
 * @returns {Object} The definitions, still holding `rdf` tokens
 */
export const definitionsOf = ((doc) => doc?.json?.edgeDefinitions ?? doc?.edgeDefinitions ?? doc);

/**
 * The RDF name generator a token stands for.
 *
 * @param {string} token
 * @returns {function({domain: string, predicate: string, range: string}): string}
 */
const rdfFromToken = ((token) => {
    if (token === 'intrinsic') return intrinsicRdf;
    if (typeof token === 'string' && token.startsWith('const:')) {
        const name = token.slice('const:'.length);
        return () => name;
    }
    return tentativeRdf;
});

/**
 * Edge definitions with every `rdf` token replaced by its function.
 *
 * @param {Object<string, object>} definitions - The `edgeDefinitions` of a published document
 * @returns {Object<string, object>} Definitions in the edges.js shape
 */
export function hydrateEdgeDefinitions(definitions) {
    return Object.fromEntries(Object.entries(definitions)
        .map(([predicate, definition]) => [predicate, { ...definition, rdf: rdfFromToken(definition.rdf) }]));
}
