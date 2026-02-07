/**
 * A set of methods for transforming and manipulating OMC-JSON
 *
 * @module omcTransform
 */

/**
 * @typedef {import('../../types.mjs').OmcEntity} OmcEntity
 * @typedef {import('../../types.mjs').OmcJson} OmcJson
 */

import { isPlainObject } from '../mlHelpers/util.mjs';

import compareOmc from './compare.mjs';
import { key as uniqueKey } from './identifier.mjs';

let counter = 0; // A temp counter used in de-duplication

const assertEqual = ((a, b) => {
    const comparison = compareOmc({ original: a, comparison: b });
    // if (comparison.diff) console.log(a, b);
    return (!comparison.diff); // Compare returns null, if the entities are the same
});

const tempId = () => {
    counter += 1;
    return `tempid:${counter}`;
};

/**
 * De-Duplicate a set of entities based on their shared identifiers
 *
 * @function deDuplicate
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson}
 */
export function deDuplicate(omc) {
    if (!omc) return null;
    const deDupe = {};
    const idMapping = {};
    omc.forEach((ent) => {
        const { identifier = [] } = ent; // Safeguard against missing identifier (should never happen)
        const mappingId = tempId(); // A temporary singular id for the entity, used to track duplicates
        let duplicateId = mappingId;
        identifier.forEach((omcId) => {
            const uId = uniqueKey(omcId);
            if (Object.hasOwn(idMapping, uId)) duplicateId = idMapping[uId]; // An entity with this id has been seen before
            idMapping[uId] = duplicateId;
        });
        if (mappingId !== duplicateId) {
            if (!assertEqual(deDupe[duplicateId], ent)) {
                const a = JSON.stringify(deDupe[duplicateId]); // ToDo: Some business logic here
                const b = JSON.stringify(ent);
                if (b.length > a.length) {
                    console.log('Same identifier, replacing the existing one');
                    deDupe[duplicateId] = ent;
                } else {
                    console.log('Same identifier, keeping the existing one');
                }
            }
        } else {
            deDupe[mappingId] = ent; // First time seeing this, so add the entity to the deDupe object
        }
    });
    return Object.values(deDupe);
}

/**
 * Convert Omc-Json from an array or single instance to the OMC object(map) format
 *
 * @function toObject
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson}
 */
export function toObject(omc) {
    if (!omc) return null;
    if (Array.isArray(omc)) {
        return omc.reduce((obj, ent) => {
            const { entityType } = ent;
            if (entityType) {
                obj[entityType] = obj[entityType] || [];
                obj[entityType].push(ent);
            }
            return obj;
        }, {});
    }
    if (omc.entityType) return { [omc.entityType]: [omc] };
    return omc;
}

/**
 * Convert Omc-Json array from the object(map) format
 *
 * @function toArray
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson} - Omc-Json in the Array format
 */
export function toArray(omc) {
    if (!omc) return null;
    if (Object.hasOwn(omc, 'entityType')) return [omc]; // Single instance
    if (!Array.isArray(omc)) {
        const omcKeys = Object.keys(omc);
        return omcKeys.flatMap((entityType) => omc[entityType]);
    }
    return omc;
}

/**
 * Unembeds nested entities from a single root entity that is passed in
 *
 * @ignore
 * @param {OmcEntity} omc - Valid Omc-Json
 * @returns {OmcJson} - Omc-Json with all nested entities replaced with a reference and the entities at the top level of the array
 */
function unEmbedEnt(omc) {
    const stash = []; // Any nested entities are stashed here for the return

    const traverse = ((ent) => {
        if (!isPlainObject(ent)) return ent;

        const refEnt = { ...ent }; // Clone the entity, so we don't mutate the original
        const refKeys = Object.keys(refEnt).filter((key) => key !== 'customData'); // Do not travers custom data
        refKeys.forEach((refKey) => {
            refEnt[refKey] = (Array.isArray(refEnt[refKey]))
                ? refEnt[refKey].flatMap((e1) => traverse(e1)) // Array of values: traverse each one
                : traverse(refEnt[refKey]); // Single value: traverse it
        });
        if (!Object.hasOwn(refEnt, 'entityType')) return refEnt; // Not an entity, so return it

        // If this is Context without a ForEntity property, then add the parents identifier
        // ToDo: In the deduplication, the same Context's need their ForEntities id's merged!
        // if (refEnt.entityType === 'Context' && !refEnt.ForEntity) refEnt.ForEntity = [{identifier: parent.identifier}];

        stash.push(refEnt); // Add the entity to the stash
        return { identifier: refEnt.identifier }; // Return a reference to the entity
    });

    traverse(omc);
    return stash;
}

// Migrate a set of entities
const unEmbedSet = ((omc) => {
    const entSet = omc.flatMap((ent) => unEmbedEnt(ent));
    return deDuplicate(entSet);
});

/**
 * Creates flattened Omc-Json with an array of single entities
 * Nested entities in the original OmsJson are removed and replaced with references
 *
 * @function unEmbed
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson} - Omc-Json with all nested entities replaced with a reference and the entities at the top level of the array
 */
export function unEmbed(omc) {
    if (!omc) return null;
    if (Array.isArray(omc)) return unEmbedSet(omc); // Array of instances
    if (Object.hasOwn(omc, 'entityType')) return unEmbedEnt(omc); // Single instance
    const omcSet = unEmbedSet(toArray(omc)); // Object(map) of omc instances
    return toObject(omcSet);
}
