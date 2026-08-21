/**
 * Checks for omcMapping — the row-oriented template interpreter.
 *
 * The properties that matter most are the ones the whole feature rests on: identity is
 * deterministic (so a re-run updates rather than duplicates), array-shaped properties are written
 * as arrays (so the entity validates), relationships resolve whether or not the target was built
 * from the same row, and match keys fold rows together keeping the first value seen.
 *
 *   Usage: node test/omcMapping.js
 */

import { omcMapping } from '../index.js';

const V3 = 'https://movielabs.com/omc/json/schema/v3.0';
const OPTIONS = { schemaVersion: V3, identifierScope: 'movielabs.com', seedNamespace: 'TEST' };

let failures = 0;
const fail = (msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);
const ok = (condition, msg) => (condition ? pass(msg) : fail(msg));

/** A template exercising every property spec form, plus an edge. */
const MAPPING = [
    {
        entityType: 'AssetStructure',
        key: 'File Name',
        properties: {
            'label': 'File Name',
            'assetStructureType': { const: 'digital.movingImage' },
            'assetStructureProperties.fileDetails.fileName': 'File Name',
            'assetStructureProperties.audioSampleRate': { from: 'Audio Sample Rate', as: 'number' },
        },
    },
    {
        entityType: 'Asset',
        key: 'File Name',
        properties: { label: 'File Name' },
        edges: [{ to: 'AssetStructure', via: 'File Name' }],
        customData: { domain: 'Frame.io', rest: true, exclude: ['Audio Sample Rate'] },
    },
];

const ROW = {
    'File Name': 'A039C006.mov',
    'Audio Sample Rate': '48000',
    'Scene': 16,
    'Slate': '16K',
};

console.log('\nomcMapping');

/* ------------------------------------------------------------------ mapRow ---------------- */

const first = omcMapping.mapRow({ row: ROW, mapping: MAPPING, options: OPTIONS });

ok(Object.keys(first.entities).sort().join(',') === 'Asset,AssetStructure',
    'builds one entity per mapping entry, keyed by entityType');

ok(first.entities.AssetStructure.assetStructureType === 'digital.movingImage',
    'writes a const as a fixed value');

ok(first.entities.AssetStructure.assetStructureProperties.fileDetails.fileName === 'A039C006.mov',
    'writes a nested dotted path');

ok(first.entities.AssetStructure.assetStructureProperties.audioSampleRate === 48000,
    'casts a string cell to a number');

ok(first.entities.Asset.customData?.[0]?.value?.Scene === 16
    && first.entities.Asset.customData[0].domain === 'Frame.io',
'carries unconsumed columns to customData under the declared domain');

ok(first.entities.Asset.customData[0].value['Audio Sample Rate'] === undefined,
    'customData honours exclude');

ok(first.entities.Asset.customData[0].value['File Name'] === undefined,
    'customData omits a column a property already consumed');

/* --------------------------------------------------------- deterministic identity --------- */

const second = omcMapping.mapRow({ row: ROW, mapping: MAPPING, options: OPTIONS });
ok(JSON.stringify(first.entities) === JSON.stringify(second.entities),
    'the same row twice produces byte-identical entities');

const otherScope = omcMapping.mapRow({
    row: ROW, mapping: MAPPING, options: { ...OPTIONS, seedNamespace: 'OTHER' },
});
ok(otherScope.entities.Asset.identifier[0].identifierValue
    !== first.entities.Asset.identifier[0].identifierValue,
'seedNamespace participates in the identifier');

ok(first.entities.Asset.identifier[0].identifierValue
    !== first.entities.AssetStructure.identifier[0].identifierValue,
'one key mints distinct identifiers for different entity types');

/* ------------------------------------------------------------------- edges ---------------- */

ok(JSON.stringify(first.entities.Asset)
    .includes(first.entities.AssetStructure.identifier[0].identifierValue),
'links an entity to another built from the same row');

const REF_MAPPING = [{
    entityType: 'Asset',
    key: 'File Name',
    properties: { label: 'File Name' },
    // AssetStructure is not built here, so this must resolve to a reference stub.
    edges: [{ to: 'AssetStructure', via: 'Structure Key' }],
}];
const refRow = { 'File Name': 'A039C006.mov', 'Structure Key': 'somewhere-else' };
const refOut = omcMapping.mapRow({ row: refRow, mapping: REF_MAPPING, options: OPTIONS });
const stubId = omcMapping.entityRef({
    entityType: 'AssetStructure', key: 'somewhere-else', options: OPTIONS,
}).identifier[0].identifierValue;
ok(JSON.stringify(refOut.entities.Asset).includes(stubId),
    'references an entity this row did not build, seeded identically');

// Slate -> Character is genuinely blocked by the v3.0 edge table. (Asset -> NarrativeScene is
// NOT — it is `edges.for.NarrativeScene` — which is exactly why the example has to be checked
// against the schema rather than assumed.)
const BAD_EDGE = [
    { entityType: 'Slate', key: 'k', edges: [{ to: 'Character', via: 'k' }] },
];
const badOut = omcMapping.mapRow({ row: { k: 'x' }, mapping: BAD_EDGE, options: OPTIONS });
ok(badOut.notes.some((n) => n.kind === 'edgeNotAllowed'),
    'reports a relationship the schema disallows rather than writing it');

/* ---------------------------------------------------------------- array paths ------------- */

const ARRAY_MAPPING = [{
    entityType: 'Asset',
    key: 'File Name',
    properties: {
        'label': 'File Name',
        'annotation.title': 'Slate',
        'annotation.text': 'File Name',
    },
}];
const arr = omcMapping.mapRow({ row: ROW, mapping: ARRAY_MAPPING, options: OPTIONS });
const annotation = arr.entities.Asset.annotation;
ok(Array.isArray(annotation) && annotation.length === 1,
    'an array-of-object property is written as an array with one element');
ok(annotation?.[0]?.title === '16K' && annotation?.[0]?.text === 'A039C006.mov',
    'sibling sub-paths merge into the same array element');

const INDEXED = [{
    entityType: 'Asset',
    key: 'File Name',
    properties: {
        'label': 'File Name',
        'annotation[0].title': 'Slate',
        'annotation[1].title': 'File Name',
    },
}];
const indexed = omcMapping.mapRow({ row: ROW, mapping: INDEXED, options: OPTIONS });
ok(indexed.entities.Asset.annotation?.[0]?.title === '16K'
    && indexed.entities.Asset.annotation?.[1]?.title === 'A039C006.mov',
'explicit array indices target their own elements');

// Worth pinning down, because it surprises: an index whose earlier siblings were never filled
// does NOT leave a hole. Empty elements are pruned, so `annotation[1]` alone lands at [0] — an
// entity asserting an empty annotation would be worse than one with a shifted index.
const sparse = omcMapping.mapRow({
    row: ROW,
    mapping: [{
        entityType: 'Asset',
        key: 'File Name',
        properties: { 'label': 'File Name', 'annotation[1].title': 'Slate' },
    }],
    options: OPTIONS,
});
ok(sparse.entities.Asset.annotation.length === 1
    && sparse.entities.Asset.annotation[0].title === '16K',
'an index with nothing before it collapses rather than leaving an empty element');

/* -------------------------------------------------------------- the match-key fold -------- */

const SCENE_MAPPING = [{
    entityType: 'ProductionScene',
    key: 'Scene',
    properties: { label: 'Scene', description: 'Description' },
}];
const run = omcMapping.createRun({ mapping: SCENE_MAPPING, options: OPTIONS });
run.add({ Scene: '16', Description: 'first seen' });
run.add({ Scene: '16', Description: 'a later row disagrees' });
run.add({ Scene: '17', Description: 'another scene' });
const folded = run.result();

ok(folded.entities.length === 2, 'rows sharing a key collapse into one entity');
ok(folded.counts.rows === 3 && folded.counts.byType.ProductionScene === 2,
    'counts report rows consumed and entities produced');
const scene16 = folded.entities.find((e) => e.label === '16');
ok(scene16?.description === 'first seen',
    'the first value seen wins a conflict; later rows fill gaps');

const gapRun = omcMapping.createRun({ mapping: SCENE_MAPPING, options: OPTIONS });
gapRun.add({ Scene: '16', Description: '' });
gapRun.add({ Scene: '16', Description: 'supplied by a later row' });
ok(gapRun.result().entities[0].description === 'supplied by a later row',
    'a later row fills a gap the first row left');

/* -------------------------------------------------------------------- notes --------------- */

const noKey = omcMapping.mapRow({
    row: { 'File Name': '' }, mapping: MAPPING, options: OPTIONS,
});
ok(Object.keys(noKey.entities).length === 0
    && noKey.notes.every((n) => n.kind === 'noKeyValue'),
'a row with no key value builds nothing and says so');

/* ------------------------------------------- a source that already names itself ------------ */

const SUPPLIED = [{
    entityType: 'Asset',
    // No `key`: mapping the source's own id says which column names the thing, which is the only
    // question a key asks.
    properties: { 'label': 'File Name', 'identifier[0].identifierValue': 'Frame ID' },
}];
const suppliedRow = { 'File Name': 'A039C006.mov', 'Frame ID': 'file-a-123' };
const supplied = omcMapping.mapRow({ row: suppliedRow, mapping: SUPPLIED, options: OPTIONS });
const suppliedId = supplied.entities.Asset.identifier[0];

ok(suppliedId.identifierValue === 'file-a-123',
    'a mapped identifierValue is used verbatim rather than hashed');
ok(suppliedId.identifierScope === OPTIONS.identifierScope,
    'and the run\'s scope fills in, so the identifier is not left scopeless');
ok(supplied.entities.Asset.identifier.length === 1,
    'the supplied identifier replaces the hash rather than sitting beside it');
ok(omcMapping.check({ mapping: SUPPLIED, options: OPTIONS }).valid,
    'check accepts a mapped identifierValue in place of a key column');

// An edge pointing at such an entity must use its real name, not a hash of it.
const REF_TO_SUPPLIED = [
    ...SUPPLIED,
    {
        entityType: 'AssetStructure',
        key: 'File Name',
        properties: { assetStructureType: { const: 'digital.movingImage' } },
        edges: [{ to: 'Asset', via: 'Frame ID' }],
    },
];
const linked = omcMapping.mapRow({ row: suppliedRow, mapping: REF_TO_SUPPLIED, options: OPTIONS });
ok(JSON.stringify(linked.entities.AssetStructure).includes('file-a-123'),
    'a reference to a self-naming entity uses that name, not a hash of it');

/* ------------------------------------------------------ a key that is not unique ----------- */

const dupRun = omcMapping.createRun({
    mapping: [{ entityType: 'Asset', key: 'File Name', properties: { label: 'File Name', description: 'Note' } }],
    options: OPTIONS,
});
dupRun.add({ 'File Name': 'dup.mov', 'Note': 'first' });
dupRun.add({ 'File Name': 'dup.mov', 'Note': 'second, disagrees' });
dupRun.add({ 'File Name': 'other.mov', 'Note': 'fine' });
const dup = dupRun.result();

ok(dup.entities.length === 2, 'rows sharing a key fold, as a match key is meant to');
ok(dup.counts.folded === 1, 'the fold is counted');
ok(dup.notes.some((n) => n.kind === 'keyNotUnique' && n.where === 'Asset'),
    'and reported — a non-unique key silently discarded the later row before this');

/* ------------------------------ measurements typed as a format union ----------------------- */

// Regression: `dimensions.height` is `oneOf: [null, metric-string, imperial-string, pixel-string]`.
// Treating that as a type union dropped all three sub-properties, leaving `dimensions` an empty
// object nothing could be mapped onto. The branches disagree about FORMAT, not type — one shape
// constrained three ways — so the shape is a string and the property is mappable.
const dims = omcMapping.mapRow({
    row: { k: 'x', W: '1920px', H: '1080px' },
    mapping: [{
        entityType: 'AssetStructure',
        key: 'k',
        properties: {
            'assetStructureType': { const: 'digital.image' },
            'assetStructureProperties.dimensions.width': 'W',
            'assetStructureProperties.dimensions.height': 'H',
        },
    }],
    options: OPTIONS,
}).entities.AssetStructure;
ok(dims.assetStructureProperties.dimensions.width === '1920px'
    && dims.assetStructureProperties.dimensions.height === '1080px',
'a measurement typed as a format union is mappable, not an empty object');

/* ------------------------ referencing an entity by an id the source carries ----------------- */

// Regression: `check` walked only the data shape, and omcTemplate.shape() deliberately excludes
// relationships — so dropping a foreign identifier into an edge slot was reported as a property
// the entity does not have, even though the runtime built it correctly.
const EDGE_ID = [{
    entityType: 'Asset',
    key: 'File Name',
    properties: {
        'label': 'File Name',
        'edges.has.Slate[0].identifier[0].identifierValue': 'Slate Id',
    },
}];
const edgeCheck = omcMapping.check({ mapping: EDGE_ID, options: OPTIONS });
ok(edgeCheck.valid,
    `an identifier written into an edge slot is accepted${edgeCheck.valid ? '' : `: ${edgeCheck.problems.map((p) => p.detail).join('; ')}`}`);

const edgeOut = omcMapping.mapRow({
    row: { 'File Name': 'A039.mov', 'Slate Id': 'slate-16K' },
    mapping: EDGE_ID,
    options: OPTIONS,
});
ok(edgeOut.entities.Asset.edges.has.Slate[0].identifier[0].identifierValue === 'slate-16K',
    'and builds the reference, without building the entity referenced');

// The slot itself is a relationship, not a value — mapping a column straight onto it is a mistake
// worth naming rather than letting it write a string where a reference belongs.
const bareSlot = omcMapping.check({
    mapping: [{ entityType: 'Asset', key: 'k', properties: { 'edges.has.Slate': 'c' } }],
    options: OPTIONS,
});
ok(!bareSlot.valid && /relationship to Slate/.test(bareSlot.problems[0].detail),
    'mapping a column onto the relationship itself is refused, and says what to do instead');

ok(!omcMapping.check({
    mapping: [{ entityType: 'Asset', key: 'k', properties: { 'edges.has.Slate[0].nonsense': 'c' } }],
    options: OPTIONS,
}).valid, 'but an arbitrary property inside a reference is still rejected');

/* ------------------------------------------------------------------- check ---------------- */

ok(omcMapping.check({ mapping: MAPPING, options: OPTIONS }).valid,
    'check passes a sound mapping');

const problems = (m) => omcMapping.check({ mapping: m, options: OPTIONS }).problems.map((p) => p.kind);

ok(problems([{ entityType: 'Nonsense', key: 'k' }]).includes('unknownEntityType'),
    'check rejects an unknown entity type');
ok(problems([{ entityType: 'Asset', key: 'k', properties: { nope: 'c' } }]).includes('unknownProperty'),
    'check rejects a property the schema does not have');
ok(problems([{ entityType: 'Asset', properties: { label: 'c' } }]).includes('missingKey'),
    'check requires a key column');
ok(problems([
    { entityType: 'Asset', key: 'k' }, { entityType: 'Asset', key: 'k' },
]).includes('duplicateEntityType'),
'check rejects two entities of the same type in one template');
ok(problems([{
    entityType: 'AssetStructure', key: 'k', properties: { assetStructureType: { const: 'nope' } },
}]).includes('valueNotAllowed'),
'check rejects a const outside a controlled value list');
ok(problems([
    { entityType: 'Asset', key: 'k', edges: [{ to: 'AssetStructure', via: 'k', inverse: true }] },
    { entityType: 'AssetStructure', key: 'k', edges: [{ to: 'Asset', via: 'k', inverse: true }] },
]).includes('inverseDeclaredTwice'),
'check catches an inverse declared from both ends');

/* --------------------------------------------------------------- checkColumns ------------- */

const cols = omcMapping.checkColumns({ mapping: MAPPING, columns: Object.keys(ROW) });
ok(cols.valid, 'checkColumns passes when every named column is present');

const short = omcMapping.checkColumns({ mapping: MAPPING, columns: ['File Name'] });
ok(!short.valid && short.missing.includes('Audio Sample Rate'),
    'checkColumns names the columns a mapping expects but the data lacks');

/* ------------------------------------------------------------------------------------------ */

console.log();
if (failures) {
    console.error(`omcMapping: ${failures} failure(s)`);
    process.exit(1);
}
console.log('omcMapping: all checks passed');
