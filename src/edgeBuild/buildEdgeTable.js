/**
 * Expands the Edge Editor's published `edgeDefinitions` into the `edgeTable` shape omc-util ships —
 * `{ intrinsic, edges, cxtEdges }` per entityType.
 *
 * Keying rule: every entry is keyed by its full storage `path`, which is unique within an
 * entity and partition. Keying by the range type cannot represent two predicates to one range.
 *
 * Per-range vs per-property entries:
 *   - When the path embeds {range} (placement 'edges', or a pathTemplate with {range}) one entry is
 *     emitted per (domain, range), allowed = [range].
 *   - When the path is constant for the group (an intrinsic property) one entry is emitted per
 *     domain, allowed = the whole group's range list.
 *
 * `cxtEdges` is always empty: it is a v2.8 partition, and v3.0 carries edges on the entity. The
 * shape keeps it because omc-util's readers expect all three partitions.
 *
 * Each entry carries pre-decomposed path fields (`bucket`, `pathSegments`, `containerSegments`,
 * `relativePath`) so consumers never do string surgery on `path`, `maxItems` from the JSON Schema,
 * and `inverseEdge` saying where the reverse reference goes. `type` is the storage shape and is
 * always `'array'` in v3.0 — it is NOT a cardinality cap; `maxItems` is.
 *
 * @module edgeBuild/buildEdgeTable
 * @ignore
 */

import { tentativeRdf } from './definitions.js';

/**
 * Resolve an inverse predicate NAME to the inverse PATH on the target entity.
 *
 * The reverse is an edge in its own right, on the target and pointing back here, so it is read from
 * the inverse predicate's own `connects` group — the one whose domain is the target and whose range
 * is this edge's domain. Placement and path both belong to that group: `has` is `edges` for some of
 * its pairings and a named property for others, so a reverse resolved from the definition alone
 * lands in the wrong bucket for the rest.
 *
 * @param {Object} definitions - The edge definitions the inverse is looked up in
 * @param {string|null} invName - The inverse predicate name
 * @param {string} originDomain - The source type of the forward edge, which is the reverse's range
 * @param {string} targetType - The type the forward edge points at, which carries the reverse
 * @returns {string|null} The inverse storage path
 */
const resolveInversePath = (definitions, invName, originDomain, targetType) => {
    if (!invName) return null;
    const invDef = definitions[invName];
    if (!invDef) return `edges.${invName}.${originDomain}`;

    const group = (invDef.connects || []).find((candidate) => (candidate.domain || []).includes(targetType)
        && (candidate.range || []).includes(originDomain));
    const placement = group?.placement || invDef.placement || 'edges';
    if (placement === 'edges') return `edges.${invName}.${originDomain}`;

    // An intrinsic reverse lives at a named property, stated by its group where the nesting differs
    // per type — a structure's member list is `<type>Properties.<type>Group.Member`.
    const template = group?.pathTemplate ?? invDef.pathTemplate;
    if (group?.path) return group.path;
    if (template) return template.replace('{predicate}', invName).replace('{range}', originDomain);
    return invDef.path || invName;
};

/**
 * Pre-decompose a storage path so consumers never split/slice it themselves.
 *
 * @param {string} path - Full storage path, e.g. `edges.usedIn.Asset` or `AssetStructure`
 * @param {'edges'|'intrinsic'} bucket
 * @returns {{bucket: string, pathSegments: string[], containerSegments: string[], relativePath: string}}
 */
const decomposePath = (path, bucket) => {
    const pathSegments = String(path).split('.');
    return {
        bucket,
        pathSegments,
        containerSegments: pathSegments.slice(0, -1),
        relativePath: bucket === 'edges' && pathSegments[0] === 'edges'
            ? pathSegments.slice(1).join('.')
            : path,
    };
};

/**
 * The inverse as an edge rather than a name: where the reverse reference is written on the target,
 * decomposed the same way a forward path is. `maxItems` is the cap on the target's slot, known only
 * once the target's rows exist, so it arrives in the second pass.
 *
 * @param {string|null} inversePath
 * @param {number|undefined} [maxItems]
 * @returns {Object|null}
 */
const inverseEdgeOf = ((inversePath, maxItems) => {
    if (!inversePath) return null;
    const bucket = inversePath.startsWith('edges.') ? 'edges' : 'intrinsic';
    const decomposed = decomposePath(inversePath, bucket);
    return {
        // An edges path is named by its verb; an intrinsic one by the property it ends in.
        predicate: bucket === 'edges' ? decomposed.pathSegments[1] : decomposed.pathSegments.at(-1),
        path: inversePath,
        ...decomposed,
        maxItems,
    };
});

/** Every v3.0 reference is stored as an array, intrinsic or not. Not a cardinality cap. */
const STORAGE_TYPE = 'array';

const PARTITION_NAMES = ['intrinsic', 'edges', 'cxtEdges'];

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
 * @param {Object} edgeDefinitions - Definitions as `definitionsFrom` returns them
 * @param {Map<string, number>} maxItemsIndex - From `buildMaxItemsIndex(schema)`
 * @returns {{ table: Object, collisions: Array<string> }} The per-entity edge table, and any two
 *   definitions that claimed one storage path
 */
export function buildEdgeTable(edgeDefinitions, maxItemsIndex) {
    const table = {};
    const collisions = [];

    // `undefined` means uncapped. `edges.*` paths are not schema properties and always miss.
    const maxItemsFor = (domain, path) => maxItemsIndex.get(`${domain}:${path}`);

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
        const rdf = typeof def.rdf === 'function' ? def.rdf : tentativeRdf;

        for (const group of def.connects) {
            // Placement belongs to the pairing, stated by the group where it differs from the
            // predicate's usual one, exactly as it states a path.
            const placement = group.placement || def.placement || 'edges';
            const partition = placement === 'edges' ? 'edges' : 'intrinsic';
            const groupInverse = Object.hasOwn(group, 'inverse') ? group.inverse : def.inverse;
            const template = group.pathTemplate || def.pathTemplate;
            const inversePath = ((domain, target) => resolveInversePath(edgeDefinitions, groupInverse, domain, target));

            if (pathDependsOnRange(placement, template)) {
                group.domain.forEach((domain) => group.range.forEach((range) => {
                    const path = computePath(placement, pred, range, group, def);
                    add(domain, partition, path, {
                        predicate: def.predicate,
                        allowed: [range],
                        path,
                        type: STORAGE_TYPE,
                        maxItems: maxItemsFor(domain, path),
                        ...decomposePath(path, partition),
                        inverseEdge: inverseEdgeOf(inversePath(domain, range)),
                        omcPredicate: rdf({ domain, predicate: pred, range }),
                    });
                }));
            } else {
                group.domain.forEach((domain) => {
                    const path = computePath(placement, pred, group.range[0], group, def);
                    add(domain, partition, path, {
                        predicate: def.predicate,
                        allowed: [...group.range],
                        path,
                        type: STORAGE_TYPE,
                        maxItems: maxItemsFor(domain, path),
                        ...decomposePath(path, partition),
                        inverseEdge: inverseEdgeOf(inversePath(domain, group.range[0])),
                        omcPredicate: rdf({ domain, predicate: pred, range: group.range[0] }),
                    });
                });
            }
        }
    }

    // ---- Second pass: the cap on each reverse slot ----
    // How many references the reverse admits is a schema fact about the TARGET's row, so it is only
    // knowable once every row exists.
    const rowsOn = (target) => ['intrinsic', 'edges']
        .flatMap((part) => Object.values(table[target]?.[part] || {}));

    Object.values(table).forEach((partitions) => {
        PARTITION_NAMES.forEach((partition) => {
            Object.values(partitions[partition] || {}).forEach((entry) => {
                const reverse = entry.inverseEdge;
                if (!reverse) return;
                const target = (entry.allowed || [])
                    .map((type) => rowsOn(type).find((row) => row.path === reverse.path))
                    .find(Boolean);
                if (target) entry.inverseEdge = inverseEdgeOf(reverse.path, target.maxItems);
            });
        });
    });

    return { table, collisions };
}
