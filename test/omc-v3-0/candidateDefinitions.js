/**
 * The edge definitions a check runs against, and where they came from.
 *
 * Four subjects, and which one a check is looking at decides what its answer means:
 *
 *   `--shipped`    what the library exports — the publication with the edges.js seed filling its
 *                  gaps (see src/templates/v3-0/edgeTable.js). The table every consumer is handed,
 *                  and the only one worth gating.
 *   `--static`     the edges.js seed alone. Since the cut-over this is a component of what ships,
 *                  not what ships.
 *   `--candidate`  a named URL, published document or module.
 *   (nothing)      the live table, so a check during development sees what the tool is producing.
 *
 * With no arguments they look, in order, for:
 *
 *   1. a running API — `OMC_EDGES_URL`, or localhost:8080, with `LABKOAT_TOKEN` for the bearer
 *   2. `test/omc-v3-0/omc-edges.json`, the file the Edge Editor's UI exports under that name
 *
 * and fail if neither is there. Every check prints which it used and, for the export, how old it
 * is: a comparison is worthless if you cannot tell what was on each side of it.
 *
 * The published document nests its OMC-JSON projection under `json`, beside the `rdf` one — the
 * two projections of the same stored edge — so the definitions are at `json.edgeDefinitions`.
 * The barer forms are accepted too, for a hand-cut file or an older export, and a document that
 * holds neither is refused rather than read as an empty edge set.
 *
 * **There is no silent fallback.** Substituting one subject for another would report a pass for a
 * question nobody asked, so a check that cannot read what it was asked for fails and says so.
 *
 * **A fixed subject gates; a live one reports.** A published document changes whenever somebody
 * edits an edge, so a failure would say that rather than that the commit is wrong. `--shipped`,
 * `--static` and a `.js` module gate; a URL or a published `.json` reports. Nothing here ships
 * either way: `test/` is outside the `files` allow-list, and the library never reaches the
 * network.
 *
 * @module test/omc-v3-0/candidateDefinitions
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { edgeDefinitions } from '../../src/templates/v3-0/edges.js';
import { definitionsOf, hydrateEdgeDefinitions } from '../../src/templates/v3-0/edgesHydrate.js';
import { publishedDefinitions, unionEdgeTable, unionInverseEdges } from '../../src/templates/v3-0/edgeTable.js';

/** Where a locally running API serves the published document. `OMC_EDGES_URL` overrides it. */
export const DEFAULT_EDGES_URL = process.env.OMC_EDGES_URL
    || 'http://localhost:8080/api/vocab/v1/edges/publish?format=json';

/** The name the Edge Editor's UI gives its export, beside these checks. */
export const DEFAULT_EXPORT_PATH = join(dirname(fileURLToPath(import.meta.url)), 'omc-edges.json');

/** How long to wait for the local API before deciding it is not running. */
const PROBE_MS = 2000;

const isUrl = (value) => /^https?:\/\//i.test(value);

/** How long ago, in words, so a stale export cannot pass for a current one. */
const ageOf = ((path) => {
    const hours = (Date.now() - statSync(path).mtimeMs) / 3600000;
    if (hours < 1) return `${Math.round(hours * 60)} min old`;
    if (hours < 48) return `${Math.round(hours)} h old`;
    return `${Math.round(hours / 24)} days old`;
});

/**
 * The definitions of a published document, refused unless they look like definitions.
 *
 * Without this, a document shaped differently from expected is read as a set of predicates named
 * after its top-level keys — which is exactly what happened when the loader looked for
 * `edgeDefinitions` at the top level and found `generated`, `namespace`, `json` and `rdf`. A
 * nonsense comparison that runs is worse than one that refuses.
 *
 * @param {Object} doc - A parsed published document
 * @param {string} where - What to name in the error
 * @returns {Object} Definitions in the edges.js shape, with `rdf` as functions
 * @throws {Error} When the document holds nothing shaped like edge definitions
 */
function definitionsFrom(doc, where) {
    const found = definitionsOf(doc);
    const entries = found && typeof found === 'object' ? Object.entries(found) : [];
    const looksRight = entries.length
        && entries.every(([, value]) => value && typeof value === 'object'
            && (Array.isArray(value.connects) || typeof value.predicate === 'string'));
    if (!looksRight) {
        throw new Error([
            `${where} holds no edge definitions.`,
            '  Expected them at `json.edgeDefinitions` (the published document), at',
            '  `edgeDefinitions`, or as the whole document — each value carrying `connects`.',
            `  Found top-level keys: ${Object.keys(doc || {}).join(', ') || '(none)'}`,
        ].join('\n'));
    }
    return hydrateEdgeDefinitions(found);
}

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
        definitions: definitionsFrom(doc, url),
        note: `view ${viewId ?? '?'}, ${edges ?? '?'} edges / ${rows ?? '?'} rows${
            problems ? `, problems: ${problems}` : ''}`,
    };
}

/**
 * A published document read from disk.
 *
 * @param {string} path
 * @param {string} [how] - How it was chosen, for the label
 * @returns {{definitions: Object, label: string, live: boolean}}
 */
function readExport(path, how = '') {
    const doc = JSON.parse(readFileSync(resolve(path), 'utf8'));
    const { viewId, edges, rows } = doc?.generated || {};
    return {
        definitions: definitionsFrom(doc, path),
        label: `${path}${how} — exported ${ageOf(path)}`
            + `${viewId ? `, view ${viewId}, ${edges ?? '?'} edges / ${rows ?? '?'} rows` : ''}`,
        // A published document is the tool's output, so the accept files do not describe it and
        // it reports rather than gates — the same reason a live fetch does.
        live: true,
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
    if (!source && options.shipped) {
        // What the library exports: the publication with the seed filling its gaps. This is the
        // only subject worth gating, because it is the table every consumer is handed.
        const { table, provenance } = unionEdgeTable();
        return {
            table,
            // Per predicate, for a reader that needs to ask whether one is intrinsic.
            definitions: { ...edgeDefinitions, ...publishedDefinitions },
            inverses: unionInverseEdges(),
            label: `the shipped table — ${provenance.published} rows published, `
                + `${provenance.seed.length} still from the edges.js seed`,
            live: false,
        };
    }
    if (!source && options.static) {
        return { definitions: edgeDefinitions, label: 'src/templates/v3-0/edges.js (--static)', live: false };
    }
    if (source && isUrl(source)) {
        const { definitions, note } = await fetchPublished(source);
        return { definitions, label: `${source} (${note})`, live: true };
    }

    if (source && source.endsWith('.json')) return readExport(source);

    if (source) {
        const mod = await import(pathToFileURL(resolve(source)).href);
        const definitions = mod.edgeDefinitions || mod.default?.edgeDefinitions || mod.default;
        if (!definitions || typeof definitions !== 'object') {
            throw new Error(`${source} exports no edgeDefinitions`);
        }
        return { definitions, label: source, live: false };
    }

    let apiFailure;
    try {
        const { definitions, note } = await fetchPublished(DEFAULT_EDGES_URL);
        return { definitions, label: `${DEFAULT_EDGES_URL} (${note})`, live: true };
    } catch (err) {
        apiFailure = err.message;
    }

    // The export the Edge Editor's UI writes. Second rather than first: it is a snapshot, and a
    // running API is always the more current answer. Its age is in the label so a stale one is
    // never mistaken for what the tool is serving today.
    if (existsSync(DEFAULT_EXPORT_PATH)) {
        return readExport(DEFAULT_EXPORT_PATH, ' (no API)');
    }

    throw new Error([
        `Could not read the live edge table from ${DEFAULT_EDGES_URL}: ${apiFailure}`,
        `  …and there is no export at ${DEFAULT_EXPORT_PATH}`,
        '  Export omc-edges.json from the Edge Editor into test/omc-v3-0/, start Labkoat-API with',
        '  LABKOAT_TOKEN set, point OMC_EDGES_URL elsewhere, name a document with --candidate,',
        '  or pass --static to check the shipped edges.js.',
        '  It does not fall back on its own: a pass against the hand-written table would',
        '  answer a question you did not ask.',
    ].join('\n'));
}

export default { loadCandidate, definitionsOf, DEFAULT_EDGES_URL };
