/**
 * @module buildEdgeTable
 *
 * DRAFT — not yet wired into the live `entityTemplate` build.
 *
 * Expands the consolidated `edgeDefinitions` (edges.js) into the legacy
 * `edgeTable` shape — `{ intrinsic, edges, cxtEdges }` per entityType — so the
 * output can be diffed against the pre-refactor snapshot before anything is
 * switched over. This is the eventual replacement for `buildEdges` in index.js.
 *
 * Keying rule: every entry is keyed by its full storage `path` (unique within an
 * entity+partition). The legacy flattener keyed by the last path segment (the range
 * type), but that cannot represent two predicates to the same range — e.g. a nested
 * Context needs both edges.hasCxt.Context and edges.cxtFor.Context. Path keying avoids
 * that collision; the live cutover will adopt a predicate-qualified key accordingly.
 *
 * Per-range vs per-property entries:
 *   - When the path embeds {range} (placement 'edges', or a pathTemplate with
 *     {range}) one entry is emitted per (domain, range), allowed = [range].
 *   - When the path is constant for the group (intrinsic property) one entry is
 *     emitted per domain, allowed = the whole group's range list.
 *
 * cxtEdges generation is deferred to a later phase, so the cxtEdges partition is
 * returned empty here.
 */

import { edgeDefinitions, tentativeRdf } from './edges.js';

/**
 * Resolve an inverse predicate NAME to the inverse PATH on the target entity.
 * `originDomain` (the source type of the forward edge) becomes the last segment
 * of an `edges.<inv>.<originDomain>` reverse path.
 */
const resolveInversePath = (invName, originDomain) => {
    if (!invName) return null;
    const invDef = edgeDefinitions[invName];
    const invPlacement = invDef ? invDef.placement || 'edges' : 'edges';
    if (invPlacement === 'edges') return `edges.${invName}.${originDomain}`;
    // intrinsic inverse: the reverse reference lives at a named property
    return (invDef && invDef.path) || invName;
};

const pathDependsOnRange = (placement, template) =>
    placement === 'edges' || (!!template && template.includes('{range}'));

const computePath = (placement, pred, range, group, def) => {
    if (placement === 'edges') return `edges.${pred}.${range}`;
    if (group.path) return group.path;
    if (def.path) return def.path;
    const template = group.pathTemplate || def.pathTemplate;
    if (template) return template.replace('{predicate}', pred).replace('{range}', range);
    return pred;
};

/**
 * @returns {{ table: Object, collisions: Array<string> }} The generated per-entity
 * edgeTable plus any same-key collisions detected during expansion.
 */
export function buildEdgeTable() {
    const table = {};
    const collisions = [];

    const ensure = (entity) => {
        table[entity] = table[entity] || { intrinsic: {}, edges: {}, cxtEdges: {} };
        return table[entity];
    };

    const add = (entity, partition, key, entry) => {
        const part = ensure(entity)[partition];
        if (part[key]) {
            collisions.push(`${entity}.${partition}.${key} (${part[key].path} vs ${entry.path})`);
        }
        part[key] = entry;
    };

    for (const [pred, def] of Object.entries(edgeDefinitions)) {
        const placement = def.placement || 'edges';
        const partition = placement === 'edges' ? 'edges' : 'intrinsic';
        const rdf = typeof def.rdf === 'function' ? def.rdf : tentativeRdf;

        for (const group of def.connects) {
            const groupInverse = Object.hasOwn(group, 'inverse') ? group.inverse : def.inverse;
            const template = group.pathTemplate || def.pathTemplate;

            if (pathDependsOnRange(placement, template)) {
                // one entry per (domain, range), keyed by the range/target type
                group.domain.forEach((domain) => group.range.forEach((range) => {
                    const path = computePath(placement, pred, range, group, def);
                    add(domain, partition, path, {
                        predicate: def.predicate,
                        allowed: [range],
                        path,
                        type: def.cardinality,
                        inverse: resolveInversePath(groupInverse, domain),
                        inversePath: resolveInversePath(groupInverse, domain),
                        omcPredicate: rdf({ domain, predicate: pred, range }),
                        rdfMap: group.rdfMap || [],
                    });
                }));
            } else {
                // constant path: one entry per domain, allowed = the whole group range
                group.domain.forEach((domain) => {
                    const path = computePath(placement, pred, group.range[0], group, def);
                    add(domain, partition, path, {
                        predicate: def.predicate,
                        allowed: [...group.range],
                        path,
                        type: def.cardinality,
                        inverse: resolveInversePath(groupInverse, domain),
                        inversePath: resolveInversePath(groupInverse, domain),
                        omcPredicate: rdf({ domain, predicate: pred, range: group.range[0] }),
                        rdfMap: group.rdfMap || [],
                    });
                });
            }
        }
    }

    // ---- Second pass: Context-mediated cxtEdges, per subject A ----
    // cxtEdges[A] = the back-edge (C --cxtFor--> A) plus A's forward relational
    // edges re-homed on the Context, each with its inverse re-pointed at the
    // Context (right-side inheritance):  (C) --P--> B  and  (B) --inv(P)--> C.
    // The context-attachment edges (hasCxt/cxtFor) are not themselves inherited.
    const CONTEXT = 'Context';
    const cxtForRdf = typeof edgeDefinitions.cxtFor?.rdf === 'function'
        ? edgeDefinitions.cxtFor.rdf
        : tentativeRdf;
    const cxtForRdfMap = edgeDefinitions.cxtFor?.connects?.[0]?.rdfMap || [];
    const predicateOf = (path) => (path.startsWith('edges.') ? path.split('.')[1] : null);
    const repointInverse = (inverse) => {
        if (!inverse || !inverse.startsWith('edges.')) return inverse; // null or intrinsic — unchanged
        const parts = inverse.split('.');
        parts[parts.length - 1] = CONTEXT;
        return parts.join('.');
    };

    Object.keys(table).forEach((subject) => {
        // Only subjects that can carry a Context (the domains of hasCxt) get a projection
        if (!table[subject].edges[`edges.hasCxt.${CONTEXT}`]) return;
        const cxt = table[subject].cxtEdges;

        // Left back-edge: the Context refers back to its subject
        cxt[`edges.cxtFor.${subject}`] = {
            predicate: 'cxtFor',
            allowed: [subject],
            path: `edges.cxtFor.${subject}`,
            type: 'array',
            inverse: `edges.hasCxt.${CONTEXT}`,
            inversePath: `edges.hasCxt.${CONTEXT}`,
            omcPredicate: cxtForRdf({ domain: CONTEXT, predicate: 'cxtFor', range: subject }),
            rdfMap: cxtForRdfMap,
        };

        // Right-side inheritance: A's forward relational edges, re-homed on the
        // Context with the inverse re-pointed at the Context
        Object.values(table[subject].edges).forEach((edge) => {
            const pred = predicateOf(edge.path);
            if (pred === 'hasCxt' || pred === 'cxtFor') return;
            cxt[edge.path] = {
                predicate: edge.predicate,
                allowed: [...edge.allowed],
                path: edge.path,
                type: edge.type,
                inverse: repointInverse(edge.inverse),
                inversePath: repointInverse(edge.inverse),
                omcPredicate: edge.omcPredicate,
                rdfMap: [...(edge.rdfMap || [])],
            };
        });
    });

    return { table, collisions };
}
