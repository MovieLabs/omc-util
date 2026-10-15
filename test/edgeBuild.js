/**
 * Guard: the edge table omc-util serves is the one the edge build makes, and a table installed at
 * runtime is served exactly — then undone exactly.
 *
 * Two halves of one promise. The bundled `v3-0/edgeTable.json` must be what `buildEdgeArtifact`
 * produces from the document it was last built from (`tools/edges/input/omc-edges.json`); a hand
 * edit, a generator change nobody rebuilt for, or a table written by a different omc-util's builder
 * shows up here, the last of those by name. And `omcTemplate.setEdgeTable`, the
 * seam a client uses to try a live publication, must change only edge facts, reach every accessor
 * that reads them, refuse a malformed table without disturbing the current one, and reset to a
 * table indistinguishable from the bundled one.
 *
 *   Usage: node test/edgeBuild.js
 */

import { readFileSync } from 'node:fs';

import manifest from '../package.json' with { type: 'json' };
import { buildEdgeArtifact } from '../src/edgeBuild/index.js';
import { edgeCreate, edgeValid } from '../src/omc/omcEdges.js';
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
// Asked first, because it is the likeliest reason the equality below fails and the only one the
// equality cannot state: the builder ships inside omc-util and is also published as
// `omc-util/edge-build`, so a repo that writes this table from its own installed copy writes it
// with that copy's builder, which need not be the one shipping it.
check('the bundled table was built by this omc-util',
    bundled.generated?.builder?.version === manifest.version,
    `built by ${bundled.generated?.builder?.version ?? 'an omc-util that did not say'}, `
    + `shipping in ${manifest.version} — rebuild with: npm run edges:build`);
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

// Character reaches NarrativeScene through more than one predicate, so the edit removes every row.
const edited = JSON.parse(json(bundled));
Object.entries(edited.table.Character.edges).forEach(([path, entry]) => {
    if (entry.allowed?.includes('NarrativeScene')) delete edited.table.Character.edges[path];
});
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
    // the same build, into the same seam. Here the edit stops every predicate connecting Character
    // to NarrativeScene, leaving the other domains of each group as they were.
    const live = JSON.parse(json(document));
    Object.values(live.json.edgeDefinitions).forEach((definition) => {
        definition.connects = (definition.connects || []).flatMap((group) => {
            if (!group.domain.includes('Character') || !group.range.includes('NarrativeScene')) return [group];
            return [
                { ...group, domain: group.domain.filter((domain) => domain !== 'Character') },
                { ...group, domain: ['Character'], range: group.range.filter((range) => range !== 'NarrativeScene') },
            ].filter((split) => split.domain.length && split.range.length);
        });
    });
    const built = buildEdgeArtifact(live);
    omcTemplate.setEdgeTable({
        schemaVersion: built.artifact.generated.schema.$id, artifact: built.artifact, source: 'live',
    });
    check('the artifact names the schema version it describes', built.artifact.generated.schema.$id === V3);
    check('an edge removed in the publication is refused once installed', !characterToScene());
    omcTemplate.resetEdgeTable({ schemaVersion: V3 });
    check('and offered again after reset', !!characterToScene());
}

console.log('=== spread edges: stated once, expanded when loaded ===');
{
    // informs/informedBy between three types, self-loops included, and one spread group added to an
    // existing predicate where a concrete row already holds the path it would expand to.
    const SPREAD = ['Asset', 'Task', 'Character'];
    const spread = JSON.parse(json(document));
    const defs = spread.json.edgeDefinitions;
    defs.informs = {
        predicate: 'informs', inverse: 'informedBy', rdf: 'const:omc:informs',
        connects: [{ domain: SPREAD, range: SPREAD, spread: true }],
    };
    defs.informedBy = {
        predicate: 'informedBy', inverse: 'informs', rdf: 'const:omc:informedBy',
        connects: [{ domain: SPREAD, range: SPREAD, spread: true }],
    };
    defs.has.connects.push({ domain: ['CreativeWork'], range: ['Asset'], spread: true });
    spread.rdf.properties.push({
        id: 'omc:informs', verbs: ['omc:informs'], domains: SPREAD.map((type) => `omc:${type}`), ranges: SPREAD.map((type) => `omc:${type}`),
    });
    const built = buildEdgeArtifact(spread);
    const { artifact: withSpread } = built;

    check('spread groups are carried as definitions, not rows',
        json(Object.keys(withSpread.spreadEdges).sort()) === json(['has', 'informedBy', 'informs'])
        && !withSpread.table.Asset.edges['edges.informs.Task']);
    check('a definition mixing both keeps only its spread group in spreadEdges',
        withSpread.spreadEdges.has.connects.length === 1 && withSpread.spreadEdges.has.connects[0].spread === true);
    check('its concrete groups are still built into rows',
        json(withSpread.table.CreativeWork.edges['edges.has.Asset']) === json(artifact.table.CreativeWork.edges['edges.has.Asset']));
    check('spreadEdges keep their rdf token as published', withSpread.spreadEdges.informs.rdf === 'const:omc:informs');
    check('generated counts the rows the spreads state', withSpread.generated.spreadRows === 9 + 9 + 1,
        `got ${withSpread.generated.spreadRows}`);
    check('the inverse map carries the spread predicates',
        withSpread.inverseEdges.informs === 'informedBy' && withSpread.inverseEdges.informedBy === 'informs');
    check('the RDF property a spread names is not reported unmatched', !built.rdfUnmatched.includes('omc:informs'));
    check('a table without spreads carries no spreadEdges key', !Object.hasOwn(artifact, 'spreadEdges'));

    omcTemplate.setEdgeTable({ schemaVersion: V3, artifact: withSpread, source: 'spread' });
    const row = omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'Asset' }).edges['edges.informs.Task'];
    check('installed, a spread pairing reads as an ordinary row',
        row?.predicate === 'informs' && json(row.allowed) === json(['Task'])
        && row.bucket === 'edges' && json(row.pathSegments) === json(['edges', 'informs', 'Task']));
    check('its inverse is the reverse spread, on the target',
        row?.inverseEdge?.path === 'edges.informedBy.Asset' && row.inverseEdge.predicate === 'informedBy');
    check('its RDF name is the property the spread names',
        row?.omcPredicate === 'omc:informs' && json(row.rdfProperties) === json(['omc:informs']));
    check('a self-loop is a pairing like any other',
        !!omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'Task' }).edges['edges.informs.Task']);
    check('the reverse is expanded on the range',
        !!omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'Character' }).edges['edges.informedBy.Asset']);
    check('a type the spread does not list gets no row',
        !omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'NarrativeScene' }).edges['edges.informs.Asset']);
    check('a concrete row at the same path wins over the spread',
        json(omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'CreativeWork' }).edges['edges.has.Asset'])
        === json(artifact.table.CreativeWork.edges['edges.has.Asset']));
    check('edgeValid offers the spread edge between two listed types',
        !!edgeValid({ fromEntity: entity('Asset', 'ast-1'), toEntity: entity('Character', 'chr-1') })?.['edges.informs.Character']);
    check('the installed artifact itself is not mutated by expansion', !withSpread.table.Asset.edges['edges.informs.Task']);
    check('a spreadEdges that is not an object is refused',
        throws(() => omcTemplate.setEdgeTable({ schemaVersion: V3, artifact: { ...withSpread, spreadEdges: [] } })));
    omcTemplate.resetEdgeTable({ schemaVersion: V3 });
    check('reset leaves no spread row behind',
        !omcTemplate.edgeTable({ schemaVersion: V3, entityType: 'Asset' }).edges['edges.informs.Task']);
}

const heard = notified;
stop();
omcTemplate.setEdgeTable({ schemaVersion: V3, artifact: bundled });
check('an unsubscribed listener hears nothing', notified === heard, `heard ${notified - heard} after unsubscribing`);
omcTemplate.resetEdgeTable({ schemaVersion: V3 });

console.log(failures ? `\nedgeBuild: ${failures} FAILED` : '\nedgeBuild: OK');
if (failures) process.exit(1);
