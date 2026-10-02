/**
 * Guard: the edge table omc-util serves is the one the edge build makes, and a table installed at
 * runtime is served exactly — then undone exactly.
 *
 * Two halves of one promise. The bundled `v3-0/edgeTable.json` must be what `buildEdgeArtifact`
 * produces from the document it was last built from (`tools/edges/input/omc-edges.json`); a hand
 * edit, or a generator change nobody rebuilt for, shows up here. And `omcTemplate.setEdgeTable`, the
 * seam a client uses to try a live publication, must change only edge facts, reach every accessor
 * that reads them, refuse a malformed table without disturbing the current one, and reset to a
 * table indistinguishable from the bundled one.
 *
 *   Usage: node test/edgeBuild.js
 */

import { readFileSync } from 'node:fs';

import { buildEdgeArtifact } from '../src/edgeBuild/index.js';
import { edgeCreate } from '../src/omc/omcEdges.js';
import { omcTemplate } from '../src/templates/index.js';

const V3 = 'https://movielabs.com/omc/json/schema/v3.0';
const V28 = 'https://movielabs.com/omc/json/schema/v2.8';

let failures = 0;
const pass = ((msg) => console.log(`  ✓ ${msg}`));
const fail = ((msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
});
const check = ((label, cond, detail = '') => (cond ? pass(label) : fail(`${label}   ${detail}`)));
const json = ((value) => JSON.stringify(value));
const throws = ((fn) => {
    try {
        fn();
    } catch {
        return true;
    }
    return false;
});
const readJson = ((path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8')));

/** Every answer an edge-reading accessor gives for v3.0, as one comparable string. */
const snapshot = (() => {
    const out = {};
    omcTemplate.allEntityTypes({ schemaVersion: V3 }).forEach((entityType) => {
        const table = omcTemplate.edgeTable({ schemaVersion: V3, entityType });
        out[entityType] = { table, inverseFor: {} };
        Object.values(table).flatMap((part) => Object.values(part)).forEach((row) => {
            out[entityType].inverseFor[row.path] = omcTemplate.inverseEdgeFor({ schemaVersion: V3, entityType, edge: row.path });
        });
    });
    out.graphQl = omcTemplate.graphQl({ schemaVersion: V3, entityType: 'Asset' });
    out.v28 = omcTemplate.edgeTable({ schemaVersion: V28, entityType: 'Asset' });
    return json(out);
});

const entity = ((entityType, id) => ({
    schemaVersion: V3, entityType, identifier: [{ identifierScope: 'test', identifierValue: id }],
}));
const characterToScene = (() => edgeCreate({
    fromEntity: entity('Character', 'chr-1'), toEntity: entity('NarrativeScene', 'scn-1'),
}));

console.log('=== the bundled table is the build of its input ===');
const document = readJson('../tools/edges/input/omc-edges.json');
const bundled = readJson('../src/templates/v3-0/edgeTable.json');
const { artifact, findings } = buildEdgeArtifact(document);
check('edgeTable.json equals buildEdgeArtifact(tools/edges/input/omc-edges.json)',
    json(JSON.parse(json(artifact))) === json(bundled),
    'rebuild with: npm run edges:build');
check('the build reports findings without refusing', typeof findings.coverage === 'object' && typeof findings.inverse === 'object');

check('a document that holds no edge definitions is refused',
    throws(() => buildEdgeArtifact({ generated: {}, namespace: {} })));

console.log('=== install ===');
const before = snapshot();
const versionBefore = omcTemplate.getVersion();
let notified = 0;
const stop = omcTemplate.subscribe(() => {
    notified += 1;
});

check('bundled source before any install', omcTemplate.edgeTableSource({ schemaVersion: V3 }).kind === 'bundled');
check('edgeTableSource() with no version is null while nothing is installed', omcTemplate.edgeTableSource() === null);
check('bundled can relate Character to NarrativeScene', !!characterToScene());

const edited = JSON.parse(json(bundled));
delete edited.table.Character.edges['edges.featuresIn.NarrativeScene'];
edited.table.NotARegisteredType = { intrinsic: {}, edges: {}, cxtEdges: {} };
const result = omcTemplate.setEdgeTable({ schemaVersion: V3, artifact: edited, source: 'test edit' });

check('subscribers hear an install once', notified === 1, `heard ${notified}`);
check('the version changes', omcTemplate.getVersion() !== versionBefore);
check('the source says installed, and names it',
    omcTemplate.edgeTableSource({ schemaVersion: V3 }).kind === 'installed'
    && omcTemplate.edgeTableSource({ schemaVersion: V3 }).label === 'test edit');
check('an unregistered type is reported, not served',
    json(result.unregistered) === json(['NotARegisteredType'])
    && omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'NotARegisteredType' }) === null);
check('edgeTable serves the installed rows',
    !omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'Character' }).edges['edges.featuresIn.NarrativeScene']);
check('edgeCreate follows the installed table', !characterToScene());
check('only edge facts change: graphQl is the bundled one',
    json(omcTemplate.graphQl({ schemaVersion: V3, entityType: 'Asset' })) === json(JSON.parse(before).graphQl));
check('another schema version is untouched',
    json(omcTemplate.edgeTable({ schemaVersion: V28, entityType: 'Asset' })) === json(JSON.parse(before).v28));

console.log('=== a malformed table is refused, and changes nothing ===');
const installed = snapshot();
[null, {}, { table: {}, inverseEdges: [] }, { table: { Asset: [] }, inverseEdges: {} },
    { table: { Asset: { edges: 'x' } }, inverseEdges: {} }].forEach((bad, i) => {
    check(`malformed artifact #${i + 1} throws`,
        throws(() => omcTemplate.setEdgeTable({ schemaVersion: V3, artifact: bad })));
});
check('the installed table is still served', snapshot() === installed);
check('no subscriber heard a refusal', notified === 1, `heard ${notified}`);

check('an unknown schema version throws',
    throws(() => omcTemplate.setEdgeTable({ schemaVersion: 'nope', artifact: bundled })));
check('edgeTableSource is null for an unknown schema version', omcTemplate.edgeTableSource({ schemaVersion: 'nope' }) === null);
check('edgeTableSource() with no version names the installed one',
    omcTemplate.edgeTableSource()?.schemaVersion === V3 && omcTemplate.edgeTableSource()?.label === 'test edit');

console.log('=== reset ===');
omcTemplate.resetEdgeTable({ schemaVersion: V3 });
check('subscribers hear the reset', notified === 2, `heard ${notified}`);
check('every accessor answers exactly as bundled', snapshot() === before);
check('the source says bundled again, with its provenance',
    omcTemplate.edgeTableSource({ schemaVersion: V3 }).kind === 'bundled'
    && json(omcTemplate.edgeTableSource({ schemaVersion: V3 }).generated) === json(bundled.generated));
omcTemplate.resetEdgeTable({ schemaVersion: V3 });
check('a second reset is a no-op', notified === 2, `heard ${notified}`);

console.log('=== the live path: an edited publication, built and installed ===');
{
    // What the Portal's "Try in graph" does: the publication as the Edge Editor now has it, through
    // the same build, into the same seam. Here the edit drops NarrativeScene from featuresIn.
    const live = JSON.parse(json(document));
    live.json.edgeDefinitions.featuresIn.connects.forEach((group) => {
        group.range = group.range.filter((range) => range !== 'NarrativeScene');
    });
    live.json.edgeDefinitions.featuresIn.connects = live.json.edgeDefinitions.featuresIn.connects
        .filter((group) => group.range.length);
    const built = buildEdgeArtifact(live);
    omcTemplate.setEdgeTable({
        schemaVersion: built.artifact.generated.schema.$id, artifact: built.artifact, source: 'live',
    });
    check('the artifact names the schema version it describes', built.artifact.generated.schema.$id === V3);
    check('an edge removed in the publication is refused once installed', !characterToScene());
    omcTemplate.resetEdgeTable({ schemaVersion: V3 });
    check('and offered again after reset', !!characterToScene());
}

const heard = notified;
stop();
omcTemplate.setEdgeTable({ schemaVersion: V3, artifact: bundled });
check('an unsubscribed listener hears nothing', notified === heard, `heard ${notified - heard} after unsubscribing`);
omcTemplate.resetEdgeTable({ schemaVersion: V3 });

console.log(failures ? `\nedgeBuild: ${failures} FAILED` : '\nedgeBuild: OK');
if (failures) process.exit(1);
