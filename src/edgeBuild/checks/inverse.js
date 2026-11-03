/**
 * Check: the inverse of every edge can be calculated, and what a consumer writes from it is sound.
 *
 * The reverse of an edge is the table row's own `inverseEdge` — name, bucket and path, resolved
 * against the domain asked about. `omcTemplate.inverseEdgeFor()` returns it, fMam writes reverse
 * edges from it, and the Portal reads it to label the far end of a relationship. That field is the
 * subject here.
 *
 * Three things can go wrong, none of which announces itself:
 *
 *   1. A row has no inverse, so the relationship is one-way from the moment it is written.
 *   2. The schema does not declare `edges.<inverse>.<sourceType>`. The shared edges block is
 *      `additionalProperties: true`, so the reverse edge validates; the schema simply has no
 *      record of the pair, so nothing can be narrowed onto it and no reader of the schema knows
 *      the relationship runs that way.
 *   3. The inverse names a path the target type has no row at. That is worse than the second: the
 *      reverse still validates, but it is stored where the edge table cannot find it, so what is
 *      written can never be read back. The build composes a path only from a `connects` group that
 *      admits the pairing, so this holds unless that changes.
 *
 * Every finding is read from the table rows, one row at a time. A `connects` group can override its
 * definition's inverse, and two ranges of one verb can resolve to different reverses, so neither
 * the definitions nor one row per (domain, verb) says what a consumer will write. Involution is
 * checked only where the reverse is relational too: an intrinsic property's inverse is a general
 * predicate (`Member` ↔ `memberOf`), so its round trip legitimately lands elsewhere.
 *
 * @module edgeBuild/checks/inverse
 * @ignore
 */

import { schemaEdgeDeclarations } from './declarations.js';

export const name = 'EDGE INVERSE';

/**
 * What each finding costs. Nothing here mints invalid OMC: a reverse edge lands in the shared
 * `edges` block, which is `additionalProperties: true`, so every one of these validates. They are
 * incomplete or unrecorded relationships, which is work rather than breakage.
 */
export const severity = {
    'NO-INVERSE': 'warning',
    'NOT-INVOLUTIVE': 'warning',
    'INVERSE-UNDECLARED': 'warning',
    // Not a judgement about the publication: the table is contradicting itself.
    'INVERSE-UNREACHABLE': 'error',
};

/**
 * @param {{table: Object, schema: Object, collisions?: string[]}} subject
 * @returns {{findings: Object<string, string[]>, summary: string[], report: string[]}}
 */
export function run({ table, schema, collisions = [] }) {
    const { pairs: schemaPairs } = schemaEdgeDeclarations(schema);
    const edgeRows = Object.entries(table).flatMap(([domain, partitions]) => Object.values(partitions.edges || {})
        .map((entry) => ({ domain, entry })));

    const findings = {
        'NO-INVERSE': [],
        'NOT-INVOLUTIVE': [],
        'INVERSE-UNDECLARED': [],
        'INVERSE-UNREACHABLE': [],
    };

    // ---- involution: the reverse's own reverse leads back to the row ----
    edgeRows.forEach(({ domain, entry }) => {
        const reverse = entry.inverseEdge;
        if (reverse?.bucket !== 'edges') return;
        (entry.allowed || []).forEach((target) => {
            const back = table[target]?.edges?.[reverse.path]?.inverseEdge;
            if (!back?.path || back.path === entry.path) return;
            findings['NOT-INVOLUTIVE'].push(`${domain} ${entry.path} -> ${target} ${reverse.path} -> ${back.path}`);
        });
    });

    // ---- an inverse must name a path its target actually has ----
    // Every row and every range it admits, not one test per (domain, verb): two ranges of one verb
    // can resolve to different reverses, and an intrinsic reverse is as unreachable as any other.
    const declaredPaths = new Map(Object.entries(table).map(([entityType, partitions]) => [
        entityType,
        new Set([
            ...Object.values(partitions.intrinsic || {}),
            ...Object.values(partitions.edges || {}),
        ].map((entry) => entry.path)),
    ]));

    Object.entries(table).forEach(([domain, partitions]) => {
        [...Object.values(partitions.intrinsic || {}), ...Object.values(partitions.edges || {})]
            .forEach((entry) => {
                if (!entry.inverseEdge?.path) return;
                (entry.allowed || []).forEach((target) => {
                    if (declaredPaths.get(target)?.has(entry.inverseEdge.path)) return;
                    findings['INVERSE-UNREACHABLE'].push(`${target} declares no ${entry.inverseEdge.path} `
                        + `(the reverse of ${domain} ${entry.path})`);
                });
            });
    });

    // ---- the reverse each table row resolves to ----
    edgeRows.forEach(({ domain, entry }) => {
        const reverse = entry.inverseEdge;
        if (!reverse?.path) {
            findings['NO-INVERSE'].push(`${domain} ${entry.path} — no reverse edge is written`);
            return;
        }

        // Only a reverse that lands in the edges bucket is a (verb, range) pair the schema
        // declares; an intrinsic reverse is a named property, declared per entity instead.
        if (reverse.bucket !== 'edges') return;

        const [, verb] = entry.path.split('.');
        const [, inversePredicate] = reverse.path.split('.');
        if (!schemaPairs.has(`${inversePredicate}.${domain}`)) {
            findings['INVERSE-UNDECLARED'].push(`${inversePredicate}.${domain} `
                + `(the reverse of ${domain} ${verb})`);
        }
    });

    Object.keys(findings).forEach((kind) => {
        findings[kind] = [...new Set(findings[kind])].sort();
    });

    const report = [];
    if (collisions.length) {
        report.push(
            `edge-table collisions (${collisions.length}): two definitions claiming one storage path.`,
            ...collisions.map((collision) => `  ${collision}`),
        );
    }

    return {
        findings,
        summary: [`${edgeRows.length} edge rows a consumer could write a reverse for`],
        report,
    };
}
