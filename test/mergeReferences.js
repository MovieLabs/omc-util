/**
 * Guard: relationship arrays merge on the referenced identifier, not on object shape.
 *
 * OMC lets the same edge be written several ways — a bare `{ identifier: [...] }` reference, a
 * reference carrying `entityType`, or the whole nested entity (`items.anyOf: [reference, <Entity>]`).
 * Merging two entities that express one edge differently must yield ONE edge. Comparing array items
 * structurally cannot see that, so it kept both, which overflows capped relationships — notably
 * `Asset.AssetStructure` (`maxItems: 1`) — and the merged entity then fails validation.
 *
 * This also pins the things that must NOT change: identifier arrays still union, plain arrays keep
 * their structural semantics, genuinely different references are both preserved, and merging
 * without a schemaVersion degrades rather than throws.
 *
 *   Usage: node test/mergeReferences.js
 */

import { mergeEntity } from '../src/omc/omcMerge.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';
const scope = 'movielabs.com/omc/europa';
const sid = ((v) => ({ identifierScope: scope, identifierValue: v }));
const A = sid('asts-aaaa');
const B = sid('asts-bbbb');
const assetId = sid('ast-9e10');

let failures = 0;
const pass = ((msg) => console.log(`  ✓ ${msg}`));
const fail = ((msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
});
const check = ((label, cond, detail = '') => (cond ? pass(label) : fail(`${label}   ${detail}`)));

const asset = ((structures) => ({
    schemaVersion, entityType: 'Asset', identifier: [assetId], AssetStructure: structures,
}));
const bare = ((id) => ({ identifier: [id] }));
const full = ((id) => ({
    entityType: 'AssetStructure', schemaVersion, identifier: [id], assetStructureType: 'digital.structuredDocument',
}));

console.log('=== one referenced entity collapses to one edge, in any representation ===');
[
    ['identical bare references', bare(A), bare(A)],
    ['bare reference vs expanded entity', bare(A), full(A)],
    ['expanded entity vs bare reference', full(A), bare(A)],
].forEach(([label, a, b]) => {
    const merged = mergeEntity(asset([a]), asset([b]));
    check(label, merged.AssetStructure.length === 1, JSON.stringify(merged.AssetStructure));
});

console.log('=== the richer representation survives ===');
const richA = mergeEntity(asset([bare(A)]), asset([full(A)])).AssetStructure[0];
check('bare + expanded keeps assetStructureType',
    richA.assetStructureType === 'digital.structuredDocument', JSON.stringify(richA));
const richB = mergeEntity(asset([full(A)]), asset([bare(A)])).AssetStructure[0];
check('expanded + bare keeps assetStructureType',
    richB.assetStructureType === 'digital.structuredDocument', JSON.stringify(richB));

console.log('=== distinct references are preserved ===');
// Two different AssetStructures in a maxItems:1 property is a real conflict for validation to
// report; merge must not hide it by discarding one.
const two = mergeEntity(asset([bare(A)]), asset([bare(B)])).AssetStructure;
check('different identifiers both kept', two.length === 2, JSON.stringify(two));

console.log('=== identifier sets match on intersection ===');
const inter = mergeEntity(asset([{ identifier: [A] }]), asset([{ identifier: [A, B] }])).AssetStructure;
check('intersecting identifier sets collapse', inter.length === 1, JSON.stringify(inter));

console.log('=== unidentified references fall back to structural comparison ===');
const same = mergeEntity(asset([{ note: 'x' }]), asset([{ note: 'x' }])).AssetStructure;
check('identical unidentified references collapse', same.length === 1, JSON.stringify(same));
const diff = mergeEntity(asset([{ note: 'x' }]), asset([{ note: 'y' }])).AssetStructure;
check('differing unidentified references both kept', diff.length === 2, JSON.stringify(diff));

console.log('=== unchanged: identifier arrays ===');
const base = ((ids) => ({ schemaVersion, entityType: 'Asset', identifier: ids }));
check('identifier union',
    mergeEntity(base([assetId]), base([sid('other-1234')])).identifier.length === 2);
check('identifier de-duplication',
    mergeEntity(base([assetId]), base([assetId])).identifier.length === 1);

console.log('=== unchanged: plain arrays keep structural semantics ===');
const plain = mergeEntity(
    { schemaVersion, entityType: 'Asset', identifier: [assetId], someList: ['a', 'b'] },
    { schemaVersion, entityType: 'Asset', identifier: [assetId], someList: ['b', 'c'] },
).someList;
check('scalar array union', JSON.stringify(plain) === JSON.stringify(['a', 'b', 'c']), JSON.stringify(plain));

console.log('=== no schemaVersion degrades, does not throw ===');
const noSv = mergeEntity(
    { entityType: 'Asset', AssetStructure: [bare(A)] },
    { entityType: 'Asset', AssetStructure: [full(A)] },
);
check('still returns a merged entity', !!noSv && Array.isArray(noSv.AssetStructure), JSON.stringify(noSv));

if (failures) {
    console.error(`\nmergeReferences: ${failures} problem(s)`);
    process.exit(1);
}
console.log('\nmergeReferences: OK');
