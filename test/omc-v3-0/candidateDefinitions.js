/**
 * The edge definitions a check runs against: the Edge Editor's published document, a module
 * exporting `edgeDefinitions`, or the static edges.js.
 *
 * The published document nests its OMC-JSON projection under `json`, beside the `rdf` one — the
 * two projections of the same stored edge — so the definitions are at `json.edgeDefinitions`.
 * The barer forms are accepted too, since a hand-cut file or an older export may carry
 * `edgeDefinitions` at the top level, or be the definitions themselves.
 *
 * Shared by edgeParity, edgeCoverage and edgeInverse so one document is read the same way by all
 * three, and `rdf` tokens are hydrated back into functions exactly once.
 *
 * @module test/omc-v3-0/candidateDefinitions
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { edgeDefinitions } from '../../src/templates/v3-0/edges.js';
import { hydrateEdgeDefinitions } from '../../src/templates/v3-0/edgesHydrate.js';

/**
 * The `edgeDefinitions` of a published document, wherever the document carries them.
 *
 * @param {Object} doc - A parsed published document
 * @returns {Object} The definitions, still holding `rdf` tokens
 */
export const definitionsOf = (doc) => doc?.json?.edgeDefinitions ?? doc?.edgeDefinitions ?? doc;

/**
 * Load a candidate set of edge definitions.
 *
 * @param {string|null} modulePath - A published `.json`, a module exporting `edgeDefinitions`, or
 *   null for the static edges.js
 * @returns {Promise<Object>} Definitions in the edges.js shape, with `rdf` as functions
 */
export async function loadCandidate(modulePath) {
    if (!modulePath) return edgeDefinitions;
    if (modulePath.endsWith('.json')) {
        const doc = JSON.parse(readFileSync(resolve(modulePath), 'utf8'));
        return hydrateEdgeDefinitions(definitionsOf(doc));
    }
    const mod = await import(pathToFileURL(resolve(modulePath)).href);
    const definitions = mod.edgeDefinitions || mod.default?.edgeDefinitions || mod.default;
    if (!definitions || typeof definitions !== 'object') {
        throw new Error(`${modulePath} exports no edgeDefinitions`);
    }
    return definitions;
}

export default { loadCandidate, definitionsOf };
