/**
 * @module omcIdentifier
 */

// ToDo: Find does not belong here, it should be moved to the SDK
// ToDo: generateIdentifier does not follow the naming convention, should create or generate.

import { customAlphabet } from 'nanoid';

import { idPrefixTemplate } from '../entityTemplates/index.mjs';
import { makeArray } from '../mlHelpers/util.mjs';

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
export const idNormalize = ((identifier) => (
    Object.hasOwn(identifier, 'identifier') ? identifier.identifier : makeArray(identifier))
);

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
export const idOfScope = ((identifier, identifierScope) => {
    const scopeMatch = identifier.find((id) => id.identifierScope === identifierScope);
    return scopeMatch || null;
});

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
    const p = idPrefixTemplate[entityType] ? idPrefixTemplate[entityType] : prefix;
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
 *
 */
export const idKey = ((identifier) => `${identifier.identifierScope}:${identifier.identifierValue}`);

/**
 * Test if an identifier from one entity already exists within a set of other entities
 *
 * @function idHasDuplicate
 * @static
 * @param {Array<OmcEntity>} targetOmcEnt - Set of target entities against which the source entity id's will be checked for matches
 * @param {OmcEntity} sourceOmcEnt - source entity, used to check against the target
 * @returns {boolean} Returns True when duplicate identifiers exist between the target and source identifiers
 */
export function idHasDuplicate(targetOmcEnt, sourceOmcEnt) {
    const targetId = sourceOmcEnt.identifier.map((omcId) => `${idKey(omcId)}`);
    const exists = targetOmcEnt.find((ent) => (ent.identifier.find((omcId) => targetId.includes(`${idKey(omcId)}`))));
    return !exists;
}

/**
 * Merge two sets of identifiers into a single, de-duplicated set
 *
 * @function idMerge
 * @static
 * @param {Array<OmcEntity>} targetOmc
 * @param {OmcEntity | Array<OmcEntity>} sourceOmc
 * @returns {Array<OmcIdentifier>} A merged set of identifiers
 */
export function idMerge(targetOmc, sourceOmc) {
    const omcMerge = makeArray(sourceOmc); // The identifiers to be merged into primary array
    const mergedIdentifiers = [...targetOmc];
    omcMerge.forEach((omcEnt) => {
        if (idHasDuplicate(mergedIdentifiers, omcEnt)) mergedIdentifiers.push(omcEnt);
    });
    return mergedIdentifiers;
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
