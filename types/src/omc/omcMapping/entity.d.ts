/**
 * Build the seed an identifier is hashed from.
 *
 * `entityType` is part of the seed, which is what lets one key mint several entities: a row keyed
 * on a file name can yield an Asset and an AssetStructure with distinct identifiers that reference
 * each other.
 *
 * @param {Object} params
 * @param {string} params.entityType - The OMC entityType
 * @param {string} params.key - The value identifying the entity within its namespace
 * @param {(string|null)} [params.seedNamespace] - Namespace, keeping projects from colliding
 * @returns {string} The seed
 */
export function seedFor({ entityType, key, seedNamespace }: {
    entityType: string;
    key: string;
    seedNamespace?: (string | null);
}): string;
/**
 * Create an OMC entity with a deterministic identifier.
 *
 * @param {Object} params
 * @param {string} params.entityType - OMC entity type, e.g. `Slate`
 * @param {string} params.key - The value identifying this entity within its namespace
 * @param {Object} [params.properties] - Properties to set, already nested; empty ones are dropped
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {Object} The OMC entity
 * @throws {Error} When a property is not in the entity's shape
 */
export function createEntity({ entityType, key, properties, options, }: {
    entityType: string;
    key: string;
    properties?: any;
    options?: OmcMapping.MappingOptions;
}): any;
/**
 * An identifier-only reference to an entity this row does not build.
 *
 * Seeded exactly as {@link createEntity} seeds it, so the reference resolves to the real entity
 * once something builds it — with no rework and no second pass.
 *
 * @param {Object} params
 * @param {string} params.entityType - The OMC entityType being referenced
 * @param {string} params.key - The referenced entity's key
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {Object} A stub carrying only entityType, schemaVersion and identifier
 */
export function entityRef({ entityType, key, options }: {
    entityType: string;
    key: string;
    options?: OmcMapping.MappingOptions;
}): any;
/**
 * Defaults for {@link OmcMapping.MappingOptions}.
 *
 * Every function takes options and falls back to these, so nothing depends on module state and one
 * process can build entities for several projects at once.
 *
 * @type {OmcMapping.MappingOptions}
 */
export const DEFAULT_OPTIONS: OmcMapping.MappingOptions;
export function resolveOptions(options?: OmcMapping.MappingOptions): OmcMapping.MappingOptions;
//# sourceMappingURL=entity.d.ts.map