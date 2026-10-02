/**
 * Check: the inverse of every edge can be calculated, and what a consumer writes from it is sound.
 *
 * The reverse of an edge is the table row's own `inverseEdge` — name, bucket and path, resolved
 * against the domain asked about. `omcTemplate.inverseEdgeFor()` returns it, fMam writes reverse
 * edges from it, and the Portal reads it to label the far end of a relationship. That field is the
 * subject here.
 *
 * Two things can go wrong, neither of which announces itself:
 *
 *   1. A row has no inverse, so the relationship is one-way from the moment it is written.
 *   2. The schema does not declare `edges.<inverse>.<sourceType>`. The shared edges block is
 *      `additionalProperties: true`, so the reverse edge validates; the schema simply has no
 *      record of the pair, so nothing can be narrowed onto it and no reader of the schema knows
 *      the relationship runs that way.
 *
 * Involution is read from the definitions, which are the publication's own statement of each
 * predicate's inverse, and is checked only between relational predicates: an intrinsic property's
 * inverse is a general predicate (`Member` ↔ `memberOf`), so its round trip legitimately lands
 * elsewhere.
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
};

/**
 * @param {{table: Object, definitions: Object, schema: Object, collisions?: string[]}} subject
 * @returns {{findings: Object<string, string[]>, summary: string[], report: string[]}}
 */
export function run({
    table, definitions, schema, collisions = [],
}) {
    /** Relational when the definitions say so; an unknown name is relational by the same default
     *  the builder applies when it resolves an inverse path. */
    const isRelational = (predicate) => (definitions[predicate]
        ? (definitions[predicate].placement || 'edges') === 'edges'
        : true);

    const { pairs: schemaPairs } = schemaEdgeDeclarations(schema);

    const findings = {
        'NO-INVERSE': [],
        'NOT-INVOLUTIVE': [],
        'INVERSE-UNDECLARED': [],
    };

    // ---- involution, from the definitions ----
    const inverseOf = ((predicate) => definitions[predicate]?.inverse || null);
    Object.keys(definitions).forEach((predicate) => {
        if (!isRelational(predicate)) return;
        const inverse = inverseOf(predicate);
        if (!inverse) return;
        const back = inverseOf(inverse);
        if (isRelational(inverse) && back && back !== predicate) {
            findings['NOT-INVOLUTIVE'].push(`${predicate} -> ${inverse} -> ${back}`);
        }
    });

    // ---- the reverse each table row resolves to ----
    const rows = new Set();
    Object.entries(table).forEach(([domain, partitions]) => {
        Object.values(partitions.edges || {}).forEach((entry) => {
            const [, verb] = entry.path.split('.');
            const key = `${domain} ${verb}`;
            if (rows.has(key)) return;
            rows.add(key);

            const reverse = entry.inverseEdge;
            if (!reverse?.path) {
                findings['NO-INVERSE'].push(`${verb} (on ${domain}) — no reverse edge is written`);
                return;
            }

            // Only a reverse that lands in the edges bucket is a (verb, range) pair the schema
            // declares; an intrinsic reverse is a named property, declared per entity instead.
            if (reverse.bucket !== 'edges') return;

            const [, inversePredicate] = reverse.path.split('.');
            if (!schemaPairs.has(`${inversePredicate}.${domain}`)) {
                findings['INVERSE-UNDECLARED'].push(`${inversePredicate}.${domain} `
                    + `(the reverse of ${domain} ${verb})`);
            }
        });
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
        summary: [`${rows.size} (entityType, verb) pairs a consumer could write a reverse for`],
        report,
    };
}
