/**
 * @module omcIdentifier
 */

// ToDo: Find does not belong here, it should be moved to the SDK
// ToDo: generateIdentifier does not follow the naming convention, should create or generate.

import { customAlphabet } from 'nanoid';

import { idPrefixTemplate } from '../entityTemplates/index.mjs';
import { makeArray } from '../helpers/util.mjs';

const idCharacters = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 15);

/**
 * Normalizes the input based on whether and OmcEntity or OmcIdentifier was passed in
 * returning just an array of OmcIdentifiers.
 *
 * @ignore
 * @static
 * @param {OmcEntity | OmcIdentifier} identifier
 * @returns {Array<OmcIdentifier>} - An array of just identifiers
 */
export const normalizeIdentifier = ((identifier) => (
    Object.hasOwn(identifier, 'identifier') ? identifier.identifier : makeArray(identifier))
);

/**
 * OMC entities may have multiple identifiers, this returns the identifier for the requested scope
 *
 * @function ofScope
 * @static
 * @param {Array<OmcIdentifier>} identifier - An array of OMC identifiers
 * @param {string} identifierScope - The scope of the required identifierValue
 * @returns {OmcIdentifier} - A single identifier
 */
export const ofScope = ((identifier, identifierScope) => (
    identifier.find((id) => id.identifierScope === identifierScope))
);

/**
 * Generate a unique identifier value with an optional prefix
 *
 * @function create
 * @static
 * @param {Object} params
 * @param {string} params.identifierScope - The scope of the identifier
 * @param {string | null} [params.prefix] - Optional prefix for the identifier value
 * @param {string | null} [params.entityType] - Will use the predefined prefix for the entityType
 * @returns {OmcIdentifier} - A unique identifier value
 */

export function create({ identifierScope, prefix = null, entityType = null }) {
    const p = idPrefixTemplate[entityType] ? idPrefixTemplate[entityType] : prefix;
    return {
        identifierScope,
        identifierValue: p ? `${p}-${idCharacters()}` : `${idCharacters()}`,
    };
}

/**
 * Generate a unique key by combining the identifierScope and identifierValue
 *
 * @function key
 * @static
 * @param {OmcIdentifier} identifier - An OMC identifier
 * @returns {string} - A unique key
 */

export const key = ((identifier) => `${identifier.identifierScope}:${identifier.identifierValue}`);

/**
 * Test if an identifier from one entity already exists within a set of other entities
 *
 * @function hasDuplicateId
 * @static
 * @param {Array<OmcEntity>} targetOmcEnt - Set of target entities against which the source entity id's will be checked for matches
 * @param {OmcEntity} sourceOmcEnt - source entity, used to check against the target
 * @returns {boolean}
 */

export function hasDuplicateId(targetOmcEnt, sourceOmcEnt) {
    const targetId = sourceOmcEnt.identifier.map((omcId) => `${key(omcId)}`);
    const exists = targetOmcEnt.find((ent) => (ent.identifier.find((omcId) => targetId.includes(`${key(omcId)}`))));
    return !exists;
}

/**
 * Merge two sets of identifiers into a single, de-duplicated set
 *
 * @function merge
 * @static
 * @param {OmcEntity} targetOmc
 * @param {OmcEntity | Array<OmcEntity>} sourceOmc
 * @returns {Array<OmcIdentifier>} - A merged set of identifiers
 */

export function merge(targetOmc, sourceOmc) {
    const omcMerge = makeArray(sourceOmc); // The identifiers to be merged into primary array
    const mergedIdentifiers = [...targetOmc];
    omcMerge.forEach((omcEnt) => {
        if (hasDuplicateId(mergedIdentifiers, omcEnt)) mergedIdentifiers.push(omcEnt);
    });
    return mergedIdentifiers;
}

/**
 * Cross-check all identifiers in the targetIdentifier with those in the remove identifier
 * If any identifiers present in the targetIdentifier have a match in the removeIdentifier null is returned
 * indicating it should be removed
 * @param {OmcEntity | Array<OmcIdentifier>} targetIdentifier
 * @param {OmcEntity | Array<OmcIdentifier>} matchIdentifier
 * @returns {Boolean} - True if there are matching identifiers
 */

export function hasMatching(targetIdentifier, matchIdentifier) {
    const tId = normalizeIdentifier(targetIdentifier);
    const sId = normalizeIdentifier(matchIdentifier);
    const res = tId.filter((id1) => sId.find((id2) => (
        id1.identifierScope === id2.identifierScope) && (id1.identifierValue === id2.identifierValue
    )));
    return !!res.length;
}

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
