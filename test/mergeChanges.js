/**
 * Guard: "does this record carry new information?" is a merge question, not a diff question.
 *
 * A structural diff is symmetric — it reports a property the other side is *missing* as readily as
 * one it supplies — so a record that is a strict subset of what is already held reads as different
 * while contributing nothing. Consumers counting "records worth merging" off such a diff count
 * every record. mergeChanges answers with merge semantics instead: merge never removes, so the only
 * possible outcomes are a value gained and a value disagreed with.
 *
 * This pins that asymmetry, the OMC conventions that come with delegating to the merge (keyed
 * identifier arrays, relationship arrays keyed on the referenced entity, key order irrelevant), the
 * soundness holes omcCompare has which must not be inherited, and the two guards: identities that
 * disagree reject the whole merge, and empty containers say nothing.
 *
 *   Usage: node test/mergeChanges.js
 */

import { mergeChanges, mergeEntity, pathRoot } from '../src/omc/omcMerge.js';
import { omcTemplate } from '../src/templates/index.js';

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

/** Order-independent deep equality, so key order never decides a test. */
const norm = ((v) => {
    if (v === null || v === undefined || typeof v !== 'object') return JSON.stringify(v) ?? 'undefined';
    if (Array.isArray(v)) return `[${v.map(norm).join(',')}]`;
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${norm(v[k])}`).join(',')}}`;
});
const same = ((a, b) => norm(a) === norm(b));
/** Collapse empty containers to null, so `emptyAsNull` normalisation is not read as a difference. */
const flat = ((v) => {
    if (v === null || v === undefined) return null;
    if (Array.isArray(v)) return v.length ? v.map(flat) : null;
    if (typeof v !== 'object') return v;
    const keys = Object.keys(v);
    if (!keys.length) return null;
    return keys.reduce((acc, k) => ({ ...acc, [k]: flat(v[k]) }), {});
});
const equivalent = ((a, b) => norm(flat(a)) === norm(flat(b)));
const sorted = ((a) => [...a].sort());
const isPlain = ((v) => v !== null && typeof v === 'object' && !Array.isArray(v));
const threw = ((fn) => {
    try {
        fn();
        return null;
    } catch (err) {
        return err;
    }
});

const asset = ((props) => ({
    schemaVersion, entityType: 'Asset', identifier: [assetId], ...props,
}));
const bare = ((id) => ({ identifier: [id] }));
const full = ((id) => ({
    entityType: 'AssetStructure', schemaVersion, identifier: [id], assetStructureType: 'digital.structuredDocument',
}));

// Every pair exercised below, so the two invariants at the end can be asserted over all of them
// rather than restated case by case.
const fixtures = [];
const changes = ((existing, incoming, options) => {
    fixtures.push({ existing, incoming, options });
    return mergeChanges(existing, incoming, options);
});

console.log('=== pathRoot: the property a reported path belongs to ===');
{
    check('a plain property', pathRoot('label') === 'label');
    check('an index into a keyed array', pathRoot('identifier[0].url') === 'identifier');
    check('a deep dotted path', pathRoot('edges.has.Scene[1]') === 'edges');
    check('an array index at the root', pathRoot('AssetStructure[0].assetStructureType') === 'AssetStructure');
    check('an empty path', pathRoot('') === '');
    // Every path the module reports must resolve to a property that exists on one of the two sides,
    // or a consumer grouping by property silently invents a control for nothing.
    const r = mergeChanges(
        { schemaVersion, entityType: 'Asset', identifier: [assetId], AssetStructure: [bare(A)] },
        {
            schemaVersion,
            entityType: 'Asset',
            identifier: [{ ...assetId, url: 'https://x/1' }],
            AssetStructure: [full(A)],
            label: 'Script',
        },
    );
    const roots = [...r.added, ...r.updated].map(pathRoot);
    check('every reported path roots to a real property',
        roots.length > 0 && roots.every((k) => k === 'identifier' || k === 'AssetStructure' || k === 'label'),
        JSON.stringify({ added: r.added, updated: r.updated }));
}

console.log('=== a subset carries nothing (the case a symmetric diff gets wrong) ===');
{
    const project = asset({ label: 'Script', name: 'script.pdf', customData: [{ domain: 'yamdu', size: 12 }] });
    const staging = asset({ label: 'Script' });
    const r = changes(project, staging);
    check('strict subset reports no change', r.changed === false && !r.added.length && !r.updated.length,
        JSON.stringify({ added: r.added, updated: r.updated }));
    check('identical entities report no change', changes(project, { ...project }).changed === false);
}

console.log('=== added vs updated ===');
{
    const project = asset({ label: 'Script' });
    const added = changes(project, asset({ label: 'Script', name: 'script.pdf' }));
    check('a property project lacks is added', same(added.added, ['name']) && !added.updated.length,
        JSON.stringify(added));

    const conflict = asset({ label: 'Shooting script' });
    const u = changes(project, conflict);
    check('a disagreeing value is an update', same(u.updated, ['label']) && !u.added.length, JSON.stringify(u));
    check('prefer incoming → a disagreement changes project', u.changed === true);
    check('prefer existing → a disagreement does not', changes(project, conflict, { prefer: 'existing' }).changed === false);
    check('prefer existing → an addition still does', changes(project, asset({ label: 'Script', name: 'x' }), { prefer: 'existing' }).changed === true);
    check('prefer existing keeps the project value', changes(project, conflict, { prefer: 'existing' }).merged.label === 'Script');
    check('prefer incoming takes the staging value', u.merged.label === 'Shooting script');
}

console.log('=== the holes a truthiness-gated diff has, which must not be inherited ===');
{
    const flip = changes(asset({ approved: true }), asset({ approved: false }));
    check('a boolean flip is reported', same(flip.updated, ['approved']), JSON.stringify(flip));
    check('a number → 0 is reported', same(changes(asset({ take: 3 }), asset({ take: 0 })).updated, ['take']));
    check('a string → empty string is reported', same(changes(asset({ label: 'x' }), asset({ label: '' })).updated, ['label']));
    check('false → true is reported', same(changes(asset({ approved: false }), asset({ approved: true })).updated, ['approved']));
}

console.log('=== null, and clearing a value ===');
{
    check('a gap filled from null is an addition',
        same(changes(asset({ label: null }), asset({ label: 'Script' })).added, ['label']));
    check('incoming null leaves it alone', changes(asset({ label: 'Script' }), asset({ label: null })).changed === false);
    const cleared = changes(asset({ label: 'Script' }), asset({ label: null }), { nullOverwrite: true });
    check('nullOverwrite clearing a value is a change', cleared.changed === true && same(cleared.updated, ['label']),
        JSON.stringify(cleared));
}

console.log('=== a type conflict still rejects ===');
{
    const err = threw(() => mergeChanges(asset({ note: 'text' }), asset({ note: { body: 'text' } })));
    check('primitive vs object throws', err instanceof TypeError, String(err));
}

console.log('=== key order is not a difference ===');
{
    const project = asset({ fileDetails: { fileName: 'a.pdf', fileExtension: 'pdf' } });
    const staging = asset({ fileDetails: { fileExtension: 'pdf', fileName: 'a.pdf' } });
    check('nested key order ignored', changes(project, staging).changed === false);
}

console.log('=== objects in an array merge on what they both claim ===');
{
    // The rule: every property present and non-null in BOTH must agree, and at least one must be.
    const titles = ((...t) => asset({ creativeWorkTitle: t }));

    const filled = changes(titles({ titleName: 'Europa', titleType: null }),
        titles({ titleName: 'Europa', titleType: 'working' }));
    check('a null property is filled from the side that knows',
        same(filled.merged.creativeWorkTitle, [{ titleName: 'Europa', titleType: 'working' }]),
        JSON.stringify(filled.merged.creativeWorkTitle));

    const absent = changes(titles({ titleName: 'Europa' }),
        titles({ titleName: 'Europa', titleType: 'working' }));
    check('an absent property is filled the same way',
        same(absent.merged.creativeWorkTitle, [{ titleName: 'Europa', titleType: 'working' }]),
        JSON.stringify(absent.merged.creativeWorkTitle));

    const disagree = changes(titles({ titleName: 'Europa', titleType: 'working' }),
        titles({ titleName: 'Europa', titleType: 'release' }));
    check('a shared property they disagree on keeps them apart',
        disagree.merged.creativeWorkTitle.length === 2, JSON.stringify(disagree.merged.creativeWorkTitle));

    const disjoint = changes(titles({ titleName: 'Europa' }), titles({ titleType: 'working' }));
    check('no shared property means no match — they do not collapse',
        disjoint.merged.creativeWorkTitle.length === 2, JSON.stringify(disjoint.merged.creativeWorkTitle));

    // Direction: a property both sides hold a value for is a conflict like any other.
    const conflict = { prefer: 'existing' };
    const held = changes(titles({ titleName: 'Europa', titleType: 'working' }),
        titles({ titleName: 'Europa', titleType: 'working', note: 'x' }), conflict);
    check('prefer existing still takes a property only the incoming side has',
        held.merged.creativeWorkTitle[0].note === 'x', JSON.stringify(held.merged.creativeWorkTitle));

    // Several existing entries can satisfy the rule; the first is chosen, deterministically.
    const ambiguous = changes(
        titles({ titleName: 'Europa', titleType: 'working' }, { titleName: 'Europa', titleType: 'release' }),
        titles({ titleName: 'Europa' }),
    );
    check('an ambiguous incoming item merges into the first match only',
        ambiguous.merged.creativeWorkTitle.length === 2, JSON.stringify(ambiguous.merged.creativeWorkTitle));

    check('primitive arrays still match on exact value',
        same(changes(asset({ tags: ['a', 'b'] }), asset({ tags: ['b', 'c'] })).merged.tags, ['a', 'b', 'c']));
}

console.log('=== identifier arrays are keyed, not compared whole ===');
{
    const two = ((...ids) => ({ schemaVersion, entityType: 'Asset', identifier: ids }));
    check('a repeated identifier adds nothing', changes(two(assetId), two(assetId)).changed === false);
    const gained = changes(two(assetId), two(assetId, sid('ast-other')));
    check('a new identifier is added', same(gained.added, ['identifier[1]']), JSON.stringify(gained));
    const url = changes(two(assetId), two({ ...assetId, url: 'https://x/1' }));
    check('an identifier gaining a url enriches it', same(url.added, ['identifier[0].url']), JSON.stringify(url));
    check('the merged identifier keeps both fields', url.merged.identifier.length === 1 && url.merged.identifier[0].url === 'https://x/1');
    const dropped = changes(two({ ...assetId, url: 'https://x/1' }), two(assetId));
    check('an identifier LOSING a url carries nothing', dropped.changed === false, JSON.stringify(dropped));
}

console.log('=== relationship arrays are keyed on the referenced entity ===');
{
    // No schemaVersion is passed in options — mergeEntity must read it off the entities, or these
    // fall back to structural comparison and every representation difference reads as new data.
    check('expanded project vs bare staging carries nothing',
        changes(asset({ AssetStructure: [full(A)] }), asset({ AssetStructure: [bare(A)] })).changed === false);
    const richer = changes(asset({ AssetStructure: [bare(A)] }), asset({ AssetStructure: [full(A)] }));
    check('bare project vs expanded staging gains the detail',
        richer.added.includes('AssetStructure[0].assetStructureType'), JSON.stringify(richer));
    const other = changes(asset({ AssetStructure: [bare(A)] }), asset({ AssetStructure: [bare(B)] }));
    check('a different referenced entity is a new edge', same(other.added, ['AssetStructure[1]']), JSON.stringify(other));
}

console.log('=== empty is null: absent, [], {} and null all say nothing ===');
{
    check('project {} vs staging absent', changes(asset({ edges: {} }), asset({})).changed === false);
    const gainedEmpty = changes(asset({}), asset({ edges: {} }));
    check('project absent vs staging {} adds nothing', gainedEmpty.changed === false, JSON.stringify(gainedEmpty));
    check('and does not invent the key', !('edges' in gainedEmpty.merged), JSON.stringify(gainedEmpty.merged));
    check('an empty container project holds is normalised to null',
        changes(asset({ edges: {} }), asset({})).merged.edges === null);
    const populated = changes(asset({ customData: [] }), asset({ customData: [{ domain: 'yamdu' }] }));
    check('an empty array never wins over a populated one', same(populated.added, ['customData[0]']), JSON.stringify(populated));
    check('and the populated value survives', populated.merged.customData.length === 1);
    check('project [] vs staging [ref]', same(changes(asset({ AssetStructure: [] }), asset({ AssetStructure: [bare(A)] })).added, ['AssetStructure[0]']));
    check('[] against {} is not a type conflict', changes(asset({ edges: [] }), asset({ edges: {} })).changed === false);
    const strict = threw(() => mergeChanges(asset({ edges: [] }), asset({ edges: { has: 1 } }), { emptyAsNull: false }));
    check('with emptyAsNull off, [] vs {} still throws', strict instanceof TypeError, String(strict));
}

console.log('=== exclude keeps a property out of the merge and out of the report ===');
{
    const v28 = 'https://movielabs.com/omc/json/schema/v2.8';
    check('schemaVersion alone is not new information by default',
        changes({ entityType: 'Asset', schemaVersion, label: 'a' }, { entityType: 'Asset', label: 'a' }).changed === false);
    const seen = changes({ entityType: 'Asset', schemaVersion, label: 'a' }, { entityType: 'Asset', label: 'a' }, { exclude: [] });
    check('with exclude: [] the absent schemaVersion is still nothing', seen.changed === false, JSON.stringify(seen));

    const project = asset({ label: 'Script', note: 'keep me' });
    const staging = asset({ label: 'Script', note: 'overwrite me', name: 'script.pdf' });
    const excluded = changes(project, staging, { exclude: [...omcTemplate.recordKeys(), 'note'] });
    check('an excluded key is not reported', same(excluded.updated, []) && same(excluded.added, ['name']), JSON.stringify(excluded));
    check('an excluded key is not merged', excluded.merged.note === 'keep me');
    check('a nested entityType is still merged and reported',
        changes(asset({ AssetStructure: [bare(A)] }), asset({ AssetStructure: [full(A)] })).added.includes('AssetStructure[0].entityType'));

    // The identity guard must run before the exclusion, or excluding a key switches off the check.
    const stillRejected = changes({ entityType: 'Asset', schemaVersion, label: 'a' },
        { entityType: 'Asset', schemaVersion: v28, label: 'a' }, { exclude: ['schemaVersion', 'entityType'] });
    check('an excluded schemaVersion mismatch is still rejected', stillRejected.status === 'incompatible',
        JSON.stringify(stillRejected));
}

console.log('=== arrays append, and the existing prefix does not move ===');
{
    const appended = changes(asset({ tags: ['a', 'b'] }), asset({ tags: ['b', 'c'] }));
    check('one appended item, reported once', same(appended.added, ['tags[2]']), JSON.stringify(appended));
    const invariant = fixtures.every(({ existing, incoming, options }) => {
        const merged = mergeChanges(existing, incoming, options)?.merged;
        if (!merged) return true;
        return Object.keys(existing).every((k) => {
            if (!Array.isArray(existing[k]) || !Array.isArray(merged[k])) return true;
            if (merged[k].length < existing[k].length) return true; // keyed collapse, reported wholesale
            // The item at index i must still be the SAME THING as the existing item that was
            // there. Its values may legitimately have changed — a matched array object takes the
            // incoming side's value on a property they both hold — so this pins identity, not
            // immutability. That is what collectArrayDelta's index-wise walk actually relies on.
            return existing[k].every((item, i) => {
                const after = merged[k][i];
                if (!isPlain(item) || !isPlain(after)) return equivalent(item, after);
                // Mirrors sameArrayObject: every property both hold a value for must agree.
                return Object.keys(item).every((f) => (
                    item[f] == null || after[f] == null || equivalent(item[f], after[f])
                ));
            });
        });
    });
    check('every fixture keeps its existing items in their existing positions', invariant);
}

console.log('=== identities that disagree reject the whole merge ===');
{
    const v28 = 'https://movielabs.com/omc/json/schema/v2.8';
    const typeMismatch = changes(asset({}), { schemaVersion, entityType: 'AssetStructure', identifier: [assetId] });
    check('differing entityType is incompatible', typeMismatch.status === 'incompatible' && typeMismatch.merged === false
        && typeMismatch.changed === false, JSON.stringify(typeMismatch));
    const versionMismatch = changes(asset({}), { ...asset({}), schemaVersion: v28 });
    check('differing schemaVersion is incompatible', versionMismatch.status === 'incompatible'
        && versionMismatch.merged === false, JSON.stringify(versionMismatch));

    const nestedType = threw(() => mergeChanges(
        asset({ AssetStructure: [full(A)] }),
        asset({ AssetStructure: [{ ...bare(A), entityType: 'Asset' }] }),
    ));
    check('a nested entityType mismatch throws', nestedType instanceof TypeError, String(nestedType));
    const nestedVersion = threw(() => mergeChanges(
        asset({ AssetStructure: [full(A)] }),
        asset({ AssetStructure: [{ ...bare(A), schemaVersion: v28 }] }),
    ));
    check('a nested schemaVersion mismatch throws', nestedVersion instanceof TypeError, String(nestedVersion));

    // The rule is "both declare and disagree" — declared on one side only is the bare-reference
    // case the whole reference merge exists for, and must keep working.
    check('declared on one side only still collapses to one edge',
        mergeEntity(asset({ AssetStructure: [bare(A)] }), asset({ AssetStructure: [full(A)] })).AssetStructure.length === 1);
}

console.log('=== guards ===');
{
    const ent = asset({ label: 'Script' });
    const fromNothing = mergeChanges(null, ent);
    check('no existing entity → everything is new',
        fromNothing.changed === true && same(sorted(fromNothing.added), sorted(['identifier', 'label'])),
        JSON.stringify(fromNothing));
    check('no existing entity → record keys are not contributions', !fromNothing.added.includes('schemaVersion'));
    check('no incoming entity → nothing changes',
        mergeChanges(ent, null).changed === false && mergeChanges(ent, null).status === 'merged');
    check('an empty incoming entity → nothing changes',
        mergeChanges(ent, {}).changed === false && mergeChanges(ent, {}).status === 'merged',
        JSON.stringify(mergeChanges(ent, {})));
    check('neither entity → no-entity', mergeChanges(null, null).status === 'no-entity');
}

console.log('=== invariants over every fixture above ===');
{
    const opts = ((options) => ({ prefer: 'incoming', exclude: omcTemplate.recordKeys(), emptyAsNull: true, ...options }));
    const offender = fixtures.find(({ existing, incoming, options }) => {
        const r = mergeChanges(existing, incoming, options);
        return r.status === 'merged' && !r.changed && !equivalent(r.merged, existing);
    });
    check('changed === false ⟺ the merge would leave the entity as it is', !offender,
        offender && `\n      existing: ${norm(flat(offender.existing))}\n      merged:   ${norm(flat(mergeChanges(offender.existing, offender.incoming, offender.options).merged))}`);

    const delegates = fixtures.every(({ existing, incoming, options }) => {
        if (!existing || !incoming || !Object.keys(existing).length || !Object.keys(incoming).length) return true;
        const r = mergeChanges(existing, incoming, options);
        if (r.status !== 'merged') return true;
        return same(r.merged, mergeEntity(existing, incoming, opts(options)));
    });
    check('merged is exactly what mergeEntity produces for the same options', delegates);
}

console.log(failures ? `\nmergeChanges: ${failures} FAILED` : '\nmergeChanges: OK');
if (failures) process.exit(1);
