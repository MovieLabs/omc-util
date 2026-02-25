/**
 * Find entities that match a set of criteria passed in the filter
 *
 * @module omcFind
 */

import { unEmbed, toArray } from './transform.mjs';

function matchesCriteria(obj, filter) {
    // Handle null/undefined
    if (obj === null || obj === undefined) {
        return filter === null || filter === undefined;
    }

    // Handle primitives - direct equality
    if (typeof filter !== 'object' || filter === null) {
        return obj === filter;
    }

    // Handle arrays - must have same values
    if (Array.isArray(filter)) {
        if (!Array.isArray(obj)) return false;
        if (obj.length !== filter.length) return false;
        return filter.every((c, i) => matchesCriteria(obj[i], c));
    }

    // Handle objects - all criteria properties must match
    if (typeof obj !== 'object' || obj === null) return false;

    return Object.keys(filter).every((key) => {
        if (Array.isArray(obj[key])) {
            return obj[key].find((item) => matchesCriteria(item, filter[key]));
        }
        return matchesCriteria(obj[key], filter[key]);
    });
}

/**
 * Given an array of OMC entities, return those matching the filter criteria
 *
 * @function omcFind
 * @static
 * @param {OmcJson} omc - Valid OMC-JSON
 * @param {Object} filter - Filter criteria matching the shape of an OMC entity
 * @returns {Array<OmcEntity>} All entities matching the filter or []
 */
export default function omcFind(omc, filter) {
    const normalizedOmc = toArray(unEmbed(omc)); // Normalize the OMC to single entities in an array

    return normalizedOmc.filter((item) => matchesCriteria(item, filter));
}

/*
 // Do two identifiers match?
 const identifierMatch = ((id1, id2) => (id1.identifierValue === id2.identifierValue) && (id1.identifierScope === id2.identifierScope));

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
 */
