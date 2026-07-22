/**
 * Guard: every hand-authored `mergeKey` names a real scalar property of the entity's derived
 * shape.
 *
 * The merge key (see generalConfig / omcTemplate.mergeKey) is editorial — which property
 * substitutes for identity when merging data from multiple sources is a domain judgment the
 * schema does not express, so it is hand-authored. This check keeps it honest against the one
 * thing that IS derived: the shape. If a schema change renames or drops the property a mergeKey
 * points at, this fails rather than letting the key silently reference nothing — the same
 * anti-drift discipline schemaFacts applies to cardinality.
 *
 *   Usage: node test/mergeKeys.js
 */

import { omcTemplate } from '../src/templates/index.js';

/** Versions whose shape is derived from the JSON Schema (so a path can be validated). */
const VERSIONS = [
    'https://movielabs.com/omc/json/schema/v2.8',
    'https://movielabs.com/omc/json/schema/v3.0',
];

let failures = 0;
const fail = (msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

/**
 * Resolve a dot path against a derived shape. Objects are plain maps of children; a scalar
 * is `{ $type }`; an array is `{ $type: 'array', $items }` — step into `$items` to continue.
 * Returns the shape node at the path, or null if any segment is absent.
 */
function resolveShapePath(shape, path) {
    return path.split('.').reduce((node, seg) => {
        if (!node || typeof node !== 'object') return null;
        const container = node.$type === 'array' && node.$items ? node.$items : node;
        return container[seg] ?? null;
    }, shape);
}

console.log('=== mergeKey paths resolve to a scalar in the derived shape ===');
VERSIONS.forEach((schemaVersion) => {
    const label = omcTemplate.versionLabel(schemaVersion);
    let checked = 0;
    omcTemplate.allEntityTypes({ schemaVersion }).forEach((entityType) => {
        const keys = omcTemplate.mergeKey({ entityType, schemaVersion });
        if (!keys.length) return;
        const shape = omcTemplate.shape({ entityType, schemaVersion });
        if (!shape) {
            fail(`${label} ${entityType}: has a mergeKey but no derived shape`);
            return;
        }
        keys.forEach((path) => {
            checked += 1;
            const node = resolveShapePath(shape, path);
            if (!node) {
                fail(`${label} ${entityType}: mergeKey '${path}' is not a property of the shape`);
                return;
            }
            const t = node.$type;
            if (!t || t === 'array' || t === 'object') {
                fail(`${label} ${entityType}: mergeKey '${path}' is not a scalar value ($type=${t || 'object'})`);
            }
        });
    });
    pass(`${label}: ${checked} mergeKey path(s) checked`);
});

if (failures) {
    console.error(`\nmergeKeys: ${failures} problem(s)`);
    process.exit(1);
}
console.log('\nmergeKeys: OK');
