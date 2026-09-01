/**
 * Guard: every shape omcValidate accepts must reach an answer, and the same answer.
 *
 * The function takes OMC three ways — a bare entity, an array of entities, and a map of entity type
 * to array — and reduces all three to one boolean when `atomic` is set. The bare entity is the one
 * that produces a single result rather than a collection of them, so it is the shape the reducer
 * can forget; forgetting it read `.valid` off a null and threw, which is a crash rather than a
 * verdict and looks nothing like "this entity is invalid".
 *
 * This pins that every shape answers, that the bare entity and the single-element array agree on
 * what is valid, and that an entity type happening to be called `valid` is still read as the array
 * it holds.
 *
 *   Usage: node test/omcValidate.js
 */

import omcValidate from '../src/omc/validation/omcValidate.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';
const scope = 'movielabs.com/omc/europa';

let failures = 0;
const pass = ((msg) => console.log(`  ✓ ${msg}`));
const fail = ((msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
});
const check = ((label, cond, detail = '') => (cond ? pass(label) : fail(`${label}   ${detail}`)));

/** Runs `fn`, reporting a throw as a value so a crash is a failure rather than a stopped run. */
const attempt = ((fn) => {
    try {
        return { value: fn() };
    } catch (e) {
        return { threw: e.message };
    }
});

const entity = {
    entityType: 'Asset',
    schemaVersion,
    identifier: [{ identifierScope: scope, identifierValue: 'ast-9e10' }],
};

// ---- every shape answers, rather than throwing ----

const shapes = {
    'a bare entity': entity,
    'an array of entities': [entity],
    'a map of entity type to array': { Asset: [entity] },
};

Object.entries(shapes).forEach(([what, omc]) => {
    const atomic = attempt(() => omcValidate(omc));
    check(`${what} returns a verdict`, atomic.value === true, atomic.threw ?? `got ${JSON.stringify(atomic.value)}`);

    const detailed = attempt(() => omcValidate(omc, { atomic: false }));
    check(`${what} returns detail when atomic is off`, !detailed.threw && detailed.value !== undefined, detailed.threw ?? '');
});

// ---- a bare entity and a single-element array must agree ----

const cases = {
    'a well formed entity': [entity, true],
    'an entity type the schema does not know': [{ ...entity, entityType: 'Nonsense' }, false],
    'an entity with no identifier': [{ entityType: 'Asset', schemaVersion }, false],
    'an identifier that is not an array': [{ ...entity, identifier: 'ast-9e10' }, false],
    'an identifier missing its scope': [{ ...entity, identifier: [{ identifierValue: 'ast-9e10' }] }, false],
    // v3.0 sets unevaluatedProperties: false, so an ad-hoc property is a schema error rather than
    // something carried along. customData is the schema's own provision for it.
    'an ad-hoc property': [{ ...entity, notASchemaProperty: 'x' }, false],
    // Person is a v2.8 entity type; the v3.0 template set does not import it.
    'a v2.8 entity type under v3.0': [{ ...entity, entityType: 'Person' }, false],
    'a schema version nothing bundles': [{ ...entity, schemaVersion: 'https://movielabs.com/omc/json/schema/v9.9' }, false],
};

Object.entries(cases).forEach(([what, [omc, wanted]]) => {
    const single = attempt(() => omcValidate(omc));
    const array = attempt(() => omcValidate([omc]));

    check(
        `${what}: bare entity says ${wanted}`,
        single.value === wanted,
        single.threw ?? `got ${JSON.stringify(single.value)}`,
    );
    check(
        `${what}: the two shapes agree`,
        !single.threw && !array.threw && single.value === array.value,
        single.threw ?? array.threw ?? `bare=${single.value} array=${array.value}`,
    );
});

// ---- an entity type is not a result, whatever it is called ----

{
    const named = attempt(() => omcValidate({ valid: [entity] }));
    check(
        'an entity type called `valid` is read as the array it holds',
        named.value === true,
        named.threw ?? `got ${JSON.stringify(named.value)}`,
    );

    const invalid = attempt(() => omcValidate({ valid: [{ ...entity, entityType: 'Nonsense' }] }));
    check(
        'and its contents are still validated',
        invalid.value === false,
        invalid.threw ?? `got ${JSON.stringify(invalid.value)}`,
    );
}

// ---- one bad entity fails the batch, in every shape that holds several ----

{
    const bad = { ...entity, entityType: 'Nonsense' };
    check('an array containing one invalid entity fails', omcValidate([entity, bad]) === false);
    check('a map containing one invalid entity fails', omcValidate({ Asset: [entity, bad] }) === false);
    check(
        'a map fails when the invalid entity is under a second type',
        omcValidate({ Asset: [entity], Other: [bad] }) === false,
    );
}

// ---- mixed schema versions, which share a compiled validator per document ----

{
    const v28 = { ...entity, schemaVersion: 'https://movielabs.com/omc/json/schema/v2.8' };
    const mixed = attempt(() => omcValidate([entity, v28]));
    check('entities of two schema versions validate together', mixed.value === true, mixed.threw ?? `got ${mixed.value}`);
}

console.log(failures ? `\nomcValidate: ${failures} FAILED` : '\nomcValidate: OK');
if (failures) process.exit(1);
