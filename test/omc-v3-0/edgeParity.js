/**
 * Parity check for the v3-0 edge build.
 *
 * Records the edge table built from the current edges.js — all three partitions plus the
 * inverse map — and compares a candidate set of edge definitions against it, entry by
 * storage path. Every field is compared, so a candidate is at parity only when it builds
 * exactly the same table.
 *
 * Usage:
 *   node test/omc-v3-0/edgeParity.js --baseline
 *       write test/omc-v3-0/edgeParity.baseline.json from the current edges.js
 *   node test/omc-v3-0/edgeParity.js [--candidate <module>] [--accept <file>]
 *       compare a module exporting `edgeDefinitions` (default: the current edges.js)
 *       against the baseline. `--accept` names a file of difference lines, one per line,
 *       that are expected and do not fail the check.
 *
 * Exits 1 when any difference is not accepted.
 *
 * TRANSITIONAL. The baseline is a snapshot of the hand-written edges.js, and the table is to be
 * driven by what the Edge Editor publishes instead. While the schema keeps moving, this will drift
 * by design: it is useful for spotting what a change moved, and for diffing a published document
 * against where the hand-written set stood, but it is not a standing gate. It is deliberately not
 * in release:check for that reason. Delete it once the published document is the table.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';
import { edgeDefinitions } from '../../src/templates/v3-0/edges.js';
import { inverseEdgesFrom } from '../../src/templates/v3-0/inverseEdges.js';

import { loadCandidate } from './candidateDefinitions.js';

const here = dirname(fileURLToPath(import.meta.url));
const baselinePath = join(here, 'edgeParity.baseline.json');
const PARTITIONS = ['edges', 'intrinsic', 'cxtEdges'];
const FIELDS = ['predicate', 'allowed', 'type', 'maxItems', 'inverse', 'inversePath', 'omcPredicate'];

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

/**
 * Recursively sort object keys so the serialised form is stable.
 *
 * @param {*} value
 * @returns {*}
 */
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

/**
 * Build the comparable record for a set of edge definitions.
 *
 * @param {Object} definitions - Edge definitions in the edges.js shape
 * @returns {{table: Object, inverseEdges: Object, collisions: string[]}}
 */
const recordFor = (definitions) => {
    const { table, collisions } = buildEdgeTable(definitions);
    return sortDeep({ table, inverseEdges: inverseEdgesFrom(definitions), collisions });
};

/**
 * Load the candidate definitions from a module path.
 *
 * @param {string|null} modulePath
 * @returns {Promise<Object>}
 */
// JSON.stringify drops undefined, so compare values in their serialised form
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const show = (value) => JSON.stringify(value ?? null);

/**
 * Every difference between the baseline and the candidate, one line each.
 *
 * @param {Object} base - Baseline record
 * @param {Object} cand - Candidate record
 * @returns {{NEW: string[], MISSING: string[], CHANGED: string[], INVERSE: string[], COLLISION: string[]}}
 */
const differences = (base, cand) => {
    const found = {
        NEW: [], MISSING: [], CHANGED: [], INVERSE: [], COLLISION: [],
    };
    const entities = [...new Set([...Object.keys(base.table), ...Object.keys(cand.table)])].sort();
    entities.forEach((entity) => PARTITIONS.forEach((partition) => {
        const b = base.table[entity]?.[partition] || {};
        const c = cand.table[entity]?.[partition] || {};
        [...new Set([...Object.keys(b), ...Object.keys(c)])].sort().forEach((path) => {
            const at = `${entity}.${partition} ${path}`;
            if (!b[path]) {
                found.NEW.push(at);
                return;
            }
            if (!c[path]) {
                found.MISSING.push(at);
                return;
            }
            FIELDS.filter((field) => !same(b[path][field], c[path][field]))
                .forEach((field) => found.CHANGED.push(
                    `${at} ${field}: ${show(b[path][field])} -> ${show(c[path][field])}`,
                ));
        });
    }));
    [...new Set([...Object.keys(base.inverseEdges), ...Object.keys(cand.inverseEdges)])].sort()
        .filter((predicate) => base.inverseEdges[predicate] !== cand.inverseEdges[predicate])
        .forEach((predicate) => found.INVERSE.push(
            `inverseEdges ${predicate}: ${show(base.inverseEdges[predicate])} -> ${show(cand.inverseEdges[predicate])}`,
        ));
    cand.collisions.forEach((collision) => found.COLLISION.push(`collision ${collision}`));
    return found;
};

const rowCount = (record) => Object.values(record.table).reduce((n, entry) => (
    n + PARTITIONS.reduce((m, partition) => m + Object.keys(entry[partition] || {}).length, 0)
), 0);

if (process.argv.includes('--baseline')) {
    const record = recordFor(edgeDefinitions);
    writeFileSync(baselinePath, `${JSON.stringify(record, null, 2)}\n`);
    console.log(`Wrote ${baselinePath}`);
    console.log(`${Object.keys(record.table).length} entities, ${rowCount(record)} rows, `
        + `${Object.keys(record.inverseEdges).length} inverses, ${record.collisions.length} collisions`);
} else {
    const base = JSON.parse(readFileSync(baselinePath, 'utf8'));
    const candidateSource = await loadCandidate(argValue('--candidate'));
    console.log(`Candidate: ${candidateSource.label}`);
    const cand = recordFor(candidateSource.definitions);
    const acceptPath = argValue('--accept');
    const accepted = new Set(acceptPath
        ? readFileSync(acceptPath, 'utf8').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
        : []);

    const found = differences(base, cand);
    let failing = 0;
    Object.entries(found).forEach(([kind, lines]) => {
        if (!lines.length) return;
        console.log(`\n${kind} (${lines.length})`);
        lines.forEach((line) => {
            const ok = accepted.has(line);
            if (!ok) failing += 1;
            console.log(`  ${ok ? '=' : '!'} ${line}`);
        });
    });
    console.log(`\nBaseline ${rowCount(base)} rows; candidate ${rowCount(cand)} rows; `
        + `${failing} unaccepted difference${failing === 1 ? '' : 's'}.`);
    process.exit(failing ? 1 : 0);
}
