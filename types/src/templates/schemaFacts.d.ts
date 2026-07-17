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
export function buildMaxItemsIndex(schema: object): Map<string, number>;
/**
 * The identifier fields the schema marks as required on an entity reference.
 *
 * A reference is `{ identifier: [...] }` (`$defs/core/properties/reference`), and the
 * identifier's element declares which of its fields are mandatory — scope and value —
 * as opposed to the convenience fields (`combinedForm`, `url`). Consumers that render
 * or collect references need this to know what actually has to be supplied.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {string[]} e.g. `['identifierScope', 'identifierValue']`; `[]` if undeclared
 */
export function referenceRequiredFields(schema: object): string[];
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
export function stampMaxItems(template: object, entityType: string, index: Map<string, number>, path?: string, depth?: number): object;
declare namespace _default {
    export { buildMaxItemsIndex };
    export { stampMaxItems };
    export { referenceRequiredFields };
}
export default _default;
//# sourceMappingURL=schemaFacts.d.ts.map