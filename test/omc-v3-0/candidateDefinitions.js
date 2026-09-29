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
 * **There is no silent fallback to edges.js.** Substituting the hand-written table when the API is
 * not answering would report a pass for a question nobody asked — the whole point is what the tool
 * is producing now. Asked for live and unable to get it, a check fails and says how to fix it.
 * `--static` asks for the shipped table deliberately, which is the right subject at release time
 * because edges.js is still what ships.
 *
 * **A live source reports, it does not gate.** Its content changes under you, so a failure would
 * mean "somebody edited an edge", not "this commit is wrong". Only a fixed source — `--static`, or
 * a file named with `--candidate` — is matched against an accept file and can fail the run. This is
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
    // An own controller rather than AbortSignal.timeout: its timer is cleared here, so nothing
    // is left pending when a caller exits on the failure this throws.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_MS);
    let response;
    try {
        response = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timer);
    }
    if (!response.ok) {
        // Release the socket before throwing: a caller that exits on this error would otherwise
        // do so with the connection still open, which trips a libuv assertion on Windows.
        await response.body?.cancel();
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
 * @param {string|null} source - A URL, a published `.json`, or a module exporting `edgeDefinitions`
 * @param {{static?: boolean}} [options] - `static` takes the shipped edges.js instead of the API
 * @returns {Promise<{definitions: Object, label: string, live: boolean}>} `live` is true only for a
 *   source that can change between runs, and a live source must not gate.
 * @throws {Error} When the live table was wanted and could not be read
 */
export async function loadCandidate(source, options = {}) {
    if (!source && options.static) {
        return { definitions: edgeDefinitions, label: 'src/templates/v3-0/edges.js (--static)', live: false };
    }
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
        throw new Error([
            `Could not read the live edge table from ${DEFAULT_EDGES_URL}: ${err.message}`,
            '  Start Labkoat-API and set LABKOAT_TOKEN, point OMC_EDGES_URL elsewhere, name a',
            '  saved document with --candidate, or pass --static to check the shipped edges.js.',
            '  It does not fall back on its own: a pass against the hand-written table would',
            '  answer a question you did not ask.',
        ].join('\n'));
    }
}

export default { loadCandidate, definitionsOf, DEFAULT_EDGES_URL };
