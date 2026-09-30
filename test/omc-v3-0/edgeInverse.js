/**
 * Guard: the inverse of every edge can be calculated, and what fMam writes from it is sound.
 *
 * fMam generates the reverse of every edge on save. `mongo-3/edge.js computeInverseEdges` asks
 * one function — `omcTemplate.inverseEdge({ edge, schemaVersion })` — and writes the answer as
 * `inverse[<name>][<sourceEntityType>] = [ids]`. That is the whole contract, and it has three
 * ways to go wrong, none of which announces itself:
 *
 *   1. The function returns null and fMam `continue`s. The reverse edge is never written, and
 *      nothing is logged: the relationship is simply one-way from then on.
 *   2. The name comes back but the schema does not declare `edges.<name>.<sourceType>`. The
 *      shared edges block is `additionalProperties: true`, so this validates — the edge is real,
 *      the schema just has no record of that verb being used in that direction.
 *   3. The name belongs to an INTRINSIC property rather than a relational predicate. The edge
 *      table knows this and resolves `inversePath` to the bare property (`Member`, `Product`);
 *      `inverseEdge()` returns only the name, so fMam cannot tell, and writes it into a
 *      predicate-shaped bucket. The two sides then disagree about where that reference lives.
 *   4. A `connects` group overrides the predicate's inverse — `realizedBy` inverts to
 *      `RealizationOf` in general but to `usedBy` from Task and Participant. `buildEdgeTable`
 *      honours the override when it resolves `inversePath`; `inverseEdgesFrom` reads only the
 *      definition-level `inverse`, by its own account, so the map cannot express it. The table
 *      and fMam then hold different answers for the same edge, and only the table's is right.
 *
 * Involution is checked only between relational predicates. An intrinsic property's inverse is a
 * general predicate (`Member` ↔ `memberOf`, `Series` ↔ `related`), so the round trip legitimately
 * lands somewhere else and is not a fault.
 *
 * Findings are matched verbatim against an accept file, as elsewhere in this directory: they are
 * warnings about modelling rather than assertions that the definitions are wrong, but an
 * unaccepted one fails so that a new gap is answered rather than accumulated.
 *
 *   Usage: node test/omc-v3-0/edgeInverse.js [--candidate <src>] [--shipped|--static] [--accept <file>]
 *       --candidate takes the Edge Editor's published JSON or a module exporting
 *       `edgeDefinitions`; the default is the current edges.js.
 *       default accept file: test/omc-v3-0/edgeInverse.accept.txt
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import schemav30 from '../../src/omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';
import { inverseEdgesFrom } from '../../src/templates/v3-0/inverseEdges.js';

import { loadCandidate } from './candidateDefinitions.js';

const here = dirname(fileURLToPath(import.meta.url));
const defaultAcceptPath = join(here, 'edgeInverse.accept.txt');

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

const line = (s = '') => console.log(s);

async function main() {
    let source;
    try {
        source = await loadCandidate(argValue('--candidate'), {
            static: process.argv.includes('--static'),
            shipped: process.argv.includes('--shipped'),
        });
    } catch (err) {
        // The reason a source could not be read is the whole message; a stack trace says nothing a
        // reader needs. `exitCode` rather than `exit()` throughout: on Node 24 under Windows,
        // exiting after a fetch trips a libuv assertion and the real exit code is lost.
        console.error(err.message);
        process.exitCode = 1;
        return;
    }
    const { definitions } = source;
    const { table, collisions = [] } = source.table ? source : buildEdgeTable(definitions);

    /** What omcTemplate.inverseEdge() will answer. The shipped subject supplies its own,
     *  since the exported map is a union the definitions alone do not describe. */
    const inverses = source.inverses ?? inverseEdgesFrom(definitions);

    /** Relational when the definitions say so; an unknown name is relational by the same default
     *  buildEdgeTable applies when it resolves an inverse path. */
    const isRelational = (predicate) => (definitions[predicate]
        ? (definitions[predicate].placement || 'edges') === 'edges'
        : true);

    const schemaEdgeNode = schemav30.$defs?.core?.properties?.edges?.properties || {};
    const schemaPairs = new Set(Object.keys(schemaEdgeNode).flatMap((verb) => (
        Object.keys(schemaEdgeNode[verb].properties || {}).map((range) => `${verb}.${range}`)
    )));

    const findings = {
        'NO-INVERSE': [],
        'INVERSE-UNKNOWN': [],
        'NOT-INVOLUTIVE': [],
        'INVERSE-MALFORMED': [],
        'INVERSE-OVERRIDE': [],
        'INVERSE-BUCKET': [],
        'INVERSE-UNDECLARED': [],
    };

    // ---- the inverse map on its own ---------------------------------------------

    Object.entries(inverses).forEach(([predicate, inverse]) => {
        if (!isRelational(predicate)) return; // an intrinsic property's inverse is a predicate
        if (!inverses[inverse]) {
            findings['INVERSE-UNKNOWN'].push(`${predicate} -> ${inverse} (which has no inverse of its own)`);
            return;
        }
        if (isRelational(inverse) && inverses[inverse] !== predicate) {
            findings['NOT-INVOLUTIVE'].push(`${predicate} -> ${inverse} -> ${inverses[inverse]}`);
        }
    });

    // ---- what fMam would write for each edge the table holds --------------------

    const seen = new Set();
    Object.entries(table).forEach(([domain, partitions]) => {
        Object.values(partitions.edges || {}).forEach((entry) => {
            const [, verb] = entry.path.split('.');
            const key = `${domain} ${verb}`;
            if (seen.has(key)) return;
            seen.add(key);

            const inverse = inverses[verb];
            if (!inverse) {
                findings['NO-INVERSE'].push(`${verb} (on ${domain}) — fMam writes no reverse edge`);
                return;
            }

            // What fMam writes, having only the name, against what the table resolved for this group.
            const fMamWrites = `edges.${inverse}.${domain}`;
            const tablePath = entry.inversePath;
            const tableVerb = tablePath?.startsWith('edges.') ? tablePath.split('.')[1] : null;

            // An edges-bucket path is exactly `edges.<verb>.<Range>`. More segments than that means the
            // name the group gave as its inverse is not a predicate — a storage path was written where
            // a predicate name belongs, and resolveInversePath fell back to the edges default around
            // it. The reverse edge then has nowhere real to live.
            if (tablePath?.startsWith('edges.') && tablePath.split('.').length !== 3) {
                findings['INVERSE-MALFORMED'].push(`${verb} on ${domain}: the group names inverse `
                    + `"${tablePath.split('.').slice(1, -1).join('.')}", which is not a predicate, so `
                    + `the table resolved "${tablePath}"`);
                return;
            }
            if (tableVerb && tableVerb !== inverse) {
                findings['INVERSE-OVERRIDE'].push(`${verb} on ${domain}: the group inverts to `
                    + `"${tablePath}", the predicate declares "${inverse}", so fMam writes `
                    + `"${fMamWrites}"`);
                return;
            }
            if (!isRelational(inverse)) {
                findings['INVERSE-BUCKET'].push(`${verb} -> ${inverse} — intrinsic property, `
                    + `table path "${tablePath}", fMam writes "${fMamWrites}"`);
                return;
            }
            if (!schemaPairs.has(`${inverse}.${domain}`)) {
                findings['INVERSE-UNDECLARED'].push(`${inverse}.${domain} (the reverse of ${domain} ${verb})`);
            }
        });
    });

    Object.keys(findings).forEach((kind) => {
        findings[kind] = [...new Set(findings[kind])].sort();
    });

    // ===== GATE ==================================================================
    line('=== EDGE INVERSE GATE ===');
    line(`  source: ${source.label}`);
    if (source.live) line('  live source — reporting, not gating: its content changes between runs');
    line(`  inverse map: ${Object.keys(inverses).length} entries; `
        + `${seen.size} (entityType, verb) pairs fMam could write a reverse for`);

    const acceptPath = argValue('--accept') || defaultAcceptPath;
    // A live source is not measured against the accept file: that file records where the static
    // edges.js stands, and says nothing about what the tool is serving today.
    const accepted = new Set(!source.live && existsSync(acceptPath)
        ? readFileSync(acceptPath, 'utf8').split(/\r?\n/)
            .map((entry) => entry.trim())
            .filter((entry) => entry && !entry.startsWith('#'))
        : []);

    let failing = 0;
    Object.entries(findings).forEach(([kind, lines]) => {
        if (!lines.length) {
            console.log(`  ✓ ${kind}: none`);
            return;
        }
        line(`\n  ${kind} (${lines.length})`);
        lines.forEach((entry) => {
            const full = `${kind} ${entry}`;
            const ok = accepted.has(full);
            if (!ok) failing += 1;
            console.log(`    ${ok ? '=' : '!'} ${full}`);
        });
    });

    // ===== REPORT ================================================================
    // What the accessor answers that the flat map cannot. `omcTemplate.inverseEdgeFor` hands back
    // the inverse as an edge — bucket, path and all — resolved against the domain it was asked
    // about, which is where every finding above but NOT-INVOLUTIVE and INVERSE-UNDECLARED comes
    // from: the flat map has one answer per predicate, and these rows need one per group.
    const disagreements = [];
    Object.entries(table).forEach(([domain, partitions]) => {
        Object.values(partitions.edges || {}).forEach((entry) => {
            const [, verb] = entry.path.split('.');
            const name = inverses[verb];
            if (!name) return;
            const flat = `edges.${name}.${domain}`;
            const resolved = entry.inverseEdge?.path;
            if (resolved && resolved !== flat) disagreements.push(`${domain} ${entry.path}: map "${flat}", accessor "${resolved}"`);
        });
    });

    line('');
    line('=== REPORT (informational — not a gate) ===');
    line(`  inverseEdgeFor disagrees with the flat map on ${[...new Set(disagreements)].length} of `
        + `${seen.size} (entityType, verb) pairs, and is right on each: the map cannot express an `
        + 'intrinsic inverse, a per-group override, or two pairs sharing a verb.');
    [...new Set(disagreements)].sort().forEach((entry) => line(`    ${entry}`));

    if (collisions.length) {
        line('');
        line(`  edge-table collisions (${collisions.length}): two definitions claiming one storage path.`);
        collisions.forEach((collision) => line(`    ${JSON.stringify(collision)}`));
    }

    // ===== RESULT ================================================================
    line('');
    line(`${failing} ${source.live ? 'finding' : 'unaccepted finding'}${failing === 1 ? '' : 's'}.`);
    if (failing && !source.live) {
        console.error('EDGE INVERSE GATE FAILED. Fix the definitions or the schema, or declare the '
            + `finding in ${acceptPath}.`);
        process.exitCode = 1;
        return;
    }
    line(source.live
        ? 'EDGE INVERSE REPORT complete — a live source is not gated.'
        : 'EDGE INVERSE GATE PASSED.');
}

await main();
