/**
 * Layout-independent derivation of OMC shape facts from a bundled JSON Schema.
 *
 * `schemaFacts.js` reads the current (hand-grouped) v3.0 schema by assuming its
 * `$defs/<Bucket>/properties/<Entity>` layout. That assumption does not hold for the
 * LinkML-generated schema, which is flat (`$defs/<Entity>`), alphabetised, inlines its
 * base classes instead of composing them with `allOf`, and marks the entity
 * discriminator with a single-value `enum` rather than `const`. This module reads either
 * shape through one code path by resolving `$ref`s literally, merging `allOf`, and
 * detecting entities by their `entityType` discriminator rather than by position.
 *
 * It derives only what a validation schema actually asserts: the entity list, property
 * shapes, cardinality caps, and the identifier/reference required fields. Edge target
 * lists, RDF edge semantics, presentation, idPrefix, group names and GraphQL fragments
 * are not in the schema and stay hand-authored elsewhere.
 *
 * @module schemaDerive
 */

import { isCapitalized } from '../mlHelpers/util.js';

/** Bound on recursion into a property subtree; guards against a future `$ref` cycle. */
const MAX_DEPTH = 12;

/** Fallback node colour for a synthesised presentation. */
const FALLBACK_COLOR = '#E0E0E0';

const isObject = ((v) => !!v && typeof v === 'object' && !Array.isArray(v));

/**
 * Resolve a local JSON-Pointer `$ref` (`#/a/b/c`) against the root schema. Only local
 * refs are supported — the bundled schemas contain no remote refs.
 *
 * @param {object} root - The whole schema document
 * @param {string} ref - e.g. `#/$defs/Identifier`
 * @returns {object|null}
 */
export function resolveRef(root, ref) {
    if (typeof ref !== 'string' || !ref.startsWith('#/')) return null;
    return ref
        .slice(2)
        .split('/')
        .reduce((node, segment) => {
            if (!isObject(node)) return null;
            const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
            return node[key] ?? null;
        }, root);
}

/**
 * Fold any `allOf` composition into a single node whose `properties` and `required`
 * combine every member's, with the node's own properties taking precedence. A no-op when
 * there is no `allOf` (the LinkML schema inlines base fields instead).
 *
 * @param {object} root - The whole schema document
 * @param {object} node - The node to flatten
 * @param {Set<string>} [seen] - Guards against `$ref` cycles through `allOf`
 * @returns {object}
 */
export function mergeAllOf(root, node, seen = new Set()) {
    if (!isObject(node) || !Array.isArray(node.allOf)) return node;

    const properties = {};
    const required = [];
    node.allOf.forEach((member) => {
        let m = member;
        if (isObject(m) && m.$ref) {
            if (seen.has(m.$ref)) return;
            m = mergeAllOf(root, resolveRef(root, m.$ref), new Set([...seen, m.$ref]));
        } else {
            m = mergeAllOf(root, m, seen);
        }
        if (!isObject(m)) return;
        Object.assign(properties, m.properties || {});
        if (Array.isArray(m.required)) required.push(...m.required);
    });

    Object.assign(properties, node.properties || {}); // own properties win
    if (Array.isArray(node.required)) required.push(...node.required);

    const merged = { ...node, properties, required };
    delete merged.allOf;
    return merged;
}

/**
 * The entity type a definition declares, or null if it is not an entity. Reads the
 * discriminator as either `const` (current schema) or a single-value `enum` (LinkML).
 *
 * @param {object} def - A schema definition node
 * @returns {string|null}
 */
export function discriminatorValue(def) {
    const et = def?.properties?.entityType;
    if (!isObject(et)) return null;
    if (typeof et.const === 'string') return et.const;
    if (Array.isArray(et.enum) && typeof et.enum[0] === 'string') return et.enum[0];
    // A renamed entity expresses entityType as a oneOf/anyOf of const branches — a
    // deprecated old name plus the current one. Take the non-deprecated const.
    const branches = et.oneOf || et.anyOf;
    if (Array.isArray(branches)) {
        const live = branches.find((b) => isObject(b) && !b.deprecated && typeof b.const === 'string')
            || branches.find((b) => isObject(b) && typeof b.const === 'string');
        if (live) return live.const;
    }
    return null;
}

/**
 * Every node that some `$ref` in the document points at (by object identity). An abstract
 * base class carries a discriminator but is referenced by nothing; a concrete entity is
 * always referenced — as an edge target, a nested value, or from the document root.
 */
function referencedNodes(schema) {
    const targets = new Set();
    const visit = (node) => {
        if (Array.isArray(node)) {
            node.forEach(visit);
            return;
        }
        if (!isObject(node)) return;
        if (typeof node.$ref === 'string') {
            const t = resolveRef(schema, node.$ref);
            if (t) targets.add(t);
        }
        Object.values(node).forEach(visit);
    };
    visit(schema);
    return targets;
}

/**
 * Every entity definition in a schema, keyed by entity type.
 *
 * Detects entities by their discriminator, so it finds them whether they sit flat at
 * `$defs/<Entity>` (LinkML) or nested at `$defs/<Bucket>/properties/<Entity>` (current).
 * Both levels are scanned; a bucket node carries no discriminator and is skipped. A
 * discriminated node that nothing references is an abstract base (e.g. LinkML's `Entity`)
 * and is dropped.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {Map<string, object>} entityType → its definition node
 */
export function listEntities(schema) {
    const out = new Map();
    const defs = schema?.$defs;
    if (!isObject(defs)) return out;

    const referenced = referencedNodes(schema);
    const consider = (def) => {
        if (def?.deprecated === true) return; // skip deprecated entities (schema self-documents)
        const et = discriminatorValue(def);
        if (!et || !isCapitalized(et) || out.has(et)) return;
        // Keep only referenced defs when the document uses refs at all; a discriminated
        // node referenced by nothing is an abstract base, not an instantiable entity.
        if (referenced.size && !referenced.has(def)) return;
        out.set(et, def);
    };

    Object.values(defs).forEach((def) => {
        if (!isObject(def)) return;
        consider(def);
        if (isObject(def.properties)) Object.values(def.properties).forEach(consider);
    });

    return out;
}

/**
 * Walk one property node, recording any `maxItems` it declares, then descend.
 *
 * `items.anyOf` is not followed — inside an array's `items` the schema lists the permitted
 * target entity types of a reference, not a data shape, and the cardinality of the
 * reference itself sits on the array node already read here. A property-level `anyOf`
 * (the LinkML `[{ $ref }, { type: null }]` nullable idiom) IS followed, so a `$ref`d
 * single-object property still contributes its nested caps.
 */
function walkProperty({
    root, node, entityType, path, out, depth, seenRefs,
}) {
    if (!isObject(node) || depth > MAX_DEPTH || node.deprecated === true) return;

    if (node.$ref) {
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

    if (isObject(node.items) && !node.items.anyOf) {
        walkProperty({
            root, node: node.items, entityType, path, out, depth: depth + 1, seenRefs,
        });
    }

    if (Array.isArray(node.anyOf)) {
        node.anyOf.forEach((sub) => {
            if (isObject(sub) && sub.type !== 'null') {
                walkProperty({
                    root, node: sub, entityType, path, out, depth: depth + 1, seenRefs,
                });
            }
        });
    }
}

/**
 * Index every `maxItems` constraint in a schema, keyed `EntityType:dot.path`.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {Map<string, number>} e.g. `'Asset:AssetStructure' => 1`
 */
export function cardinalityIndex(schema) {
    const out = new Map();
    listEntities(schema).forEach((def, entityType) => {
        const merged = mergeAllOf(schema, def);
        if (!isObject(merged.properties)) return;
        Object.entries(merged.properties).forEach(([key, child]) => walkProperty({
            root: schema, node: child, entityType, path: key, out, depth: 0, seenRefs: new Set(),
        }));
    });
    return out;
}

/**
 * The single scalar of a `type` that may be a `['string','null']` union. An `enum` with
 * no explicit `type` (e.g. a controlled-value or version field) is a string.
 */
const scalarType = ((node) => {
    if (Array.isArray(node.type)) return node.type.find((t) => t !== 'null');
    if (node.type) return node.type;
    if (Array.isArray(node.enum) && node.enum.every((v) => typeof v === 'string')) return 'string';
    return undefined;
});

/**
 * The controlled-vocabulary values a node declares via the `x-controlledValues` schema
 * extension, as a `{ $controlledValues }` fragment to spread onto a shape (empty when
 * absent). Present only in the formal schema; surfaced here so consumers get it too.
 */
const controlledValues = ((node) => (
    Array.isArray(node['x-controlledValues']) ? { $controlledValues: [...node['x-controlledValues']] } : {}
));

/**
 * Derive an entity shape template (`{ $type, $items, $maxItems, $default, $required,
 * $controlledValues }`) from a schema node, in the same convention the hand-authored
 * templates use: scalars are
 * `{ $type: 'string' }`, arrays `{ $type: 'array', $items? }`, objects a plain map of
 * children, and a relationship array (whose `items` is an `anyOf` of reference/target)
 * is a bare `{ $type: 'array' }` with no `$items`.
 */
function deriveShape(root, node, depth, seenRefs) {
    if (!isObject(node) || depth > MAX_DEPTH || node.deprecated === true) return null;

    if (node.$ref) {
        if (seenRefs.has(node.$ref)) return null;
        return deriveShape(root, resolveRef(root, node.$ref), depth + 1, new Set([...seenRefs, node.$ref]));
    }

    if (Array.isArray(node.anyOf)) {
        const sub = node.anyOf.find((s) => isObject(s) && s.type !== 'null' && s.$ref !== '#/$defs/Any' && !s.deprecated);
        if (sub) {
            const carried = node.default !== undefined ? { ...sub, default: node.default } : sub;
            return deriveShape(root, carried, depth + 1, seenRefs);
        }
    }

    // `oneOf` type-unions are intentionally NOT unwrapped: there is no single shape for a
    // property that is genuinely one-of-several types, so such a leaf is omitted rather
    // than guessed. A property whose ONLY typing is a oneOf therefore does not appear in
    // the derived shape.
    //
    // The exception is the nullable idiom — `oneOf: [{ type: 'null' }, X]` — which is not a
    // union at all, just "X, or absent". There is exactly one shape there, so it is
    // unwrapped; leaving it out hides real properties from consumers (`customData` in v3.0,
    // which is precisely the property to reach for when the formal schema lacks one).
    if (Array.isArray(node.oneOf)) {
        const branches = node.oneOf.filter((s) => isObject(s) && !s.deprecated);
        const nonNull = branches.filter((s) => s.type !== 'null');
        if (branches.length - nonNull.length === 1 && nonNull.length === 1) {
            const carried = node.default !== undefined ? { ...nonNull[0], default: node.default } : nonNull[0];
            return deriveShape(root, carried, depth + 1, seenRefs);
        }
    }

    // A `const` (or a single-value `enum`, LinkML's discriminator form) fixes the value —
    // e.g. `entityType`. Emit it as a scalar whose `$default` is that fixed value, so a
    // consumer creating a new entity can seed it.
    const fixed = node.const ?? (Array.isArray(node.enum) && node.enum.length === 1 ? node.enum[0] : undefined);
    if (fixed !== undefined && !isObject(node.properties)) {
        return { $type: typeof fixed === 'number' ? 'number' : 'string', $default: fixed, ...controlledValues(node) };
    }

    const t = scalarType(node);

    if (t === 'array') {
        const shape = { $type: 'array' };
        if (typeof node.maxItems === 'number') shape.$maxItems = node.maxItems;
        if (node.default !== undefined) shape.$default = node.default;
        // A relationship array's items list target types via anyOf — that is an edge, not a
        // data shape, so leave $items off (matching the hand-authored `{ $type: 'array' }`).
        if (isObject(node.items) && !node.items.anyOf) {
            const el = deriveShape(root, node.items, depth + 1, seenRefs);
            if (el) shape.$items = el;
        }
        return shape;
    }

    const merged = mergeAllOf(root, node);
    if (t === 'object' || isObject(merged.properties)) {
        if (!isObject(merged.properties)) return { $type: 'object' };
        const required = new Set(Array.isArray(merged.required) ? merged.required : []);
        const out = {};
        Object.entries(merged.properties).forEach(([key, child]) => {
            const c = deriveShape(root, child, depth + 1, seenRefs);
            if (!c) return;
            // Mark schema-required children inline (like `$maxItems`), so a consumer building
            // a new entity knows which properties it must supply (and can seed them from
            // `$default` where present).
            out[key] = required.has(key) ? { ...c, $required: true } : c;
        });
        return out;
    }

    if (t) {
        const shape = { $type: t };
        if (node.default !== undefined) shape.$default = node.default;
        return { ...shape, ...controlledValues(node) };
    }

    return null;
}

/**
 * Top-level entity properties intentionally kept OUT of the derived shape.
 *
 * SPECIAL CASE — revisit. This is a deliberate, hand-maintained exception to the module's
 * "derive whatever the schema asserts" rule, so it is isolated here and named. Currently:
 *   - `instanceInfo`: an OMC-implementation-specific, Beta placeholder that no consumer
 *     uses yet, and whose timestamp fields are typed with `oneOf` (which the engine does
 *     not unwrap), so it can only ever derive partially. Rather than surface a half-formed
 *     shape it is omitted entirely. Remove this once instanceInfo is modelled consistently
 *     (including in the LinkML schema) and actually consumed.
 */
const SHAPE_EXCLUDED_PROPERTIES = new Set(['instanceInfo']);

/**
 * The derived shape template for one entity definition.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @param {object} entityDef - An entity definition (from {@link listEntities})
 * @returns {object}
 */
export function entityShape(schema, entityDef) {
    const shape = deriveShape(schema, entityDef, 0, new Set()) || {};
    SHAPE_EXCLUDED_PROPERTIES.forEach((key) => {
        delete shape[key];
    });
    return shape;
}

/**
 * Find the identifier object — the one with `identifierScope` and `identifierValue`
 * properties — wherever it lives (an inline array item in the current schema, a named
 * `Identifier` class in LinkML).
 */
function findIdentifierObject(schema) {
    const defs = schema?.$defs;
    if (!isObject(defs)) return null;
    let found = null;
    const visit = (node, depth) => {
        if (found || !isObject(node) || depth > MAX_DEPTH) return;
        const p = node.properties;
        if (isObject(p) && p.identifierScope && p.identifierValue) {
            found = node;
            return;
        }
        if (isObject(p)) Object.values(p).forEach((c) => visit(c, depth + 1));
        if (isObject(node.items)) visit(node.items, depth + 1);
    };
    Object.values(defs).forEach((d) => visit(d, 0));
    return found;
}

/**
 * The identifier fields the schema marks as required on an entity reference.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {string[]} e.g. `['identifierScope', 'identifierValue']`; `[]` if undeclared
 */
export function requiredFields(schema) {
    const idObj = findIdentifierObject(schema);
    return Array.isArray(idObj?.required) ? [...idObj.required] : [];
}

/**
 * The reference shape (`{ identifier: [ … ] }`) as the schema declares it, with the
 * required identifier fields marked `$required`.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {object|null}
 */
export function referenceShape(schema) {
    const idObj = findIdentifierObject(schema);
    if (!isObject(idObj?.properties)) return null;
    const required = new Set(requiredFields(schema));
    const items = Object.fromEntries(Object.entries(idObj.properties).map(([key, node]) => {
        const field = { $type: scalarType(node) || 'string' };
        if (required.has(key)) field.$required = true;
        return [key, field];
    }));
    return { identifier: { $type: 'array', $items: items } };
}

/**
 * Synthesise a generic presentation for a schema-known entity that has no hand-authored
 * one, so a UI can still render it (in a visibly downgraded state) rather than dropping
 * it. `$generated: true` marks it as a fallback needing manual styling.
 *
 * @param {string} entityType - The entity type
 * @param {object} [shape] - The derived shape, used to pick a few scalar prop rows
 * @returns {object}
 */
export function genericPresentation(entityType, shape) {
    const scalarKeys = isObject(shape)
        ? Object.keys(shape).filter((k) => (
            !k.startsWith('$') && shape[k]?.$type && shape[k].$type !== 'array' && k !== 'label'
        )).slice(0, 2)
        : [];
    return {
        $generated: true,
        entityColor: FALLBACK_COLOR,
        entityLabel: entityType,
        entityLabelSuffix: () => '',
        header: {
            backgroundColor: FALLBACK_COLOR,
            fontColor: '#000',
            entityLabel: entityType,
            entityLabelSuffix: () => '',
        },
        propRows: ['label', ...scalarKeys],
    };
}

/** Memoised per schema version so the walk runs once, not per call. */
const cache = new Map();

/**
 * Derive the full structural fact set for a schema version and memoise it.
 *
 * @param {string} schemaVersion - The version key used as the cache key
 * @param {object} schema - The parsed schema document for that version
 * @returns {{entityTypes: string[], cardinality: Map<string, number>, requiredFields: string[], shapes: Map<string, object>}}
 */
export function deriveForVersion(schemaVersion, schema) {
    if (cache.has(schemaVersion)) return cache.get(schemaVersion);
    const entities = listEntities(schema);
    const derived = {
        entityTypes: [...entities.keys()].sort(),
        cardinality: cardinalityIndex(schema),
        requiredFields: requiredFields(schema),
        shapes: new Map([...entities].map(([et, def]) => [et, entityShape(schema, def)])),
    };
    cache.set(schemaVersion, derived);
    return derived;
}

export default {
    resolveRef,
    mergeAllOf,
    discriminatorValue,
    listEntities,
    cardinalityIndex,
    entityShape,
    requiredFields,
    referenceShape,
    genericPresentation,
    deriveForVersion,
};
