/**
 * Take a published edge document and make it the shipped table.
 *
 * `src/templates/v3-0/edgeDefinitions.json` is the copy the library is built from. This reads a
 * published document, refuses it unless it is shaped like edge definitions, says which table rows
 * move, and writes it there and beside these checks. It writes nothing when the document would
 * change nothing, so it is safe to re-run.
 *
 * It does not run the gates: writing the file and judging the result are separate, so a failure
 * afterwards cannot leave you unsure whether anything was written.
 *
 *   Usage: node test/omc-v3-0/edgesUpdate.js [--from <file>] [--api] [--dry]
 *       --from   a file to take, default test/omc-v3-0/omc-edges.json (the export's own name)
 *       --api    fetch from a running service instead — OMC_EDGES_URL, LABKOAT_TOKEN
 *       --dry    report what would change and write nothing
 *
 * Run the gates afterwards: the table can change in ways only they can judge.
 *
 *   npm run edges:coverage && npm run edges:inverse
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';
import { definitionsOf, hydrateEdgeDefinitions } from '../../src/templates/v3-0/edgesHydrate.js';

import { DEFAULT_EDGES_URL, DEFAULT_EXPORT_PATH } from './candidateDefinitions.js';

const here = dirname(fileURLToPath(import.meta.url));

/** The one that ships: `edgeTable.js` imports this path and nothing else. */
const SHIPPED_PATH = join(here, '..', '..', 'src', 'templates', 'v3-0', 'edgeDefinitions.json');

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

const line = (s = '') => console.log(s);

/** Rows per partition, so a publication that quietly loses half the table cannot pass unremarked. */
const shapeOf = ((document) => {
    const definitions = hydrateEdgeDefinitions(definitionsOf(document));
    const { table, collisions } = buildEdgeTable(definitions);
    const paths = [];
    Object.entries(table).forEach(([domain, partitions]) => ['intrinsic', 'edges', 'cxtEdges']
        .forEach((partition) => Object.values(partitions[partition] || {})
            .forEach((entry) => paths.push(`${domain}|${partition}|${entry.path}`))));
    return { predicates: Object.keys(definitions).length, paths: paths.sort(), collisions };
});

async function fromApi() {
    const url = DEFAULT_EDGES_URL;
    const token = process.env.LABKOAT_TOKEN;
    const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
        throw new Error(`${url} answered ${response.status}.`
            + `${response.status === 401 ? ' The route is authenticated — set LABKOAT_TOKEN.' : ''}`);
    }
    return { document: await response.json(), label: url };
}

function fromFile(path) {
    if (!existsSync(path)) {
        throw new Error(`${path} is not there.\n`
            + '  Export the edges from the Edge Editor, or generate them with\n'
            + '  node Labkoat-API/src/vocabulary/edges/generate.js --format json --out <file>');
    }
    return { document: JSON.parse(readFileSync(path, 'utf8')), label: path };
}

async function main() {
    const dry = process.argv.includes('--dry');
    let source;
    try {
        source = process.argv.includes('--api')
            ? await fromApi()
            : fromFile(argValue('--from') || DEFAULT_EXPORT_PATH);
    } catch (err) {
        // `exitCode` rather than `exit()`: on Node 24 under Windows, exiting after a fetch trips a
        // libuv assertion and the real exit code is lost.
        console.error(err.message);
        process.exitCode = 1;
        return;
    }

    const next = JSON.stringify(source.document, null, 2);
    let incoming;
    try {
        incoming = shapeOf(source.document);
    } catch (err) {
        console.error(`${source.label} is not a published edge document.\n  ${err.message}`);
        process.exitCode = 1;
        return;
    }

    const held = existsSync(SHIPPED_PATH) ? JSON.parse(readFileSync(SHIPPED_PATH, 'utf8')) : null;
    const current = held ? shapeOf(held) : { predicates: 0, paths: [], collisions: [] };

    line('=== EDGES UPDATE ===');
    line(`  from: ${source.label}`);
    line(`  info: ${JSON.stringify(source.document?.generated ?? {})}`);
    line(`  predicates ${current.predicates} -> ${incoming.predicates}; `
        + `table rows ${current.paths.length} -> ${incoming.paths.length}`);

    const gone = current.paths.filter((path) => !incoming.paths.includes(path));
    const added = incoming.paths.filter((path) => !current.paths.includes(path));
    const show = ((title, list) => {
        if (!list.length) return;
        line(`\n  ${title} (${list.length})`);
        list.forEach((path) => line(`    ${path.replace(/\|/g, '  ')}`));
    });
    show('rows this removes', gone);
    show('rows this adds', added);
    if (incoming.collisions.length) {
        line(`\n  collisions (${incoming.collisions.length}) — two definitions claiming one path:`);
        incoming.collisions.forEach((collision) => line(`    ${collision}`));
    }
    if (!gone.length && !added.length) line('\n  no row moves; the change is in the fields, if any');

    if (held && next === JSON.stringify(held, null, 2)) {
        line('\nThe shipped document already matches. Nothing written.');
        return;
    }
    if (dry) {
        line(`\nDry run. Nothing written. Re-run without --dry to write ${SHIPPED_PATH}.`);
        return;
    }

    writeFileSync(SHIPPED_PATH, `${next}\n`);
    // The export's own copy beside the checks, so a bare `edges:coverage` reads what just shipped.
    if (source.label !== DEFAULT_EXPORT_PATH) writeFileSync(DEFAULT_EXPORT_PATH, `${next}\n`);
    line(`\nWrote ${SHIPPED_PATH}`);
    line('Now run the gates, which judge what this did: npm run edges:coverage && npm run edges:inverse');
}

await main();
