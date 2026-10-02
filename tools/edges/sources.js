/**
 * Where the edges CLI reads from, and where it writes.
 *
 * A published edge document comes from one of:
 *
 *   (nothing)       tools/edges/input/omc-edges.json — the document the bundled table was last built from
 *   --from <file>   any published document on disk (the Edge Editor's export is omc-edges.json)
 *   --from <url>    a running service
 *   --api           the service at OMC_EDGES_URL (default localhost:8080), with LABKOAT_TOKEN as bearer
 *
 * **There is no silent fallback.** A source that cannot be read fails and says so: a pass against a
 * subject nobody named answers a question nobody asked.
 *
 * Paths a person types resolve against the directory npm was run from (`INIT_CWD`), not this
 * package, so `npm --prefix <omcUtil> run edges:build -- --schema OMC-JSON/…` run from
 * OMC-Development reads OMC-Development's schema.
 *
 * @module tools/edges/sources
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** The omcUtil working copy this CLI belongs to. */
export const ROOT = resolve(here, '..', '..');

export const paths = {
    /** The document the bundled table was last built from; rewritten by a successful build. */
    input: resolve(here, 'input', 'omc-edges.json'),
    accept: {
        coverage: resolve(here, 'accept', 'coverage.accept.txt'),
        inverse: resolve(here, 'accept', 'inverse.accept.txt'),
    },
    /** What omc-util serves by default. */
    table: resolve(ROOT, 'src', 'templates', 'v3-0', 'edgeTable.json'),
    /** The schema omc-util bundles, and the build's default. */
    schema: resolve(ROOT, 'src', 'omc', 'validation', 'schema', 'OMC-JSON-v3.0.schema.json'),
};

export const edgesUrl = process.env.OMC_EDGES_URL || 'http://localhost:8080/api/vocab/v1/edges/publish?format=json';

/** How long to wait for the API before deciding it is not running. */
const PROBE_MS = 5000;

const isUrl = (value) => /^https?:\/\//i.test(value);

/** A path as the person meant it: relative to where they ran npm. */
export const userPath = ((path) => resolve(process.env.INIT_CWD || process.cwd(), path));

/** How long ago, in words, so a stale export cannot pass for a current one. */
const ageOf = ((path) => {
    const hours = (Date.now() - statSync(path).mtimeMs) / 3600000;
    if (hours < 1) return `${Math.round(hours * 60)} min old`;
    if (hours < 48) return `${Math.round(hours)} h old`;
    return `${Math.round(hours / 24)} days old`;
});

const describe = ((doc) => {
    const { viewId, edges, rows } = doc?.generated || {};
    return viewId ? `view ${viewId}, ${edges ?? '?'} edges / ${rows ?? '?'} rows` : 'no `generated` block';
});

/**
 * Fetch the published document from a running API. The route is authenticated, so set
 * `LABKOAT_TOKEN`; a 401 is reported as plainly as a refused connection.
 *
 * @param {string} url
 * @returns {Promise<{document: Object, label: string, path: null}>}
 */
async function fetchPublished(url) {
    const token = process.env.LABKOAT_TOKEN;
    // An own controller rather than AbortSignal.timeout, so no timer is left pending on failure.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_MS);
    let response;
    try {
        response = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
        });
    } catch (err) {
        throw new Error(`${url} did not answer: ${err.message}`);
    } finally {
        clearTimeout(timer);
    }
    if (!response.ok) {
        // Release the socket before throwing: exiting with it open trips a libuv assertion on Windows.
        await response.body?.cancel();
        throw new Error(`${url} answered ${response.status} ${response.statusText}${
            response.status === 401 && !token ? ' — set LABKOAT_TOKEN' : ''}`);
    }
    const document = await response.json();
    return { document, label: `${url} (${describe(document)})`, path: null };
}

/**
 * @param {string} path - Absolute
 * @returns {{document: Object, label: string, path: string}}
 */
function readPublished(path) {
    if (!existsSync(path)) {
        throw new Error(`${path} is not there.\n`
            + '  Export the edges from the Edge Editor (it names the file omc-edges.json), or generate\n'
            + '  them with: node Labkoat-API/src/vocabulary/edges/generate.js --format json --out <file>');
    }
    const document = JSON.parse(readFileSync(path, 'utf8'));
    return { document, label: `${path} — ${ageOf(path)}, ${describe(document)}`, path };
}

/**
 * @param {{from?: string|null, api?: boolean}} [options]
 * @returns {Promise<{document: Object, label: string, path: string|null}>}
 */
export async function loadPublication({ from = null, api = false } = {}) {
    if (api) return fetchPublished(edgesUrl);
    if (from && isUrl(from)) return fetchPublished(from);
    if (from) return readPublished(userPath(from));
    return readPublished(paths.input);
}

/**
 * The schema to build against: `--schema <path>`, or the one omc-util bundles.
 *
 * @param {string|null} from
 * @returns {{schema: Object, path: string, bundled: boolean}}
 */
export function loadSchema(from) {
    const path = from ? userPath(from) : paths.schema;
    if (!existsSync(path)) throw new Error(`${path} is not there.`);
    return { schema: JSON.parse(readFileSync(path, 'utf8')), path, bundled: path === paths.schema };
}

/** `--name value` from argv, or null. */
export const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};
