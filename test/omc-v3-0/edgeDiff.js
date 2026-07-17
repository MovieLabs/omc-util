/**
 * Diffs the consolidated edge build (buildEdgeTable.js / edges.js) against the
 * pre-refactor snapshot (edgeTable.snapshot.json).
 *
 * The `edges` and `intrinsic` partitions are diffed in detail against the snapshot.
 * cxtEdges is now generated but is a greenfield redesign (legacy cxtEdges data was
 * buggy), so it is summarised by count rather than diffed line-by-line.
 *
 * Differences are categorised:
 *   identical             — every field (incl. omcPredicate) matches
 *   omcPredicate-only     — expected: omcPredicate is regenerated/cleaned up
 *   NEW                   — entry produced by the build but absent from the snapshot
 *   MISSING               — entry in the snapshot not produced (incl. known bug-paths)
 *   STRUCTURAL            — allowed/type/inverse differ (entries joined by storage path)
 *
 *   Usage: node test/omc-v3-0/edgeDiff.js
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';

const here = dirname(fileURLToPath(import.meta.url));
const snap = JSON.parse(readFileSync(join(here, 'edgeTable.snapshot.json'), 'utf8'));
const { table: gen, collisions } = buildEdgeTable();

const PARTITIONS = ['edges', 'intrinsic'];
const setEq = (a = [], b = []) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const norm = (v) => (v === undefined ? null : v);

const entities = [...new Set([...Object.keys(snap), ...Object.keys(gen)])].sort();
const report = {
    NEW: [], MISSING: [], STRUCTURAL: [], rdfOnly: 0, identical: 0,
};

// Re-key each partition by storage path (the stable identity), so the diff is
// independent of the partition's key scheme (legacy = range type, new = path).
const byPath = (tbl) => Object.values(tbl).reduce((m, e) => {
    m[e.path] = e;
    return m;
}, {});

entities.forEach((ent) => PARTITIONS.forEach((part) => {
    const s = byPath((snap[ent] && snap[ent][part]) || {});
    const g = byPath((gen[ent] && gen[ent][part]) || {});
    const paths = [...new Set([...Object.keys(s), ...Object.keys(g)])].sort();
    paths.forEach((p) => {
        const sv = s[p];
        const gv = g[p];
        const loc = `${ent}.${part}  ${p}`;
        if (gv && !sv) {
            report.NEW.push(loc);
            return;
        }
        if (sv && !gv) {
            report.MISSING.push(loc);
            return;
        }
        const struct = [];
        if (!setEq(sv.allowed, gv.allowed)) struct.push(`allowed [${sv.allowed}] -> [${gv.allowed}]`);
        if (norm(sv.type) !== norm(gv.type)) struct.push(`type ${sv.type} -> ${gv.type}`);
        if (norm(sv.inverse) !== norm(gv.inverse)) struct.push(`inverse ${sv.inverse} -> ${gv.inverse}`);
        if (struct.length) report.STRUCTURAL.push(`${loc}: ${struct.join('; ')}`);
        else if (norm(sv.omcPredicate) !== norm(gv.omcPredicate)) report.rdfOnly += 1;
        else report.identical += 1;
    });
}));

console.log('=== EDGE BUILD DIFF (edges + intrinsic diffed; cxtEdges summarised) ===');
console.log(`identical (incl. omcPredicate): ${report.identical}`);
console.log(`omcPredicate-only changes (expected/clean): ${report.rdfOnly}`);
console.log(`\nNEW in generated (${report.NEW.length}):`);
report.NEW.forEach((x) => console.log(`  + ${x}`));
console.log(`\nMISSING from generated (${report.MISSING.length}):`);
report.MISSING.forEach((x) => console.log(`  - ${x}`));
console.log(`\nSTRUCTURAL changes — review (${report.STRUCTURAL.length}):`);
report.STRUCTURAL.forEach((x) => console.log(`  ~ ${x}`));
console.log(`\nKEY COLLISIONS (${collisions.length}):`);
collisions.forEach((c) => console.log(`  ! ${c}`));

// cxtEdges: greenfield generation — summarise counts rather than diff vs legacy
const cxtCounts = entities
    .map((ent) => [ent, Object.keys((gen[ent] && gen[ent].cxtEdges) || {}).length])
    .filter(([, n]) => n > 0);
const cxtTotal = cxtCounts.reduce((sum, [, n]) => sum + n, 0);
console.log(`\n=== cxtEdges generated (greenfield; not diffed): ${cxtTotal} across ${cxtCounts.length} subjects ===`);
cxtCounts.forEach(([ent, n]) => console.log(`  ${ent}: ${n}`));
