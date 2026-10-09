/**
 * Checks for the value lists in the shape and for `omcTemplate.fields` / `versions`.
 *
 * The distinction that matters: a schema `enum` is the only values accepted (`$enum`), while
 * `x-controlledValues` are suggestions (`$controlledValues`). A form treats the two differently,
 * so the shape must never blur them.
 *
 *   Usage: node test/fields.js
 */

import { omcTemplate } from '../index.js';

const V3 = 'https://movielabs.com/omc/json/schema/v3.0';

let failures = 0;
const fail = (msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);
const ok = (condition, msg) => (condition ? pass(msg) : fail(msg));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---- the shape --------------------------------------------------------------
const structure = omcTemplate.shape({ schemaVersion: V3, entityType: 'AssetStructure' });
ok(same(structure.assetStructureProperties.coordinateOrientation.handedness.$enum, ['left', 'right']),
    'an enum reaches the shape as $enum');
ok(Array.isArray(structure.assetStructureType.$controlledValues) && !structure.assetStructureType.$enum,
    'x-controlledValues reach the shape as $controlledValues, not $enum');

let both = 0;
let enums = 0;
let suggested = 0;
const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.$enum) enums += 1;
    if (node.$controlledValues) suggested += 1;
    if (node.$enum && node.$controlledValues) both += 1;
    Object.entries(node).forEach(([key, child]) => {
        if (key === '$items' || !key.startsWith('$')) visit(child);
    });
};
omcTemplate.allEntityTypes({ schemaVersion: V3 })
    .forEach((entityType) => visit(omcTemplate.shape({ schemaVersion: V3, entityType })));
ok(enums > 0 && suggested > 0, `v3.0 shapes carry both kinds of list (${enums} enum, ${suggested} suggested)`);
ok(both === 0, 'no shape node carries both $enum and $controlledValues');

// ---- fields: edit -----------------------------------------------------------
const assetFields = omcTemplate.fields({ schemaVersion: V3, entityType: 'Asset' });
const at = (list, path) => list.find((f) => f.path === path);

const functionType = at(assetFields, 'assetFunction.assetFunctionType');
ok(functionType && functionType.isArray === false && functionType.suggestions?.includes('audio')
    && !functionType.enum, 'a controlled-value field carries suggestions, and no enum');
ok(!at(assetFields, 'entityType') && !at(assetFields, 'schemaVersion'),
    'entityType and schemaVersion are not editable fields');
ok(!assetFields.some((f) => f.segments.some((s) => s[0] === s[0].toUpperCase() && s[0] !== s[0].toLowerCase())),
    'relationships are not fields');

const scope = at(assetFields, 'identifier.identifierScope');
ok(scope && scope.required === true && same(scope.within.map((w) => w.path), ['identifier']),
    'a value inside an array of objects says which array it sits in');

const tagValue = at(assetFields, 'tag.value');
ok(tagValue && tagValue.isArray === true && tagValue.type === 'string'
    && same(tagValue.within.map((w) => w.path), ['tag']), 'a list of values is one field with isArray');

const handedness = at(
    omcTemplate.fields({ schemaVersion: V3, entityType: 'AssetStructure' }),
    'assetStructureProperties.coordinateOrientation.handedness',
);
ok(same(handedness?.enum, ['left', 'right']) && !handedness.suggestions, 'an enum field carries enum');

// ---- fields: filter ---------------------------------------------------------
const filterFields = omcTemplate.fields({ schemaVersion: V3, entityType: 'Asset', purpose: 'filter' });
const filterType = at(filterFields, 'assetFunction.assetFunctionType');
ok(filterType?.isArray === true && filterType.suggestions?.includes('audio'),
    'a filter takes isArray from the filter table and the value list from the shape');
ok(at(filterFields, 'identifier.identifierScope')?.isArray === false, 'a scalar filter is not a list');
ok(filterFields.length < assetFields.length, 'filter fields are the subset the query accepts');
ok(at(filterFields, 'assetFunction.category')?.type === 'string',
    'a filter path the shape does not know is kept, typed from the filter template');
ok(!at(omcTemplate.fields({ schemaVersion: V3, entityType: 'CaptureEvent', purpose: 'filter' }), 'entityType'),
    'entityType and schemaVersion are not filters');

// ---- unknowns and versions --------------------------------------------------
ok(same(omcTemplate.fields({ schemaVersion: 'nope', entityType: 'Asset' }), []), 'an unknown version has no fields');
ok(same(omcTemplate.fields({ schemaVersion: V3, entityType: 'Nonsense' }), []), 'an unknown type has no fields');
ok(omcTemplate.versions().at(-1) === V3 && omcTemplate.versions().includes('https://movielabs.com/omc/json/schema/v2.8'),
    'versions lists the served schema versions, oldest first');

if (failures) {
    console.error(`\n${failures} failed`);
    process.exit(1);
}
console.log('\nfields: all passed');
