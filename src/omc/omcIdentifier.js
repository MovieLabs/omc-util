/**
 * @module omcIdentifier
 */

// ToDo: Find does not belong here, it should be moved to the SDK

import { customAlphabet } from 'nanoid';

import { generalConfig } from '../templates/index.js';
import { makeArray } from '../mlHelpers/util.js';

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
 * Create a new OMC identifier with the requested scope and unique identifierValue with an optional prefix
 *
 * @function idCreate
 * @static
 * @param {Object} params
 * @param {string} params.identifierScope - The scope of the identifier
 * @param {string | null} [params.prefix] - Optional prefix for the identifier value
 * @param {string | null} [params.entityType] - Uses a predefined prefix for the entityType [takes priority]
 * @returns {OmcIdentifier} An OMC identifier with the specified scope and new unique value
 *
 * @example
 * idCreate({ identifierScope: 'movielabs.com', entityType: 'Character' })
 * // returns {
 * //     identifierScope: 'movielabs.com',
 * //     identifierValue': 'chr-Yhq5EZz4zdQxgOt'
 * // }
 *
 */
export function idCreate({ identifierScope, prefix = null, entityType = null }) {
    const p = generalConfig[entityType] ? generalConfig[entityType].idPrefix : prefix;
    return {
        identifierScope: identifierScope || 'example.com',
        identifierValue: p ? `${p}-${idCharSet()}` : `${idCharSet()}`,
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
 * @returns {string} A unique key representing the combined form of the identifier
 *
 * @example
 * idCombinedForm({ identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt' })
 * // returns 'movielabs.comchr-Yhq5EZz4zdQxgOt'
 */
export function idCombinedForm(identifier) {
    return identifier?.combinedForm || `${identifier.identifierScope}${identifier.identifierValue}`;
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
