/**
 * Checks for omcMapping — the row-oriented template interpreter.
 *
 * The properties that matter most are the ones the whole feature rests on: identity is
 * deterministic (so a re-run updates rather than duplicates), array-shaped properties are written
 * as arrays (so the entity validates), relationships resolve whether or not the target was built
 * from the same row, match keys fold rows together keeping the first value seen, and an entry is
 * named by its id — so one template can build several entities of one type.
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
        id: 'structure',
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
        id: 'asset',
        entityType: 'Asset',
        key: 'File Name',
        properties: { label: 'File Name' },
        edges: [{ to: 'structure', via: 'File Name' }],
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

ok(Object.keys(first.entities).sort().join(',') === 'asset,structure',
    'builds one entity per mapping entry, keyed by entry id');

ok(first.entities.structure.assetStructureType === 'digital.movingImage',
    'writes a const as a fixed value');

ok(first.entities.structure.assetStructureProperties.fileDetails.fileName === 'A039C006.mov',
    'writes a nested dotted path');

ok(first.entities.structure.assetStructureProperties.audioSampleRate === 48000,
    'casts a string cell to a number');

ok(first.entities.asset.customData?.[0]?.value?.Scene === 16
    && first.entities.asset.customData[0].domain === 'Frame.io',
'carries unconsumed columns to customData under the declared domain');

ok(first.entities.asset.customData[0].value['Audio Sample Rate'] === undefined,
    'customData honours exclude');

ok(first.entities.asset.customData[0].value['File Name'] === undefined,
    'customData omits a column a property already consumed');

/* --------------------------------------------------------- deterministic identity --------- */

const second = omcMapping.mapRow({ row: ROW, mapping: MAPPING, options: OPTIONS });
ok(JSON.stringify(first.entities) === JSON.stringify(second.entities),
    'the same row twice produces byte-identical entities');

const otherScope = omcMapping.mapRow({
    row: ROW, mapping: MAPPING, options: { ...OPTIONS, seedNamespace: 'OTHER' },
});
ok(otherScope.entities.asset.identifier[0].identifierValue
    !== first.entities.asset.identifier[0].identifierValue,
'seedNamespace participates in the identifier');

ok(first.entities.asset.identifier[0].identifierValue
    !== first.entities.structure.identifier[0].identifierValue,
'one key mints distinct identifiers for different entity types');

const renamed = omcMapping.mapRow({
    row: ROW,
    mapping: MAPPING.map((m) => ({
        ...m,
        id: `${m.id}-renamed`,
        edges: m.edges?.map((e) => ({ ...e, to: `${e.to}-renamed` })),
    })),
    options: OPTIONS,
});
ok(renamed.entities['asset-renamed'].identifier[0].identifierValue
    === first.entities.asset.identifier[0].identifierValue,
'an entry id is not part of the identifier: renaming an entry does not change what it builds');

/* ------------------------------------------------------------------- edges ---------------- */

ok(JSON.stringify(first.entities.asset)
    .includes(first.entities.structure.identifier[0].identifierValue),
'links an entity to another built from the same row');

const REF_MAPPING = [{
    id: 'asset',
    entityType: 'Asset',
    key: 'File Name',
    properties: { label: 'File Name' },
    // No entry builds the AssetStructure, so this must resolve to a reference stub.
    edges: [{ toType: 'AssetStructure', via: 'Structure Key' }],
}];
const refRow = { 'File Name': 'A039C006.mov', 'Structure Key': 'somewhere-else' };
const refOut = omcMapping.mapRow({ row: refRow, mapping: REF_MAPPING, options: OPTIONS });
const stubId = omcMapping.entityRef({
    entityType: 'AssetStructure', key: 'somewhere-else', options: OPTIONS,
}).identifier[0].identifierValue;
ok(JSON.stringify(refOut.entities.asset).includes(stubId),
    'toType references an entity no entry builds, seeded identically');

const ENTRY_ELSEWHERE = [
    {
        id: 'asset', entityType: 'Asset', key: 'File Name', edges: [{ to: 'structure', via: 'Structure Key' }],
    },
    { id: 'structure', entityType: 'AssetStructure', key: 'File Name' },
];
const elsewhere = omcMapping.mapRow({ row: refRow, mapping: ENTRY_ELSEWHERE, options: OPTIONS });
ok(JSON.stringify(elsewhere.entities.asset).includes(stubId)
    && !JSON.stringify(elsewhere.entities.asset).includes(elsewhere.entities.structure.identifier[0].identifierValue),
'an edge to an entry, by a key that entry did not build on this row, references the keyed entity instead');

const dangling = omcMapping.mapRow({
    row: refRow,
    mapping: [{ id: 'asset', entityType: 'Asset', key: 'File Name', edges: [{ to: 'nobody', via: 'Structure Key' }] }],
    options: OPTIONS,
});
ok(dangling.notes.some((n) => n.kind === 'unknownEdgeTarget') && !dangling.entities.asset.AssetStructure,
    'an edge naming no entry is reported and not written');

// The v3.0 edge table gives Slate no path to AssetStructure: `informs` reaches every entity type
// except the three structures, and nothing else connects them.
const BAD_EDGE = [
    { id: 'slate', entityType: 'Slate', key: 'k', edges: [{ toType: 'AssetStructure', via: 'k' }] },
];
const badOut = omcMapping.mapRow({ row: { k: 'x' }, mapping: BAD_EDGE, options: OPTIONS });
ok(badOut.notes.some((n) => n.kind === 'edgeNotAllowed'),
    'reports a relationship the schema disallows rather than writing it');

/* ------------------------------------------------- several entities of one type ------------ */

// Each Asset has its own structure, and every Asset is a member of one group structure — two
// AssetStructure entries, told apart by id and keyed on different columns.
const GROUPED = [
    {
        id: 'asset', entityType: 'Asset', key: 'File', properties: { label: 'File' },
        edges: [{ to: 'fileStructure', via: 'File', edgeKey: 'AssetStructure' }],
    },
    {
        id: 'fileStructure', entityType: 'AssetStructure', key: 'File',
        properties: { 'assetStructureType': { const: 'digital.movingImage' }, 'assetStructureProperties.fileDetails.fileName': 'File' },
    },
    {
        id: 'group', entityType: 'AssetStructure', key: 'Group', properties: { label: 'Group' },
        edges: [{ to: 'asset', via: 'File', edgeKey: 'assetStructureProperties.assetGroup.Member' }],
    },
];
ok(omcMapping.check({ mapping: GROUPED, options: OPTIONS }).valid,
    'check accepts two entries of one type with their own ids');
const groupRun = omcMapping.createRun({ mapping: GROUPED, options: OPTIONS });
for (let i = 1; i <= 10; i += 1) groupRun.add({ File: `clip${i}.mov`, Group: 'Day 1' });
const grouped = groupRun.result();
const structures = grouped.entities.filter((e) => e.entityType === 'AssetStructure');
const group = structures.find((e) => e.label === 'Day 1');
ok(grouped.counts.byType.Asset === 10 && structures.length === 11,
    'ten rows build ten Assets, ten file structures and one group');
ok(group?.assetStructureProperties?.assetGroup?.Member?.length === 10,
    'the group collects all ten Assets as members');
const firstAsset = grouped.entities.find((e) => e.label === 'clip1.mov');
const ownStructure = structures.find((e) => e.assetStructureProperties?.fileDetails?.fileName === 'clip1.mov');
const assetRefs = JSON.stringify(firstAsset.AssetStructure);
ok(assetRefs.includes(ownStructure.identifier[0].identifierValue)
    && !assetRefs.includes(group.identifier[0].identifierValue),
'each Asset points at its own structure, not the group');

// Two entries of one type identified by one column describe one entity: they fold into it.
const SAME = [
    { id: 'a1', entityType: 'Asset', key: 'File', properties: { label: 'File' } },
    { id: 'a2', entityType: 'Asset', key: 'File', properties: { description: 'Note' } },
];
const sameCheck = omcMapping.check({ mapping: SAME, options: OPTIONS });
ok(sameCheck.valid && sameCheck.warnings.some((w) => w.kind === 'sameEntity'),
    'two entries of one type on one identity column pass, with a warning that they build one entity');
const sameRun = omcMapping.createRun({ mapping: SAME, options: OPTIONS });
sameRun.add({ File: 'x.mov', Note: 'from the second entry' });
const sameOut = sameRun.result();
ok(sameOut.entities.length === 1 && sameOut.entities[0].label === 'x.mov'
    && sameOut.entities[0].description === 'from the second entry',
'and the run folds them into one entity carrying both entries\' properties');

/* ---------------------------------------------------------------- array paths ------------- */

const ARRAY_MAPPING = [{
    id: 'asset',
    entityType: 'Asset',
    key: 'File Name',
    properties: {
        'label': 'File Name',
        'annotation.title': 'Slate',
        'annotation.text': 'File Name',
    },
}];
const arr = omcMapping.mapRow({ row: ROW, mapping: ARRAY_MAPPING, options: OPTIONS });
const annotation = arr.entities.asset.annotation;
ok(Array.isArray(annotation) && annotation.length === 1,
    'an array-of-object property is written as an array with one element');
ok(annotation?.[0]?.title === '16K' && annotation?.[0]?.text === 'A039C006.mov',
    'sibling sub-paths merge into the same array element');

const INDEXED = [{
    id: 'asset',
    entityType: 'Asset',
    key: 'File Name',
    properties: {
        'label': 'File Name',
        'annotation[0].title': 'Slate',
        'annotation[1].title': 'File Name',
    },
}];
const indexed = omcMapping.mapRow({ row: ROW, mapping: INDEXED, options: OPTIONS });
ok(indexed.entities.asset.annotation?.[0]?.title === '16K'
    && indexed.entities.asset.annotation?.[1]?.title === 'A039C006.mov',
'explicit array indices target their own elements');

// Worth pinning down, because it surprises: an index whose earlier siblings were never filled
// does NOT leave a hole. Empty elements are pruned, so `annotation[1]` alone lands at [0] — an
// entity asserting an empty annotation would be worse than one with a shifted index.
const sparse = omcMapping.mapRow({
    row: ROW,
    mapping: [{
        id: 'asset',
        entityType: 'Asset',
        key: 'File Name',
        properties: { 'label': 'File Name', 'annotation[1].title': 'Slate' },
    }],
    options: OPTIONS,
});
ok(sparse.entities.asset.annotation.length === 1
    && sparse.entities.asset.annotation[0].title === '16K',
'an index with nothing before it collapses rather than leaving an empty element');

/* -------------------------------------------------------------- the match-key fold -------- */

const SCENE_MAPPING = [{
    id: 'scene',
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
    id: 'asset',
    entityType: 'Asset',
    // No `key`: mapping the source's own id says which column names the thing, which is the only
    // question a key asks.
    properties: { 'label': 'File Name', 'identifier[0].identifierValue': 'Frame ID' },
}];
const suppliedRow = { 'File Name': 'A039C006.mov', 'Frame ID': 'file-a-123' };
const supplied = omcMapping.mapRow({ row: suppliedRow, mapping: SUPPLIED, options: OPTIONS });
const suppliedId = supplied.entities.asset.identifier[0];

ok(suppliedId.identifierValue === 'file-a-123',
    'a mapped identifierValue is used verbatim rather than hashed');
ok(suppliedId.identifierScope === OPTIONS.identifierScope,
    'and the run\'s scope fills in, so the identifier is not left scopeless');
ok(supplied.entities.asset.identifier.length === 1,
    'the supplied identifier replaces the hash rather than sitting beside it');
ok(omcMapping.check({ mapping: SUPPLIED, options: OPTIONS }).valid,
    'check accepts a mapped identifierValue in place of a key column');

// An edge pointing at such an entity must use its real name, not a hash of it.
const REF_TO_SUPPLIED = [
    ...SUPPLIED,
    {
        id: 'structure',
        entityType: 'AssetStructure',
        key: 'File Name',
        properties: { assetStructureType: { const: 'digital.movingImage' } },
        edges: [{ to: 'asset', via: 'Frame ID' }],
    },
];
const linked = omcMapping.mapRow({ row: suppliedRow, mapping: REF_TO_SUPPLIED, options: OPTIONS });
ok(JSON.stringify(linked.entities.structure).includes('file-a-123'),
    'a reference to a self-naming entity uses that name, not a hash of it');

/* ------------------------------------------------------ a key that is not unique ----------- */

const dupRun = omcMapping.createRun({
    mapping: [{
        id: 'asset', entityType: 'Asset', key: 'File Name', properties: { label: 'File Name', description: 'Note' },
    }],
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
        id: 'structure',
        entityType: 'AssetStructure',
        key: 'k',
        properties: {
            'assetStructureType': { const: 'digital.image' },
            'assetStructureProperties.dimensions.width': 'W',
            'assetStructureProperties.dimensions.height': 'H',
        },
    }],
    options: OPTIONS,
}).entities.structure;
ok(dims.assetStructureProperties.dimensions.width === '1920px'
    && dims.assetStructureProperties.dimensions.height === '1080px',
'a measurement typed as a format union is mappable, not an empty object');

/* ------------------------ referencing an entity by an id the source carries ----------------- */

// Regression: `check` walked only the data shape, and omcTemplate.shape() deliberately excludes
// relationships — so dropping a foreign identifier into an edge slot was reported as a property
// the entity does not have, even though the runtime built it correctly.
const EDGE_ID = [{
    id: 'asset',
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
ok(edgeOut.entities.asset.edges.has.Slate[0].identifier[0].identifierValue === 'slate-16K',
    'and builds the reference, without building the entity referenced');

// The slot itself is a relationship, not a value — mapping a column straight onto it is a mistake
// worth naming rather than letting it write a string where a reference belongs.
const bareSlot = omcMapping.check({
    mapping: [{ id: 'asset', entityType: 'Asset', key: 'k', properties: { 'edges.has.Slate': 'c' } }],
    options: OPTIONS,
});
ok(!bareSlot.valid && /relationship to Slate/.test(bareSlot.problems[0].detail),
    'mapping a column onto the relationship itself is refused, and says what to do instead');

ok(!omcMapping.check({
    mapping: [{ id: 'asset', entityType: 'Asset', key: 'k', properties: { 'edges.has.Slate[0].nonsense': 'c' } }],
    options: OPTIONS,
}).valid, 'but an arbitrary property inside a reference is still rejected');

/* ------------------------------------------------------------------- check ---------------- */

ok(omcMapping.check({ mapping: MAPPING, options: OPTIONS }).valid,
    'check passes a sound mapping');

const problems = (m) => omcMapping.check({ mapping: m, options: OPTIONS }).problems.map((p) => p.kind);

ok(problems([{ id: 'x', entityType: 'Nonsense', key: 'k' }]).includes('unknownEntityType'),
    'check rejects an unknown entity type');
ok(problems([{ id: 'x', entityType: 'Asset', key: 'k', properties: { nope: 'c' } }]).includes('unknownProperty'),
    'check rejects a property the schema does not have');
ok(problems([{ id: 'x', entityType: 'Asset', properties: { label: 'c' } }]).includes('missingKey'),
    'check requires a key column');
ok(problems([{ entityType: 'Asset', key: 'k' }]).includes('missingEntryId'),
    'check requires every entry to have an id');
ok(problems([
    { id: 'same', entityType: 'Asset', key: 'k' }, { id: 'same', entityType: 'Slate', key: 'k' },
]).includes('duplicateEntryId'),
'check rejects two entries sharing an id');
ok(problems([
    { id: 'a', entityType: 'Asset', key: 'k', edges: [{ to: 'missing', via: 'k' }] },
]).includes('unknownEdgeTarget'),
'check rejects an edge naming no entry');
ok(problems([
    { id: 'a', entityType: 'Asset', key: 'k', edges: [{ via: 'k' }] },
]).includes('unknownEdgeTarget'),
'check rejects an edge naming no target at all');
ok(!problems([
    { id: 'a', entityType: 'Asset', key: 'k' }, { id: 'b', entityType: 'Asset', key: 'j' },
]).length, 'check accepts two entries of one type');
const offList = omcMapping.check({
    mapping: [{
        id: 'x', entityType: 'AssetStructure', key: 'k', properties: { assetStructureType: { const: 'nope' } },
    }],
    options: OPTIONS,
});
ok(offList.valid && offList.warnings.map((w) => w.kind).includes('valueNotSuggested'),
    'check accepts a const outside a controlled value list, with a warning');
ok(problems([{
    id: 'x',
    entityType: 'AssetStructure',
    key: 'k',
    properties: { 'assetStructureProperties.coordinateOrientation.handedness': { const: 'middle' } },
}]).includes('valueNotAllowed'),
'check rejects a const outside an enum');
ok(omcMapping.check({
    mapping: [{
        id: 'x',
        entityType: 'AssetStructure',
        key: 'k',
        properties: { 'assetStructureProperties.coordinateOrientation.handedness': { const: 'left' } },
    }],
    options: OPTIONS,
}).valid, 'check accepts a const inside an enum');
{
    // A slate row names its scene by a column the scene is not keyed on, so the scene is built by
    // another row and the slate's edge reaches a stub. The run writes the inverse onto the scene.
    const mapping = (inverse) => [
        { id: 'scene', entityType: 'ProductionScene', key: 'scene' },
        {
            id: 'slate', entityType: 'Slate', key: 'slate', edges: [{ to: 'scene', via: 'sceneRef', ...(inverse === false && { inverse }) }],
        },
    ];
    const built = (inverse) => {
        const oneRun = omcMapping.createRun({ mapping: mapping(inverse), options: OPTIONS });
        oneRun.add({ scene: '1-1' });
        oneRun.add({ slate: 's1', sceneRef: '1-1' });
        const { entities } = oneRun.result();
        return {
            scene: entities.find((e) => e.entityType === 'ProductionScene'),
            slate: entities.find((e) => e.entityType === 'Slate'),
        };
    };
    const refersTo = (from, to) => JSON.stringify(from.edges ?? {}).includes(to.identifier[0].identifierValue);
    const { scene, slate } = built();
    ok(refersTo(slate, scene), 'the forward edge reaches an entity another row built');
    ok(refersTo(scene, slate), 'the inverse is written onto it by default');
    const off = built(false);
    ok(!refersTo(off.scene, off.slate), 'inverse: false writes the forward edge alone');
}
ok(problems([
    { id: 'slate', entityType: 'Slate', key: 'k', edges: [{ toType: 'AssetStructure', via: 'k' }] },
]).includes('edgeNotAllowed'),
'check validates a toType reference against the schema like any other edge');

/* --------------------------------------------------------------- checkColumns ------------- */

const cols = omcMapping.checkColumns({ mapping: MAPPING, columns: Object.keys(ROW) });
ok(cols.valid, 'checkColumns passes when every named column is present');

const short = omcMapping.checkColumns({ mapping: MAPPING, columns: ['File Name'] });
ok(!short.valid && short.missing.includes('Audio Sample Rate'),
    'checkColumns names the columns a mapping expects but the data lacks');

/* ------------------------------------------------------------------ templates ------------- */

{
    const take = { template: 'scene-{Scene}-slate-{Slate}' };
    const mapping = [
        { id: 'structure', entityType: 'AssetStructure', key: take, properties: { label: { template: '{{{Slate}}} of {Scene}' } } },
        { id: 'asset', entityType: 'Asset', key: 'File Name', edges: [{ to: 'structure', via: take }] },
    ];
    const templated = omcMapping.mapRow({ row: ROW, mapping, options: OPTIONS });
    const { structure, asset } = templated.entities;
    ok(structure?.label === '{16K} of 16', 'a templated property fills its columns, and {{ }} write braces');

    const byColumn = omcMapping.mapRow({
        row: { ...ROW, k: 'scene-16-slate-16K' },
        mapping: [{ id: 'structure', entityType: 'AssetStructure', key: 'k' }],
        options: OPTIONS,
    }).entities.structure;
    ok(JSON.stringify(structure.identifier) === JSON.stringify(byColumn.identifier),
        'a templated key seeds the identifier its text would as a column');
    ok(JSON.stringify(asset.AssetStructure?.[0]?.identifier) === JSON.stringify(structure.identifier),
        'an edge whose via is the target\'s key template references the entity it built');

    const gap = omcMapping.mapRow({ row: { ...ROW, Slate: '' }, mapping, options: OPTIONS });
    ok(!gap.entities.structure && gap.notes.some((n) => n.kind === 'noKeyValue' && n.detail.includes('template')),
        'a templated key with an empty column builds nothing, and says which template');
    ok(!gap.entities.asset?.AssetStructure, 'nor does an edge through it reference anything');

    const noLabel = omcMapping.mapRow({
        row: { ...ROW, Scene: '' },
        mapping: [{ id: 'asset', entityType: 'Asset', key: 'File Name', properties: { label: { template: 'Scene {Scene}' } } }],
        options: OPTIONS,
    }).entities.asset;
    ok(noLabel && noLabel.label === undefined, 'a templated property with an empty column is not written');

    const templateCols = omcMapping.checkColumns({ mapping, columns: ['File Name', 'Scene'] });
    ok(!templateCols.valid && templateCols.missing.includes('Slate'), 'checkColumns names a column a template uses but the data lacks');
    ok(omcMapping.check({ mapping, options: OPTIONS }).valid, 'a templated key counts as a key');
    ok(JSON.stringify(omcMapping.sourceColumns(take)) === '["Scene","Slate"]', 'sourceColumns lists a template\'s columns');
}

/* ------------------------------------------------------------------------------------------ */

console.log();
if (failures) {
    console.error(`omcMapping: ${failures} failure(s)`);
    process.exit(1);
}
console.log('omcMapping: all checks passed');
