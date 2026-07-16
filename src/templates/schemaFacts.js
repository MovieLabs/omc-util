/**
 * Structural facts derived from a bundled OMC JSON Schema.
 *
 * The JSON Schema is the ground truth for cardinality. The hand-authored edge and
 * entity templates deliberately do NOT restate it — a second copy would drift, which
 * is exactly what this module exists to prevent. Everything here is computed from the
 * schema at build time, so a schema change flows through without anyone editing a list.
 *
 * @module schemaFacts
 */

import { isCapitalized } from '../mlHelpers/util.js';

/** Bound on recursion into a property subtree. The schema is finite and shallow;
 *  this only guards against a `$ref` cycle introduced by a future schema. */
const MAX_DEPTH = 12;

const isObject = ((v) => !!v && typeof v === 'object' && !Array.isArray(v));

/**
 * Resolve a local JSON-Pointer `$ref` (`#/a/b/c`) against the root schema.
 * Only local refs are supported — the bundled schemas contain no remote refs.
 *
 * @param {object} root - The whole schema document
 * @param {string} ref - e.g. `#/$defs/Utility/properties/annotation`
 * @returns {object|null}
 */
function resolveRef(root, ref) {
    if (typeof ref !== 'string' || !ref.startsWith('#/')) return null;
    return ref
        .slice(2)
        .split('/')
        .reduce((node, segment) => {
            if (!isObject(node)) return null;
            // JSON-Pointer escaping: ~1 => '/', ~0 => '~'
            const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
            return node[key] ?? null;
        }, root);
}

/**
 * Walk one property node, recording any `maxItems` it declares, then descend.
 *
 * `items.anyOf` is deliberately NOT followed: inside an array's `items` the schema
 * lists the permitted *target entity types* of a reference (`#/$defs/core/properties/
 * reference`, `#/$defs/Asset/properties/AssetStructure`, ...). Following those would
 * walk into unrelated entity definitions and recurse without end. Cardinality of the
 * reference itself lives on the array node, which we have already read here.
 */
function walkProperty({
    root, node, entityType, path, out, depth, seenRefs,
}) {
    if (!isObject(node) || depth > MAX_DEPTH) return;

    if (node.$ref) {
        // A property alias (e.g. `slugline: { $ref: '.../annotation' }`). Follow it so
        // the alias inherits the target's constraints, guarding against ref cycles.
        if (seenRefs.has(node.$ref)) return;
        const target = resolveRef(root, node.$ref);
        if (target) {
            walkProperty({
                root, node: target, entityType, path, out, depth: depth + 1, seenRefs: new Set([...seenRefs, node.$ref]),
            });
        }
        return;
    }

    if (typeof node.maxItems === 'number' && path) {
        out.set(`${entityType}:${path}`, node.maxItems);
    }

    if (isObject(node.properties)) {
        Object.entries(node.properties).forEach(([key, child]) => walkProperty({
            root, node: child, entityType, path: path ? `${path}.${key}` : key, out, depth: depth + 1, seenRefs,
        }));
    }

    // Descend through an array's element shape WITHOUT extending the path: our path
    // convention addresses the property, not the element index. This lets a nested
    // array inside an array element still be found.
    if (isObject(node.items) && !node.items.anyOf) {
        walkProperty({
            root, node: node.items, entityType, path, out, depth: depth + 1, seenRefs,
        });
    }
}

/**
 * Index every `maxItems` constraint in a schema, keyed `EntityType:dot.path`.
 *
 * Entity definitions live at `$defs/<schemaGroup>/properties/<EntityType>`, so every
 * group is scanned and each entity found is walked. The group name is not needed by
 * callers — the key is the entity type.
 *
 * Only capitalised keys are treated as entity types, matching the convention the rest
 * of the library uses to enumerate entities (see `allEntityTypes` in ./index.js). This
 * skips `$defs/core`'s structural nodes — `rootObject` (the document envelope, whose
 * properties are the entity types themselves and would otherwise duplicate every
 * constraint under a bogus `rootObject:` key), plus `reference`, `baseEntity`,
 * `collectionObject` and `edges`.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {Map<string, number>} e.g. `'Asset:AssetStructure' => 1`
 *
 * @example
 * const index = buildMaxItemsIndex(schemav30);
 * index.get('Asset:AssetStructure');            // 1
 * index.get('Provenance:CreatedBy');            // 1
 * index.get('Asset:versionInfo.DerivationOf');  // 1
 * index.get('Asset:Member');                    // undefined — uncapped
 */
export function buildMaxItemsIndex(schema) {
    const out = new Map();
    const defs = schema?.$defs;
    if (!isObject(defs)) return out;

    Object.values(defs).forEach((group) => {
        if (!isObject(group?.properties)) return;
        Object.entries(group.properties).forEach(([entityType, entityDef]) => {
            if (!isCapitalized(entityType) || !isObject(entityDef?.properties)) return;
            Object.entries(entityDef.properties).forEach(([key, child]) => walkProperty({
                root: schema, node: child, entityType, path: key, out, depth: 0, seenRefs: new Set(),
            }));
        });
    });

    return out;
}

/**
 * Return a copy of an entity shape template with `$maxItems` stamped onto every array
 * node the schema caps.
 *
 * Always copies rather than mutating: sub-templates are shared object references across
 * entities (e.g. a common `note` shape reused by several parents), so writing `$maxItems`
 * in place would leak one parent's cap onto every other property sharing that object.
 *
 * Shape conventions (see the v3-0 entity templates):
 *   - array  → `{ $type: 'array', $items?: … }`
 *   - scalar → `{ $type: 'string' }`
 *   - object → a plain object with no `$type`, whose keys are its children
 *
 * `$items` is descended WITHOUT extending the path, matching how buildMaxItemsIndex
 * walks the schema's `items`: the path addresses the property, not an element index.
 *
 * @param {object} template - The entity's shape template
 * @param {string} entityType - Used to key into the index
 * @param {Map<string, number>} index - From {@link buildMaxItemsIndex}
 * @returns {object} A stamped copy; the input is left untouched
 */
export function stampMaxItems(template, entityType, index, path = '', depth = 0) {
    if (!isObject(template) || depth > MAX_DEPTH) return template;

    const out = {};
    Object.entries(template).forEach(([key, node]) => {
        if (key.startsWith('$')) {
            out[key] = node;
            return;
        }
        const childPath = path ? `${path}.${key}` : key;
        if (!isObject(node)) {
            out[key] = node;
            return;
        }

        if (node.$type === 'array') {
            const cap = index.get(`${entityType}:${childPath}`);
            out[key] = {
                ...node,
                ...(typeof cap === 'number' ? { $maxItems: cap } : {}),
                // Element shape: keep the same path — `$items` describes the element, and
                // the schema index addresses the property, not the index within it.
                ...(isObject(node.$items)
                    ? { $items: stampMaxItems(node.$items, entityType, index, childPath, depth + 1) }
                    : {}),
            };
            return;
        }

        if (node.$type) {
            out[key] = node; // scalar leaf
            return;
        }

        out[key] = stampMaxItems(node, entityType, index, childPath, depth + 1);
    });

    return out;
}

export default { buildMaxItemsIndex, stampMaxItems };
