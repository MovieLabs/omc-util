/**
 * Parity + diff harness for the schema-derivation engine (schemaDerive.js) against the
 * current v3.0 template pipeline.
 *
 * Two tiers, deliberately:
 *   STRICT GATE (exit 1 on failure) — facts the derivation is meant to own outright:
 *     - every cardinality cap the live pipeline consumes is reproduced with the same value
 *     - the derived entity set invents nothing (is a subset of the hand-authored set)
 *     - reference required-fields match
 *   DIFF REPORT (informational, never fails) — the derived entity shape vs the
 *     hand-authored template. These legitimately differ: hand templates add editorial
 *     `$default`s and the derivation surfaces schema paths the templates omit. The report
 *     is what a human reviews before any future cutover.
 *
 *   Usage: node test/omc-v3-0/deriveParity.js
 */

import { isCapitalized } from '../../src/mlHelpers/util.js';
import schemav30 from '../../src/omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import {
    listEntities, cardinalityIndex, entityShape, requiredFields,
} from '../../src/templates/schemaDerive.js';
import { buildMaxItemsIndex, referenceRequiredFields } from '../../src/templates/schemaFacts.js';
import { entityTemplate } from '../../src/templates/v3-0/index.js';

const line = (s = '') => console.log(s);
let failures = 0;
const fail = (msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

// ---- current pipeline facts -------------------------------------------------
const currentEntities = Object.keys(entityTemplate).filter(isCapitalized).sort();
const currentCaps = buildMaxItemsIndex(schemav30);
const currentRequired = referenceRequiredFields(schemav30);

// ---- derived facts ----------------------------------------------------------
const derivedEntityMap = listEntities(schemav30);
const derivedEntities = [...derivedEntityMap.keys()].sort();
const derivedCaps = cardinalityIndex(schemav30);
const derivedRequired = requiredFields(schemav30);

// ===== STRICT GATE ===========================================================
line('=== STRICT GATE ===');

// 1. cardinality: current ⊆ derived, equal values
const capMissing = [];
const capMismatch = [];
currentCaps.forEach((v, k) => {
    if (!derivedCaps.has(k)) capMissing.push(k);
    else if (derivedCaps.get(k) !== v) capMismatch.push(`${k}: ${v} -> ${derivedCaps.get(k)}`);
});
if (capMissing.length) fail(`cardinality caps dropped by derivation (${capMissing.length}): ${capMissing.join(', ')}`);
if (capMismatch.length) fail(`cardinality caps changed (${capMismatch.length}): ${capMismatch.join('; ')}`);
if (!capMissing.length && !capMismatch.length) {
    pass(`all ${currentCaps.size} consumed cardinality caps reproduced exactly (derivation also finds ${derivedCaps.size - currentCaps.size} more, unconsumed)`);
}

// 2. entity set: derivation invents nothing
const invented = derivedEntities.filter((e) => !currentEntities.includes(e));
if (invented.length) fail(`derivation invented entities not in the template set (${invented.length}): ${invented.join(', ')}`);
else pass(`derived entity set (${derivedEntities.length}) invents nothing`);

// 3. reference required fields
const reqEqual = JSON.stringify([...currentRequired].sort()) === JSON.stringify([...derivedRequired].sort());
if (!reqEqual) fail(`reference required-fields differ: current [${currentRequired}] vs derived [${derivedRequired}]`);
else pass(`reference required-fields match: [${derivedRequired.join(', ')}]`);

// ===== DIFF REPORT (informational) ==========================================
line('\n=== DIFF REPORT (informational — not a gate) ===');

// Template-only entities: hand-authored but with no schema definition.
const templateOnly = currentEntities.filter((e) => !derivedEntityMap.has(e));
line(`\nTemplate entities with NO schema definition (${templateOnly.length}): ${templateOnly.join(', ') || '(none)'}`);
line('  → hand-authored only; the derivation cannot and does not produce these.');

// Extra derived caps (surfaced by allOf merge; unconsumed by current stamping).
const extraCaps = [...derivedCaps.keys()].filter((k) => !currentCaps.has(k));
line(`\nExtra cardinality caps the derivation finds but current stamping omits (${extraCaps.length}):`);
line(`  ${extraCaps.slice(0, 6).join(', ')}${extraCaps.length > 6 ? ', …' : ''}`);
line('  → mostly baseEntity.instanceInfo.* caps the current walker misses (no allOf merge). Additive, correct.');

// Shape diff, per entity present in both derivation and templates.
const leafMap = (shape, path = '', out = {}) => {
    if (!shape || typeof shape !== 'object') return out;
    if (typeof shape.$type === 'string') {
        out[path] = shape.$type;
        if (shape.$type === 'array' && shape.$items) leafMap(shape.$items, path, out);
        return out;
    }
    Object.entries(shape).forEach(([k, v]) => {
        if (!k.startsWith('$')) leafMap(v, path ? `${path}.${k}` : k, out);
    });
    return out;
};

let totOnlyHand = 0;
let totOnlyDerived = 0;
let totTypeDiff = 0;
const perEntity = [];
derivedEntities.forEach((e) => {
    const hand = leafMap(entityTemplate[e]?.template || {});
    const der = leafMap(entityShape(schemav30, derivedEntityMap.get(e)));
    const onlyHand = Object.keys(hand).filter((p) => !(p in der));
    const onlyDer = Object.keys(der).filter((p) => !(p in hand));
    const typeDiff = Object.keys(hand).filter((p) => p in der && hand[p] !== der[p]);
    totOnlyHand += onlyHand.length;
    totOnlyDerived += onlyDer.length;
    totTypeDiff += typeDiff.length;
    if (onlyHand.length || onlyDer.length || typeDiff.length) {
        perEntity.push({
            e, onlyHand: onlyHand.length, onlyDer: onlyDer.length, typeDiff: typeDiff.length,
        });
    }
});

line(`\nShape diff over ${derivedEntities.length} entities (leaf paths):`);
line(`  paths only in hand-authored (editorial extras / derivation gaps): ${totOnlyHand}`);
line(`  paths only in derived (schema has, template omits): ${totOnlyDerived}`);
line(`  type mismatches: ${totTypeDiff}`);
line('  per-entity (entities that differ):');
perEntity.slice(0, 40).forEach(({
    e, onlyHand, onlyDer, typeDiff,
}) => line(`    ${e.padEnd(22)} onlyHand:${onlyHand}  onlyDerived:${onlyDer}  typeDiff:${typeDiff}`));

// ===== RESULT ================================================================
line('');
if (failures) {
    console.error(`STRICT GATE FAILED (${failures} problem${failures > 1 ? 's' : ''}).`);
    process.exit(1);
}
line('STRICT GATE PASSED. Diff report above is for review, not a failure.');
