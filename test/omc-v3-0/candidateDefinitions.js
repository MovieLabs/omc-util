/**
 * The edge definitions a check runs against, and where they came from.
 *
 * The table is to be driven by what the Edge Editor publishes, so during development the useful
 * answer is the one the API is serving right now — not a file somebody exported days ago. With no
 * `--candidate`, these checks ask a locally running Labkoat-API first and fall back to the static
 * edges.js when nothing answers. Every check prints which it used, because a comparison is
 * worthless if you cannot tell what was on each side of it.
 *
 * The published document nests its OMC-JSON projection under `json`, beside the `rdf` one — the
 * two projections of the same stored edge — so the definitions are at `json.edgeDefinitions`.
 * The barer forms are accepted too, for a hand-cut file or an older export.
 *
 * **A live source reports, it does not gate.** Its content changes under you, so a failure would
 * mean "somebody edited an edge", not "this commit is wrong". Only a fixed source — edges.js, or a
 * file named with `--candidate` — is matched against an accept file and can fail the run. This is
 * also why nothing here ships: `test/` is outside the `files` allow-list, and the library itself
 * never reaches the network.
 *
 * @module test/omc-v3-0/candidateDefinitions
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { edgeDefinitions } from '../../src/templates/v3-0/edges.js';
import { hydrateEdgeDefinitions } from '../../src/templates/v3-0/edgesHydrate.js';

/** Where a locally running API serves the published document. `OMC_EDGES_URL` overrides it. */
export const DEFAULT_EDGES_URL = process.env.OMC_EDGES_URL
    || 'http://localhost:8080/api/vocab/v1/edges/publish?format=json';

/** How long to wait for the local API before deciding it is not running. */
const PROBE_MS = 2000;

const isUrl = (value) => /^https?:\/\//i.test(value);

/**
 * The `edgeDefinitions` of a published document, wherever the document carries them.
 *
 * @param {Object} doc - A parsed published document
 * @returns {Object} The definitions, still holding `rdf` tokens
 */
export const definitionsOf = (doc) => doc?.json?.edgeDefinitions ?? doc?.edgeDefinitions ?? doc;

/**
 * Fetch the published document from a running API.
 *
 * The route is authenticated (`validated` + `machineReadOnly`), so a token is needed: set
 * `LABKOAT_TOKEN` and it is sent as a bearer. Without one a dev server answers 401, which is
 * reported as plainly as a refused connection — both mean "no live source", and neither should
 * look like an empty edge set.
 *
 * @param {string} url
 * @returns {Promise<{definitions: Object, note: string}>}
 * @throws {Error} When the API does not answer, or answers with anything but the document
 */
async function fetchPublished(url) {
    const token = process.env.LABKOAT_TOKEN;
    const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: AbortSignal.timeout(PROBE_MS),
    });
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}${
            response.status === 401 && !token ? ' — set LABKOAT_TOKEN' : ''}`);
    }
    const doc = await response.json();
    const problems = response.headers.get('X-Vocab-Problems');
    const { viewId, edges, rows } = doc?.generated || {};
    return {
        definitions: hydrateEdgeDefinitions(definitionsOf(doc)),
        note: `view ${viewId ?? '?'}, ${edges ?? '?'} edges / ${rows ?? '?'} rows${
            problems ? `, problems: ${problems}` : ''}`,
    };
}

/**
 * Load a candidate set of edge definitions, and say where they came from.
 *
 * @param {string|null} source - A URL, a published `.json`, a module exporting `edgeDefinitions`,
 *   or null to try the local API and fall back to edges.js
 * @returns {Promise<{definitions: Object, label: string, live: boolean}>} `live` is true only for a
 *   source that can change between runs, and a live source must not gate.
 */
export async function loadCandidate(source) {
    if (source && isUrl(source)) {
        const { definitions, note } = await fetchPublished(source);
        return { definitions, label: `${source} (${note})`, live: true };
    }

    if (source && source.endsWith('.json')) {
        const doc = JSON.parse(readFileSync(resolve(source), 'utf8'));
        return {
            definitions: hydrateEdgeDefinitions(definitionsOf(doc)),
            label: source,
            live: false,
        };
    }

    if (source) {
        const mod = await import(pathToFileURL(resolve(source)).href);
        const definitions = mod.edgeDefinitions || mod.default?.edgeDefinitions || mod.default;
        if (!definitions || typeof definitions !== 'object') {
            throw new Error(`${source} exports no edgeDefinitions`);
        }
        return { definitions, label: source, live: false };
    }

    try {
        const { definitions, note } = await fetchPublished(DEFAULT_EDGES_URL);
        return { definitions, label: `${DEFAULT_EDGES_URL} (${note})`, live: true };
    } catch (err) {
        return {
            definitions: edgeDefinitions,
            label: `src/templates/v3-0/edges.js — no live API (${err.message})`,
            live: false,
        };
    }
}

export default { loadCandidate, definitionsOf, DEFAULT_EDGES_URL };
