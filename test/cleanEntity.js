/**
 * Guard: one spelling for "nothing is here".
 *
 * OMC arrives from spreadsheets, form fields, GraphQL responses and hand-edited JSON, and each says
 * absence differently — `''`, `[]`, `{}`, an object of nulls, or a missing property. Left alone,
 * those differences are indistinguishable from content: an empty string merges over a real value,
 * an empty array reads as an answer, and two entities holding the same information compare as
 * different. `cleanEntity` reduces all of them to null.
 *
 * The cases that matter most here are the ones a truthiness test gets wrong — `0` and `false` are
 * values and must survive — and the recursion, since emptiness found deep in a structure has to
 * propagate outward rather than leave a husk behind.
 *
 *   Usage: node test/cleanEntity.js
 */

import { cleanEntity } from '../src/omc/omcTransform.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';
const base = {
    schemaVersion,
    entityType: 'CreativeWork',
    identifier: [{ identifierScope: 'x', identifierValue: 'cw-1' }],
};

let failures = 0;
const pass = ((msg) => console.log(`  ✓ ${msg}`));
const fail = ((msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
});
const check = ((label, cond, detail = '') => (cond ? pass(label) : fail(`${label}   ${detail}`)));

const norm = ((v) => {
    if (v === null || v === undefined || typeof v !== 'object') return JSON.stringify(v) ?? 'undefined';
    if (Array.isArray(v)) return `[${v.map(norm).join(',')}]`;
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${norm(v[k])}`).join(',')}}`;
});
const same = ((a, b) => norm(a) === norm(b));

console.log('=== the spellings of nothing all become null ===');
{
    const r = cleanEntity({
        ...base, name: '', label: '   ', tag: [], edges: {}, customData: [{ domain: null }],
    });
    check('empty string', r.name === null);
    check('whitespace-only string', r.label === null);
    check('empty array', r.tag === null);
    check('empty object', r.edges === null);
    check('array of all-null objects', r.customData === null, JSON.stringify(r.customData));
    check('the key is kept, not deleted', 'name' in r && 'tag' in r);
}

console.log('=== values that are NOT nothing ===');
{
    const r = cleanEntity({
        ...base, take: 0, approved: false, label: 'Scene 4', spaced: ' Scene 4 ',
    });
    check('zero survives', r.take === 0);
    check('false survives', r.approved === false);
    check('a real string survives', r.label === 'Scene 4');
    check('a non-empty string is not trimmed', r.spaced === ' Scene 4 ', JSON.stringify(r.spaced));
    check('the entity itself is never collapsed', !!r && typeof r === 'object');
}

console.log('=== emptiness propagates outward, bottom-up ===');
{
    const r = cleanEntity({ ...base, creativeWorkTitle: [{ titleName: '', titleType: null }] });
    check('an item of only empties is dropped, leaving nothing',
        r.creativeWorkTitle === null, JSON.stringify(r.creativeWorkTitle));

    const kept = cleanEntity({
        ...base,
        creativeWorkTitle: [{ titleName: '', titleType: null }, { titleName: 'Europa' }],
    });
    check('a real sibling survives the drop',
        same(kept.creativeWorkTitle, [{ titleName: 'Europa' }]), JSON.stringify(kept.creativeWorkTitle));

    const deep = cleanEntity({ ...base, a: { b: { c: '' } } });
    check('nested all-empty collapses all the way up', deep.a === null, JSON.stringify(deep.a));

    const partial = cleanEntity({ ...base, a: { b: { c: '' }, d: 'x' } });
    check('a sibling with content stops the collapse',
        same(partial.a, { b: null, d: 'x' }), JSON.stringify(partial.a));
}

console.log('=== identifiers and other real content are untouched ===');
{
    const r = cleanEntity(base);
    check('identifier array survives', same(r.identifier, base.identifier));
    check('entityType survives', r.entityType === 'CreativeWork');
    check('schemaVersion survives', r.schemaVersion === schemaVersion);
    check('a clean entity is unchanged', same(r, base), JSON.stringify(r));
}

console.log('=== the input is never modified ===');
{
    const input = { ...base, name: '', creativeWorkTitle: [{ titleName: '' }] };
    const before = norm(input);
    cleanEntity(input);
    check('caller keeps its object intact', norm(input) === before);
    check('nested values are rebuilt, not shared',
        input.creativeWorkTitle.length === 1 && input.creativeWorkTitle[0].titleName === '');
}

console.log('=== guards ===');
{
    check('null in, null out', cleanEntity(null) === null);
    check('undefined in, undefined out', cleanEntity(undefined) === undefined);
    check('a non-object is returned as-is', cleanEntity('nope') === 'nope');
    check('an empty entity stays an object', same(cleanEntity({}), {}));
}

console.log(failures ? `\ncleanEntity: ${failures} FAILED` : '\ncleanEntity: OK');
if (failures) process.exit(1);
