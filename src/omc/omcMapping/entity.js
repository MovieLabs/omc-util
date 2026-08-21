/**
 * Minting an entity from a key and a set of resolved properties.
 *
 * The identifier is **hashed from the key**, never generated at random. That is the whole basis of
 * re-running a template: the same row always yields the same identifier, so a second run updates
 * the entity in place rather than creating a rival copy of it. It also lets one entity reference
 * another before that other exists, because the target's identifier is computable from its key
 * alone.
 *
 * @module omcMapping/entity
 */

import { omcTemplate } from '../../templates/index.js';
import { idHash } from '../omcIdentifier.js';

import './types.js'; // Type definitions, resolved globally by JSDoc

/**
 * Defaults for {@link OmcMapping.MappingOptions}.
 *
 * Every function takes options and falls back to these, so nothing depends on module state and one
 * process can build entities for several projects at once.
 *
 * @type {OmcMapping.MappingOptions}
 */
export const DEFAULT_OPTIONS = {
    identifierScope: 'movielabs.com',
    schemaVersion: 'https://movielabs.com/omc/json/schema/v3.0',
    seedNamespace: null,
};

/**
 * Fill in the option defaults.
 *
 * @param {OmcMapping.MappingOptions} [options] - Caller-supplied options
 * @returns {OmcMapping.MappingOptions} Options with every member set
 */
export const resolveOptions = (options = {}) => ({ ...DEFAULT_OPTIONS, ...options });

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
export function seedFor({ entityType, key, seedNamespace }) {
    return [seedNamespace, entityType, key].filter(Boolean).join('|');
}

/**
 * Drop values that carry no information, recursively.
 *
 * A source leaves a great many fields empty, and OMC has no use for `""` or `{}` — an absent
 * property says the same thing without asserting that the production recorded a blank.
 *
 * @param {*} value - Value to prune
 * @returns {*} The value, or undefined when it is empty
 */
function prune(value) {
    if (value === null || value === undefined || value === '') return undefined;
    if (Array.isArray(value)) {
        const items = value.map(prune).filter((v) => v !== undefined);
        return items.length ? items : undefined;
    }
    if (typeof value === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            const pruned = prune(v);
            if (pruned !== undefined) out[k] = pruned;
        }
        return Object.keys(out).length ? out : undefined;
    }
    return value;
}

/**
 * The property names an entityType accepts — the schema-derived shape plus its intrinsic edges.
 *
 * v3.0 sets `unevaluatedProperties: false`, so anything outside this set makes the entity invalid.
 *
 * @param {string} entityType - OMC entity type
 * @param {string} schemaVersion - Schema version URL
 * @returns {Set<string>} Allowed property names
 * @throws {Error} When the entityType is unknown to the schema
 */
function allowedProperties(entityType, schemaVersion) {
    const shape = omcTemplate.shape({ schemaVersion, entityType });
    if (!shape) throw new Error(`Unknown OMC entityType "${entityType}" for ${schemaVersion}`);
    const { intrinsic = {} } = omcTemplate.edgeTable({ schemaVersion, entityType }) ?? {};
    return new Set([...Object.keys(shape), ...Object.keys(intrinsic), 'edges']);
}

/**
 * Properties the schema both requires and supplies a default for, that the caller did not set.
 *
 * `NarrativeScene.narrativeSceneType` is required and fixed; an entity without it fails validation.
 * Since the schema states both the requirement and the value, a mapping should not have to repeat
 * it — and a future version adding another such property gets it for free.
 *
 * Deliberately narrow: only `$required` defaults. Applying *every* `$default` in the shape would
 * stuff entities with values the source never mentioned.
 *
 * @param {string} entityType - OMC entity type
 * @param {string} schemaVersion - Schema version URL
 * @param {Object} supplied - Properties the mapping set
 * @returns {Object} The defaults to add
 */
function requiredDefaults(entityType, schemaVersion, supplied) {
    const shape = omcTemplate.shape({ schemaVersion, entityType });
    const defaults = {};
    for (const [key, spec] of Object.entries(shape)) {
        if (key === 'schemaVersion' || key === 'entityType') continue;
        if (spec?.$required && spec.$default !== undefined && supplied[key] === undefined) {
            defaults[key] = spec.$default;
        }
    }
    return defaults;
}

/**
 * The identifier a source supplied for itself, if the mapping wrote one.
 *
 * A source that already carries its own id — a Frame.io file uuid, a system of record's primary
 * key — should keep it. Hashing over the top would invent a second name for something that is
 * already named, and then nothing outside this run could refer to it.
 *
 * The scope falls back to the run's, because a source supplies a value and rarely a scope; an
 * identifier with a value and no scope is not a usable identifier.
 *
 * @param {Object} properties - The resolved properties
 * @param {string} identifierScope - The run's scope
 * @returns {(Object|null)} The identifier, or null when the mapping wrote none
 */
function suppliedIdentifier(properties, identifierScope) {
    const first = Array.isArray(properties.identifier) ? properties.identifier[0] : null;
    if (!first?.identifierValue) return null;
    return {
        identifierScope: first.identifierScope || identifierScope,
        identifierValue: String(first.identifierValue),
    };
}

/**
 * Create an OMC entity.
 *
 * The identifier is hashed from `key` — **unless the mapping supplied one**, in which case that is
 * used verbatim. Either way it is a pure function of the row, so a re-run updates the entity rather
 * than duplicating it.
 *
 * @param {Object} params
 * @param {string} params.entityType - OMC entity type, e.g. `Slate`
 * @param {(string|null)} params.key - The value identifying this entity within its namespace. May
 *   be null only when `properties` supplies an identifier
 * @param {Object} [params.properties] - Properties to set, already nested; empty ones are dropped
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {Object} The OMC entity
 * @throws {Error} When a property is not in the entity's shape, or there is nothing to identify
 *   the entity by
 */
export function createEntity({
    entityType, key, properties = {}, options = {},
}) {
    const { identifierScope, schemaVersion, seedNamespace } = resolveOptions(options);

    const allowed = allowedProperties(entityType, schemaVersion);
    const unknown = Object.keys(properties).filter((k) => !allowed.has(k));
    if (unknown.length) {
        throw new Error(`${entityType} has no propert${unknown.length > 1 ? 'ies' : 'y'} `
            + `"${unknown.join('", "')}" in ${omcTemplate.versionLabel(schemaVersion)}`);
    }

    const supplied = suppliedIdentifier(properties, identifierScope);
    if (!supplied && (key === null || key === undefined || key === '')) {
        throw new Error(`${entityType} has neither a key column nor a mapped identifierValue, so `
            + 'there is nothing to identify it by');
    }

    // Held back from the spread below: an identifier written as an ordinary property would
    // overwrite the one built here — which is how a mapped identifierValue used to produce an
    // identifier with no scope at all.
    const { identifier: _mapped, ...rest } = properties;

    return {
        schemaVersion,
        entityType,
        identifier: [supplied ?? idHash({
            identifierScope,
            seed: seedFor({ entityType, key, seedNamespace }),
            entityType,
            prefix: true,
            schemaVersion,
        })],
        ...requiredDefaults(entityType, schemaVersion, properties),
        ...prune(rest) ?? {},
    };
}

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
export function entityRef({ entityType, key, options = {} }) {
    const { identifierScope, schemaVersion, seedNamespace } = resolveOptions(options);
    return {
        schemaVersion,
        entityType,
        identifier: [idHash({
            identifierScope,
            seed: seedFor({ entityType, key, seedNamespace }),
            entityType,
            prefix: true,
            schemaVersion,
        })],
    };
}
