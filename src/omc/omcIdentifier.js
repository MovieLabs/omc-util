/**
 * Create, compare and merge the identifiers that give an OMC entity its identity.
 *
 * An identifier is a `{ identifierScope, identifierValue }` pair and an entity may carry several,
 * so identity is a set-intersection question rather than an equality one — `idIsDuplicate` and
 * `hasMatching` are how it is asked. The rule the rest of the library leans on is that no two
 * entities in a model may share an identifier.
 *
 * `idMint` mints one: random, hashed from a value, or a value used as given.
 *
 * @module omcIdentifier
 */

// ToDo: Find does not belong here, it should be moved to the SDK

import { customAlphabet } from 'nanoid';

import { hashId, makeArray } from '../mlHelpers/util.js';
import { omcTemplate } from '../templates/index.js';

const idCharSet = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 15);

/**
 * Normalizes the input based on whether an OmcEntity or just OmcIdentifier was passed in
 * returning just an array of OmcIdentifiers.
 *
 * @function idNormalize
 * @ignore
 * @static
 * @param {OmcEntity | OmcIdentifier} identifier
 * @returns {Array<OmcIdentifier>} - An array of just identifiers
 */
export function idNormalize(identifier) {
    return Object.hasOwn(identifier, 'identifier') ? identifier.identifier : makeArray(identifier);
}

/**
 * OMC entities may have multiple identifiers, this returns the identifier of the requested scope if found
 *
 * @function idOfScope
 * @static
 * @param {Array<OmcIdentifier>} identifier - An array of OMC identifiers
 * @param {string} identifierScope - The scope of the required identifierValue
 * @returns {OmcIdentifier | null} - A single identifier if the scope is matched, null it not
 *
 * @example
 * idOfScope(
 *  [
 *     { identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt'},
 *     { identifierScope: 'labkoat.com', identifierValue: 'chr-bSvGGMtq55TRL8j'},
 *  ],
 *  'movielabs.com'
 * )
 * // returns { identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt'}
 */
export function idOfScope(identifier, identifierScope) {
    const scopeMatch = identifier.find((id) => id.identifierScope === identifierScope);
    return scopeMatch || null;
}

/**
 * The identifiers that carry a URL resolving them, typically a link to the entity in the system its
 * scope names. The URL is returned as written; whether it is safe to follow is the caller's to
 * decide.
 *
 * @function idUrls
 * @static
 * @param {OmcEntity | OmcIdentifier | Array<OmcIdentifier>} identifier - An entity, or its identifiers
 * @returns {Array<{identifierScope: string, identifierValue: string, url: string}>} One entry per
 *   identifier with a non-blank `url`, in the entity's order; empty when there are none
 *
 * @example
 * idUrls({
 *     identifier: [
 *         { identifierScope: 'labkoat.com', identifierValue: 'chr-bSvGGMtq55TRL8j' },
 *         { identifierScope: 'imdb.com', identifierValue: 'ch0000001', url: 'https://www.imdb.com/character/ch0000001/' },
 *     ],
 * })
 * // returns [{ identifierScope: 'imdb.com', identifierValue: 'ch0000001', url: 'https://www.imdb.com/character/ch0000001/' }]
 */
export function idUrls(identifier) {
    if (!identifier) return [];
    return idNormalize(identifier)
        .filter((id) => typeof id?.url === 'string' && id.url.trim())
        .map(({ identifierScope, identifierValue, url }) => ({ identifierScope, identifierValue, url: url.trim() }));
}

/**
 * Mint an OMC identifier. The one minter: what varies is where the value comes from.
 *
 * - **No `value`**: a random value.
 * - **`value`, `hash` true (the default)**: the value hashed (cyrb53, base-36), so the same value
 *   always yields the same identifier. Re-imports update rather than duplicate, and an edge can
 *   point at an entity a later pass builds.
 * - **`value`, `hash` false**: the value used as given, so it can be read back off the identifier
 *   (a content hash, a source system's own id).
 *
 * The entityType's prefix is added after the value whenever `entityType` is given, and never
 * otherwise. Every entity type has its own prefix, so two types minted from one value stay
 * distinct without the type being hashed in.
 *
 * @function idMint
 * @static
 * @param {Object} params
 * @param {string} params.identifierScope - The scope of the identifier
 * @param {string} [params.value] - What the identifier is minted from; random when absent
 * @param {boolean} [params.hash=true] - Hash `value` rather than use it as given
 * @param {string | null} [params.entityType] - Adds this type's prefix
 * @param {string} [params.schemaVersion] - Schema version for the prefix lookup
 * @returns {OmcIdentifier}
 *
 * @example
 * idMint({ identifierScope: 'movielabs.com', value: 'wwdoat|1-1', entityType: 'ProductionScene' })
 * // returns { identifierScope: 'movielabs.com', identifierValue: 'pscn-<stable hash>' }
 *
 * idMint({ identifierScope: 'movielabs.com', value: '9e107d9d372bb6826bd81d3542a419d6', hash: false, entityType: 'Asset' })
 * // returns { identifierScope: 'movielabs.com', identifierValue: 'ast-9e107d9d372bb6826bd81d3542a419d6' }
 */
export function idMint({
    identifierScope,
    value = undefined,
    hash = true,
    entityType = null,
    schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0',
}) {
    const given = value !== null && value !== undefined && `${value}` !== '';
    let body = idCharSet();
    if (given) body = hash ? hashId(`${value}`) : `${value}`;
    const prefix = entityType ? omcTemplate.idPrefix({ entityType, schemaVersion }) : null;
    return {
        identifierScope: identifierScope || 'example.com',
        identifierValue: prefix ? `${prefix}-${body}` : body,
    };
}

/**
 * Creates a globally unique key by combining the identifierScope and identifierValue of an OMC identifier
 *
 * @function idKey
 * @static
 * @param {OmcIdentifier} identifier - An OMC identifier
 * @returns {string} A unique key
 *
 * @example
 * idKey({ identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt' })
 * // returns 'movielabs.com:chr-Yhq5EZz4zdQxgOt'
 */
export function idKey(identifier) {
    return `${identifier.identifierScope}:${identifier.identifierValue}`;
}

/**
 * Returns the combinedForm of an identifier which is the conjunction of its scope and value, this should be globally unique
 *
 * @function idCombinedForm
 * @static
 * @param {OmcIdentifier} identifier - An OMC identifier
 * @param {string} separator - An optional sting to be place between the scope and identifier
 * @returns {string} A unique key representing the combined form of the identifier
 *
 * @example
 * idCombinedForm({ identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt' }, ':')
 * // returns 'movielabs.com:chr-Yhq5EZz4zdQxgOt'
 */
export function idCombinedForm(identifier, separator = '') {
    return identifier?.combinedForm || `${identifier.identifierScope}${separator}${identifier.identifierValue}`;
}

/**
 * Test if an identifier from one entity already exists within a set of other entities
 *
 * @function idIsDuplicate
 * @static
 * @param {Array<OmcIdentifier>} targetId - Set of target entities against which the source entity id's will be checked for matches
 * @param {OmcIdentifier} sourceId - source entity, used to check against the target
 * @returns {boolean} Returns True when duplicate identifiers exist between the target and source identifiers
 */
export function idIsDuplicate(targetId, sourceId) {
    const idTest = makeArray(sourceId);
    const idTestKeys = idTest.map((omcId) => `${idKey(omcId)}`);
    return !!(targetId.find((id) => idTestKeys.includes(`${idKey(id)}`)));
}

/**
 * Merge an identifier into an existing array of identifiers
 *
 * @function idMerge
 * @static
 * @param {Array<OmcIdentifier>} targetId
 * @param {OmcIdentifier | Array<OmcIdentifier>} mergeId
 * @returns {Array<OmcIdentifier>} The merged set of identifiers
 */
export function idMerge(targetId, mergeId) {
    const omcMerge = makeArray(mergeId); // The identifiers to be merged into primary array
    const mergedMap = targetId.reduce((obj, omcId) => ({ ...obj, [idKey(omcId)]: omcId }), {});
    const mergedIdentifiers = omcMerge.reduce((acc, omcId) => {
        const key = idKey(omcId);
        return Object.hasOwn(acc, key)
            ? { ...acc, [key]: { ...omcId, ...acc[key] } } // Merge the two matching identifiers together
            : { ...acc, [key]: omcId }; // Merge the missing identifier in
    }, mergedMap);
    return Object.values(mergedIdentifiers);
}

/**
 * Remove an identifier from an existing array of identifiers
 * @function idRemove
 * @static
 * @param {Array<OmcIdentifier>} targetId The array of identifiers targeted for removal
 * @param {OmcIdentifier} removeId The identifier to be removed
 * @returns {Array<OmcIdentifier>} The set with the identifier removed
 */
export function idRemove(targetId, removeId) {
    return targetId.filter((omcId) => (
        removeId.identifierValue !== omcId.identifierValue && removeId.identifierScope !== omcId.identifierScope
    ));
}

/**
 * Cross-check all identifiers in the targetIdentifier with those in the remove identifier
 * If any identifiers present in the targetIdentifier have a match in the removeIdentifier null is returned
 * indicating it should be removed
 *
 * @function hasMatching
 * @static
 * @param {OmcEntity | Array<OmcIdentifier>} targetIdentifier
 * @param {OmcEntity | Array<OmcIdentifier>} matchIdentifier
 * @returns {Boolean} True if there are matching identifiers
 */
export function hasMatching(targetIdentifier, matchIdentifier) {
    const tId = idNormalize(targetIdentifier);
    const sId = idNormalize(matchIdentifier);
    const res = tId.filter((id1) => sId.find((id2) => (
        id1.identifierScope === id2.identifierScope) && (id1.identifierValue === id2.identifierValue
    )));
    return !!res.length;
}

/**
 * Find an entity in a set of OMC entities by its identifier
 *
 * @function find
 * @static
 * @param {Array<OmcEntity>} omc - Set of OMC entities to search
 * @param {OmcIdentifier | Array<OmcIdentifier>} identifier - The identifier(s) to search for
 * @returns {OmcEntity|null} The matching entity or null
 */
export function find(omc, identifier) {
    // Do two identifiers match?
    const identifierMatch = ((id1, id2) => (
        id1.identifierValue === id2.identifierValue) && (id1.identifierScope === id2.identifierScope)
    );

    // For each entity in the set, check each of its identifiers against the target identifier
    const matchSingleId = () => {
        const id = Array.isArray(identifier) ? identifier[0] : identifier;
        return omc.find((ent) => (ent.identifier.find((entId) => identifierMatch(entId, id))));
    };

    // For each entity in the set, check each of its identifiers against all potential target identifiers
    const matchMultipleIds = () => (
        omc.find((ent) => (ent.identifier.find((entId) => identifier.find((trgId) => identifierMatch(entId, trgId)))
        )));

    if (!identifier) return null;
    const res = (!Array.isArray(identifier) || identifier.length === 1)
        ? matchSingleId()
        : matchMultipleIds();
    return res || null;
}
