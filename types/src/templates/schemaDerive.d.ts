/**
 * Resolve a local JSON-Pointer `$ref` (`#/a/b/c`) against the root schema. Only local
 * refs are supported — the bundled schemas contain no remote refs.
 *
 * @param {object} root - The whole schema document
 * @param {string} ref - e.g. `#/$defs/Identifier`
 * @returns {object|null}
 */
export function resolveRef(root: object, ref: string): object | null;
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
export function mergeAllOf(root: object, node: object, seen?: Set<string>): object;
/**
 * The entity type a definition declares, or null if it is not an entity. Reads the
 * discriminator as either `const` (current schema) or a single-value `enum` (LinkML).
 *
 * @param {object} def - A schema definition node
 * @returns {string|null}
 */
export function discriminatorValue(def: object): string | null;
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
export function listEntities(schema: object): Map<string, object>;
/**
 * Index every `maxItems` constraint in a schema, keyed `EntityType:dot.path`.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {Map<string, number>} e.g. `'Asset:AssetStructure' => 1`
 */
export function cardinalityIndex(schema: object): Map<string, number>;
/**
 * The derived shape template for one entity definition.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @param {object} entityDef - An entity definition (from {@link listEntities})
 * @returns {object}
 */
export function entityShape(schema: object, entityDef: object): object;
/**
 * The identifier fields the schema marks as required on an entity reference.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {string[]} e.g. `['identifierScope', 'identifierValue']`; `[]` if undeclared
 */
export function requiredFields(schema: object): string[];
/**
 * The reference shape (`{ identifier: [ … ] }`) as the schema declares it, with the
 * required identifier fields marked `$required`.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {object|null}
 */
export function referenceShape(schema: object): object | null;
/**
 * Synthesise a generic presentation for a schema-known entity that has no hand-authored
 * one, so a UI can still render it (in a visibly downgraded state) rather than dropping
 * it. `$generated: true` marks it as a fallback needing manual styling.
 *
 * @param {string} entityType - The entity type
 * @param {object} [shape] - The derived shape, used to pick a few scalar prop rows
 * @returns {object}
 */
export function genericPresentation(entityType: string, shape?: object): object;
/**
 * Derive the full structural fact set for a schema version and memoise it.
 *
 * @param {string} schemaVersion - The version key used as the cache key
 * @param {object} schema - The parsed schema document for that version
 * @returns {{entityTypes: string[], cardinality: Map<string, number>, requiredFields: string[], shapes: Map<string, object>}}
 */
export function deriveForVersion(schemaVersion: string, schema: object): {
    entityTypes: string[];
    cardinality: Map<string, number>;
    requiredFields: string[];
    shapes: Map<string, object>;
};
declare namespace _default {
    export { resolveRef };
    export { mergeAllOf };
    export { discriminatorValue };
    export { listEntities };
    export { cardinalityIndex };
    export { entityShape };
    export { requiredFields };
    export { referenceShape };
    export { genericPresentation };
    export { deriveForVersion };
}
export default _default;
//# sourceMappingURL=schemaDerive.d.ts.map