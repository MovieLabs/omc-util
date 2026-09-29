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
 *
 * Involution is checked only between relational predicates. An intrinsic property's inverse is a
 * general predicate (`Member` ↔ `memberOf`, `Series` ↔ `related`), so the round trip legitimately
 * lands somewhere else and is not a fault.
 *
 * Findings are matched verbatim against an accept file, as elsewhere in this directory: they are
 * warnings about modelling rather than assertions that the definitions are wrong, but an
 * unaccepted one fails so that a new gap is answered rather than accumulated.
 *
 *   Usage: node test/omc-v3-0/edgeInverse.js [--candidate <module>] [--accept <file>]
 *       --candidate takes the Edge Editor's published JSON or a module exporting
 *       `edgeDefinitions`; the default is the current edges.js.
 *       default accept file: test/omc-v3-0/edgeInverse.accept.txt
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import schemav30 from '../../src/omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';
import { edgeDefinitions } from '../../src/templates/v3-0/edges.js';
import { hydrateEdgeDefinitions } from '../../src/templates/v3-0/edgesHydrate.js';
import { inverseEdgesFrom } from '../../src/templates/v3-0/inverseEdges.js';

const here = dirname(fileURLToPath(import.meta.url));
const defaultAcceptPath = join(here, 'edgeInverse.accept.txt');

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

const line = (s = '') => console.log(s);

const loadCandidate = async (modulePath) => {
    if (!modulePath) return edgeDefinitions;
    if (modulePath.endsWith('.json')) {
        const doc = JSON.parse(readFileSync(resolve(modulePath), 'utf8'));
        return hydrateEdgeDefinitions(doc.edgeDefinitions ?? doc);
    }
    const mod = await import(pathToFileURL(resolve(modulePath)).href);
    const definitions = mod.edgeDefinitions || mod.default?.edgeDefinitions || mod.default;
    if (!definitions || typeof definitions !== 'object') {
        throw new Error(`${modulePath} exports no edgeDefinitions`);
    }
    return definitions;
};

const definitions = await loadCandidate(argValue('--candidate'));
const { table, collisions } = buildEdgeTable(definitions);

/** What omcTemplate.inverseEdge() will answer, built the same way the live table builds it. */
const inverses = inverseEdgesFrom(definitions);

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
        if (!isRelational(inverse)) {
            findings['INVERSE-BUCKET'].push(`${verb} -> ${inverse} — intrinsic property, `
                + `table path "${entry.inversePath}", fMam writes edges.${inverse}.${domain}`);
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
line(`  source: ${argValue('--candidate') || 'src/templates/v3-0/edges.js'}`);
line(`  inverse map: ${Object.keys(inverses).length} entries; `
    + `${seen.size} (entityType, verb) pairs fMam could write a reverse for`);

const acceptPath = argValue('--accept') || defaultAcceptPath;
const accepted = new Set(existsSync(acceptPath)
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

if (collisions.length) {
    line('');
    line('=== REPORT (informational — not a gate) ===');
    line(`  edge-table collisions (${collisions.length}): two definitions claiming one storage path.`);
    collisions.forEach((collision) => line(`    ${JSON.stringify(collision)}`));
}

// ===== RESULT ================================================================
line('');
line(`${failing} unaccepted finding${failing === 1 ? '' : 's'}.`);
if (failing) {
    console.error('EDGE INVERSE GATE FAILED. Fix the definitions or the schema, or declare the '
        + `finding in ${acceptPath}.`);
    process.exit(1);
}
line('EDGE INVERSE GATE PASSED.');
