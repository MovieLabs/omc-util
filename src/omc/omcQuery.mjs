/**
 * Methods to manipulate or parse OMC entities
 *
 * @module omcQuery
 */

/**
 * @typedef {import('../../types.mjs').OmcJson} OmcJson
 */

import { makeArray, hasProp } from '../mlHelpers/util.mjs';

/**
 * Extract nested elements from OMC entities
 *
 * @function extractFromEntity
 * @param {Object} entity - An OMC entity
 * @param {string} entityPath - A dot notated string of the path to extract
 * @returns {Array}
 */
export function extractFromEntity(entity, entityPath) {
    const entities = makeArray(entity); // Make sure it is iterable
    const levels = entityPath.split('.'); // Split the path on '.'
    const target = levels.shift();
    return entities.flatMap((ent) => {
        if (!hasProp(ent, target)) return null; // If no relevant property return null
        return (levels.length !== 0) // Recurse down, until end of path has been reached
            ? extractFromEntity(ent[target], levels.join('.'))
            : ent[target];
    }).filter((ent) => ent !== null);
}

/**
 * Return all entities of a given entity type
 *
 * @function getEntity
 * @param {OmcJson} omc - An array of OMC entities
 * @param {string} entityType - The entity type to filter by
 * @returns {OmcJson}
 */
export function getEntity(omc, entityType) {
    return omc.filter((ent) => ent.entityType === entityType);
}
