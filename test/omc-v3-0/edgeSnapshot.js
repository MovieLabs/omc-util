/**
 * Regression fixture generator for the v3-0 edge refactor.
 *
 * Dumps the full, flattened `edgeTable` ({ intrinsic, edges, cxtEdges }) for every
 * entityType in the v3-0 template set, with deterministically sorted keys, so the
 * output can be diffed before/after the consolidation of edges into edges.js.
 *
 * Usage:
 *   node test/omc-v3-0/edgeSnapshot.js            # write   test/omc-v3-0/edgeTable.snapshot.json
 *   node test/omc-v3-0/edgeSnapshot.js --check     # compare current build against the saved snapshot
 *
 * The intended diff after the refactor is `omcPredicate` only (it is regenerated and
 * made consistent). { allowed, path, type, inverse } must match exactly.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { entityTemplate } from '../../src/templates/v3-0/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const snapshotPath = join(here, 'edgeTable.snapshot.json');

// Recursively sort object keys so JSON.stringify is stable regardless of insertion order
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

// Pull just the edgeTable for every entityType (skip non-entity keys: inverseEdges, baseEntity)
const buildSnapshot = () => Object.keys(entityTemplate)
    .filter((key) => entityTemplate[key]?.edgeTable)
    .sort()
    .reduce((acc, entityType) => {
        acc[entityType] = entityTemplate[entityType].edgeTable;
        return acc;
    }, {});

const serialize = (snapshot) => `${JSON.stringify(sortDeep(snapshot), null, 2)}\n`;

const rowCount = (snapshot) => Object.values(snapshot).reduce((n, tbl) => (
    n + ['intrinsic', 'edges', 'cxtEdges'].reduce((m, kind) => m + Object.keys(tbl[kind] || {}).length, 0)
), 0);

const snapshot = buildSnapshot();

if (process.argv.includes('--check')) {
    const saved = readFileSync(snapshotPath, 'utf8');
    const current = serialize(snapshot);
    if (saved === current) {
        console.log(`✓ edgeTable matches snapshot (${rowCount(snapshot)} rows, ${Object.keys(snapshot).length} entities)`);
        process.exit(0);
    }
    console.error('✗ edgeTable differs from snapshot. Regenerate or inspect the diff.');
    process.exit(1);
} else {
    writeFileSync(snapshotPath, serialize(snapshot));
    console.log(`Wrote ${snapshotPath}`);
    console.log(`${Object.keys(snapshot).length} entities, ${rowCount(snapshot)} edge rows`);
}
