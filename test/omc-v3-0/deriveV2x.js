/**
 * Readiness spike: can the derivation engine serve the legacy v2.x schemas, so their
 * hand-authored template shapes can eventually be retired too?
 *
 * For each of v2.1 / v2.6 / v2.8 it runs the engine over the bundled schema and compares
 * the derived shape against the current hand-authored template (the shape `omcTemplate`
 * returns today via its v2.x fallback). It writes, into test/omc-v3-0/derived/:
 *   v2-1.json / v2-6.json / v2-8.json  — the derived shape per version
 *   v2x-readiness.md                    — per-version entity-set delta, deprecated drops,
 *                                         and per-entity data-field diff vs hand-authored
 *
 * A SANITY GATE (exit 1) guards that the engine derived non-empty entities/shapes. The
 * hand-authored comparison is a report for review before any cleanup — it is expected to
 * differ (the v2.x hand templates embed edges inline and omit some schema detail).
 *
 *   Usage: node test/omc-v3-0/deriveV2x.js
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isCapitalized } from '../../src/mlHelpers/util.js';
import schemav21 from '../../src/omc/validation/schema/OMC-JSON-v2.1.schema.json' with { type: 'json' };
import schemav26 from '../../src/omc/validation/schema/OMC-JSON-v2.6.schema.json' with { type: 'json' };
import schemav28 from '../../src/omc/validation/schema/OMC-JSON-v2.8.schema.json' with { type: 'json' };
import { listEntities, entityShape } from '../../src/templates/schemaDerive.js';
// The v2.x hand-authored templates (shared by v2.1/2.6/2.8 today).
import { entityTemplate as handTemplates } from '../../src/templates/v2-8/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'derived');
mkdirSync(outDir, { recursive: true });

const VERSIONS = [
    { key: 'v2-1', schema: schemav21 },
    { key: 'v2-6', schema: schemav26 },
    { key: 'v2-8', schema: schemav28 },
];

const sortDeep = (value) => {
    if (Array.isArray(value)) return value.map(sortDeep);
    if (value && typeof value === 'object') {
        return Object.keys(value).sort().reduce((obj, key) => {
            obj[key] = sortDeep(value[key]);
            return obj;
        }, {});
    }
    return value;
};

// Flatten a shape to `path -> $type` leaves; capitalised (relationship) keys are skipped
// so the comparison is about DATA fields — relationships are delivered via edgeTable and
// the v2.x hand templates encode them inline ($edge), which is not a data-shape concern.
const dataLeaves = (shape, path = '', out = {}) => {
    if (!shape || typeof shape !== 'object') return out;
    if (typeof shape.$type === 'string') {
        out[path] = shape.$type;
        if (shape.$type === 'array' && shape.$items) dataLeaves(shape.$items, path, out);
        return out;
    }
    Object.entries(shape).forEach(([k, v]) => {
        if (k.startsWith('$') || isCapitalized(k)) return;
        dataLeaves(v, path ? `${path}.${k}` : k, out);
    });
    return out;
};

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

// Entity types the schema declares but marks deprecated (dropped by the engine).
const deprecatedEntities = (schema) => {
    const found = [];
    const defs = schema?.$defs || {};
    const consider = (name, def) => {
        if (def && typeof def === 'object' && def.deprecated === true && isCapitalized(name)) found.push(name);
    };
    Object.entries(defs).forEach(([name, def]) => {
        consider(name, def);
        if (def && typeof def === 'object' && def.properties) {
            Object.entries(def.properties).forEach(([n, d]) => consider(n, d));
        }
    });
    return found;
};

const md = [];
md.push('# v2.x derivation readiness');
md.push('');
md.push('Per version: the derived shape vs the current hand-authored v2.x template. Data-field');
md.push('leaves only (relationship/capitalised keys skipped — edges are a separate concern).');
md.push('');

const handEntityTypes = Object.keys(handTemplates).filter(isCapitalized).sort();

line('=== V2.x DERIVATION SANITY GATE ===');
VERSIONS.forEach(({ key, schema }) => {
    const entMap = listEntities(schema);
    const entityTypes = [...entMap.keys()].sort();

    // Write the derived dump for this version.
    const entities = entityTypes.reduce((obj, e) => {
        obj[e] = sortDeep(entityShape(schema, entMap.get(e)));
        return obj;
    }, {});
    writeFileSync(join(outDir, `${key}.json`), `${JSON.stringify({ schema: key, entities }, null, 2)}\n`);

    gate(entityTypes.length > 0, `${key}: derived ${entityTypes.length} entities`);
    gate(entityTypes.every((e) => Object.keys(entities[e]).length > 0), `${key}: every entity has a non-empty shape`);

    // Report section.
    md.push(`## ${key}`);
    md.push('');
    const onlyDerivedEnts = entityTypes.filter((e) => !handEntityTypes.includes(e));
    const onlyHandEnts = handEntityTypes.filter((e) => !entMap.has(e));
    md.push(`- entities: derived ${entityTypes.length}, hand-authored ${handEntityTypes.length}`);
    md.push(`- only in derived: ${onlyDerivedEnts.join(', ') || '(none)'}`);
    md.push(`- only in hand-authored: ${onlyHandEnts.join(', ') || '(none)'}`);
    md.push(`- deprecated entities dropped by engine: ${deprecatedEntities(schema).join(', ') || '(none)'}`);
    md.push('');
    md.push('| entity | derived leaves | hand leaves | only derived | only hand | type diff |');
    md.push('| --- | ---: | ---: | ---: | ---: | ---: |');
    entityTypes.filter((e) => handTemplates[e]?.template).forEach((e) => {
        const d = dataLeaves(entities[e]);
        const h = dataLeaves(handTemplates[e].template);
        const onlyD = Object.keys(d).filter((p) => !(p in h));
        const onlyH = Object.keys(h).filter((p) => !(p in d));
        const typeDiff = Object.keys(d).filter((p) => p in h && d[p] !== h[p]);
        md.push(`| ${e} | ${Object.keys(d).length} | ${Object.keys(h).length} | ${onlyD.length} | ${onlyH.length} | ${typeDiff.length} |`);
    });
    md.push('');
});

writeFileSync(join(outDir, 'v2x-readiness.md'), `${md.join('\n')}\n`);

line('');
line(`Wrote ${join(outDir, 'v2-1.json')}, v2-6.json, v2-8.json, v2x-readiness.md`);
if (failures) {
    console.error(`SANITY GATE FAILED (${failures}).`);
    process.exit(1);
}
line('SANITY GATE PASSED. Review v2x-readiness.md before retiring the hand-authored v2.x shapes.');
