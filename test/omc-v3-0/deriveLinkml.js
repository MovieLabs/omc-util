/**
 * Readiness harness: run the schema-derivation engine (schemaDerive.js) against the
 * LinkML-generated schema and confirm it derives a sound structural fact set from a
 * schema shaped very differently from today's (flat `$defs`, inlined base classes,
 * `enum` discriminators, `items.$ref: Any` beside `anyOf`).
 *
 * The engine must read it with the SAME code path — no per-schema branch. Where LinkML
 * derives LESS than the current schema, that is an upstream schema gap to fix in the
 * LinkML source, catalogued here rather than compensated for in code.
 *
 * A hard SANITY GATE (exit 1) guards that the engine did not silently derive nothing.
 * The gold-vs-linkml delta is a report.
 *
 *   Usage: node test/omc-v3-0/deriveLinkml.js
 */

import linkml from '../../src/omc/validation/schema/linkml_omc_schema.schema.json' with { type: 'json' };
import gold from '../../src/omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import {
    listEntities, cardinalityIndex, requiredFields, referenceShape, entityShape,
} from '../../src/templates/schemaDerive.js';

const line = (s = '') => console.log(s);
let failures = 0;
const gate = (cond, msg) => {
    if (cond) {
        console.log(`  ✓ ${msg}`);
    } else {
        failures += 1;
        console.error(`  ✗ ${msg}`);
    }
};

const lkEntities = listEntities(linkml);
const lkCaps = cardinalityIndex(linkml);
const lkRequired = requiredFields(linkml);
const lkRef = referenceShape(linkml);

// ===== SANITY GATE ===========================================================
line('=== LINKML SANITY GATE (engine reads the LinkML shape at all) ===');
gate(lkEntities.size > 0, `derived ${lkEntities.size} entities from the LinkML schema`);
gate(lkCaps.size > 0, `derived ${lkCaps.size} cardinality caps`);
gate(lkRequired.length > 0, `derived reference required-fields: [${lkRequired.join(', ')}]`);
gate(!!lkRef?.identifier, 'derived a reference shape');
const shapeSizes = [...lkEntities].map(([e, def]) => [e, Object.keys(entityShape(linkml, def)).length]);
gate(shapeSizes.every(([, n]) => n > 0), 'every entity derived a non-empty shape');

// ===== GOLD vs LINKML DELTA (report — upstream schema gaps) ==================
line('\n=== GOLD vs LINKML DELTA (upstream schema gaps — not compensated) ===');

const goldEntities = listEntities(gold);
const goldCaps = cardinalityIndex(gold);

const setDelta = (a, b) => ({
    onlyA: [...a].filter((x) => !b.has(x)),
    onlyB: [...b].filter((x) => !a.has(x)),
});

const eDelta = setDelta(new Set(goldEntities.keys()), new Set(lkEntities.keys()));
line(`\nEntities: gold ${goldEntities.size}, linkml ${lkEntities.size}`);
line(`  only in gold:   ${eDelta.onlyA.join(', ') || '(none)'}`);
line(`  only in linkml: ${eDelta.onlyB.join(', ') || '(none)'}`);

const cDelta = setDelta(new Set(goldCaps.keys()), new Set(lkCaps.keys()));
line(`\nCardinality caps: gold ${goldCaps.size}, linkml ${lkCaps.size}`);
line(`  caps in gold missing from linkml (${cDelta.onlyA.length}):`);
line(`    ${cDelta.onlyA.slice(0, 12).join(', ')}${cDelta.onlyA.length > 12 ? ', …' : ''}`);
line(`  caps in linkml missing from gold (${cDelta.onlyB.length}):`);
line(`    ${cDelta.onlyB.slice(0, 12).join(', ')}${cDelta.onlyB.length > 12 ? ', …' : ''}`);

// Per-entity shape-size comparison, to flag entities LinkML under-describes.
line('\nPer-entity derived shape size (leaf-ish top keys) gold vs linkml:');
const leafCount = (schema, def) => {
    const count = (shape) => {
        if (!shape || typeof shape !== 'object') return 0;
        if (typeof shape.$type === 'string') return 1;
        return Object.entries(shape).filter(([k]) => !k.startsWith('$')).reduce((n, [, v]) => n + count(v), 0);
    };
    return count(entityShape(schema, def));
};
const shrunk = [];
[...goldEntities.keys()].sort().forEach((e) => {
    if (!lkEntities.has(e)) return;
    const g = leafCount(gold, goldEntities.get(e));
    const l = leafCount(linkml, lkEntities.get(e));
    if (l < g * 0.5) shrunk.push(`${e}: gold ${g} -> linkml ${l}`);
});
line(`  entities LinkML describes with <50% of gold's leaves (${shrunk.length}):`);
shrunk.slice(0, 30).forEach((s) => line(`    ${s}`));
if (!shrunk.length) line('    (none — LinkML shapes are comparable in depth)');

// ===== RESULT ================================================================
line('');
if (failures) {
    console.error(`LINKML SANITY GATE FAILED (${failures}). The engine could not read the LinkML schema.`);
    process.exit(1);
}
line('LINKML SANITY GATE PASSED. Deltas above are upstream schema gaps to reconcile in the LinkML source.');
