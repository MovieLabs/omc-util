/**
 * The edges CLI: check a published edge document, or build it into the table omc-util ships.
 *
 *   npm run edges:check -- [--from <file|url>] [--api] [--schema <path>] [--only coverage|inverse]
 *   npm run edges:build -- [--from <file|url>] [--api] [--schema <path>] [--dry]
 *
 * Both build the table with `src/edgeBuild` — the same code a client runs when it installs a live
 * publication with `omcTemplate.setEdgeTable` — and judge it against `accept/*.txt`.
 *
 * `check` reports. `build` gates: on any unaccepted finding it writes nothing. On a pass it writes
 *   - src/templates/v3-0/edgeTable.json        the table every consumer loads by default
 *   - the schema, when `--schema` names one     beside it, because the table's caps were read from it
 *   - tools/edges/input/omc-edges.json          the document it was built from, for a rebuild
 * and says which rows moved. Nothing is written when nothing would change.
 *
 * From OMC-Development, with no dependency on omc-util:
 *   npm --prefix ../../MovieLabs-POC/omcUtil run edges:build -- --schema OMC-JSON/OMC-JSON-v3.0.schema.json --from <export>
 *
 * @module tools/edges/cli
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { relative } from 'node:path';

import { buildEdgeArtifact, checks } from '../../src/edgeBuild/index.js';

import { judge } from './gate.js';
import { printRowDiff } from './rowDiff.js';
import {
    argValue, loadPublication, loadSchema, paths, ROOT,
} from './sources.js';

const line = (s = '') => console.log(s);

/** File content as compared: line endings normalised, so a checkout's CRLF is not a change. */
const contentOf = ((path) => (existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : null));

/** Write `text` to `path` unless it already holds it; say which. */
const writeIfChanged = ((path, text, dry) => {
    const name = relative(ROOT, path) || path;
    if (contentOf(path) === text.replace(/\r\n/g, '\n')) {
        line(`  unchanged  ${name}`);
        return false;
    }
    if (!dry) writeFileSync(path, text);
    line(`  ${dry ? 'would write' : 'written   '} ${name}`);
    return true;
});

async function main() {
    const command = process.argv[2];
    if (!['check', 'build'].includes(command)) {
        console.error('Usage: cli.js check|build [--from <file|url>] [--api] [--schema <path>] [--only <check>] [--dry]');
        process.exitCode = 1;
        return;
    }
    const gate = command === 'build';
    const only = argValue('--only');
    if (only && (gate || !checks[only])) {
        console.error(gate
            ? '--only is for check; a build runs every check.'
            : `--only takes ${Object.keys(checks).join(' or ')}, not "${only}"`);
        process.exitCode = 1;
        return;
    }

    let source;
    let schema;
    let built;
    try {
        source = await loadPublication({ from: argValue('--from'), api: process.argv.includes('--api') });
        schema = loadSchema(argValue('--schema'));
        built = buildEdgeArtifact(source.document, { schema: schema.schema, label: source.label, check: false });
    } catch (err) {
        // The reason is the whole message; a stack trace says nothing a reader needs. `exitCode`
        // rather than `exit()`: on Node 24 under Windows, exiting after a fetch loses the real code.
        console.error(err.message);
        process.exitCode = 1;
        return;
    }

    line(`schema: ${schema.path}${schema.bundled ? ' (bundled)' : ''}`);
    line(`input:  ${source.label}`);
    line(`table:  ${built.rows} rows across ${Object.keys(built.artifact.table).length} entity types; `
        + `${built.rdfNamed} named by the RDF model`);
    if (built.collisions.length) {
        line(`        ${built.collisions.length} collisions — two definitions claiming one path:`);
        built.collisions.forEach((collision) => line(`          ${collision}`));
    }
    line('');

    const subject = {
        table: built.artifact.table,
        inverseEdges: built.artifact.inverseEdges,
        definitions: built.definitions,
        collisions: built.collisions,
        schema: schema.schema,
    };
    let failing = 0;
    let warnings = 0;
    Object.entries(checks)
        .filter(([key]) => !only || key === only)
        .forEach(([key, check]) => {
            const verdict = judge(check, subject, {
                label: source.label, acceptPath: paths.accept[key], gate,
            });
            failing += verdict.failing;
            warnings += verdict.warnings;
        });

    if (!gate) return;
    if (failing) {
        console.error(`Nothing written: ${failing} blocking finding${failing === 1 ? '' : 's'} — `
            + 'the table would mint entities omcValidate rejects.');
        process.exitCode = 1;
        return;
    }
    if (warnings) {
        line(`Building with ${warnings} warning${warnings === 1 ? '' : 's'} outstanding. `
            + 'Each is valid output with work still to do; none of them breaks the table.');
    }

    const dry = process.argv.includes('--dry');
    const held = existsSync(paths.table) ? JSON.parse(readFileSync(paths.table, 'utf8')) : null;
    line(`=== BUILD${dry ? ' (dry run)' : ''} ===`);
    line('  against the table omc-util serves now:');
    printRowDiff(held?.table ?? null, built.artifact.table);
    line('');

    writeIfChanged(paths.table, `${JSON.stringify(built.artifact, null, 2)}\n`, dry);
    // The table's maxItems were read from this schema, so it goes with the table; test:registry
    // checks the two agree.
    if (!schema.bundled) writeIfChanged(paths.schema, readFileSync(schema.path, 'utf8'), dry);
    if (source.path !== paths.input) {
        writeIfChanged(paths.input, `${JSON.stringify(source.document, null, 2)}\n`, dry);
    }
    line(dry ? '\nDry run: nothing written.' : '\nNow: npm run release:check, then commit what changed.');
}

await main();
