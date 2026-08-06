/**
 * A set of methods for transforming and manipulating OMC-JSON
 *
 * @module omcTransform
 */

import { isPlainObject } from '../mlHelpers/util.js';

import compareOmc from './omcCompare.js';
import { idKey as uniqueKey } from './omcIdentifier.js';

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

/**
 * The cleaned form of one value, or null when it holds nothing.
 *
 * Emptiness is recursive and bottom-up: a string of only whitespace is nothing, an array whose
 * items are all nothing is nothing, and an object whose properties are all nothing is nothing. So
 * emptiness discovered deep in a structure propagates outward instead of leaving a husk behind.
 *
 * Numbers and booleans are returned untouched — `0` and `false` are values, not absences, and are
 * the classic casualty of a truthiness test written in a hurry.
 *
 * Non-empty strings are returned as they were rather than trimmed: trimming is a change to the
 * data, and this function's job is to say what is absent, not to edit what is present.
 *
 * @ignore
 * @param {*} value
 * @returns {*} The cleaned value, or null
 */
function cleanValue(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value.trim() === '' ? null : value;
    if (Array.isArray(value)) {
        // Items that clean to nothing are dropped rather than left as null holes, so an array of
        // empties becomes an empty array and then, being empty, nothing at all.
        const items = value.map((item) => cleanValue(item)).filter((item) => item !== null);
        return items.length ? items : null;
    }
    if (isPlainObject(value)) {
        const cleaned = Object.keys(value).reduce((acc, key) => {
            acc[key] = cleanValue(value[key]);
            return acc;
        }, {});
        // Keys are kept and set to null rather than deleted: "known to be nothing" and "never
        // mentioned" read the same to most consumers, and keeping the key preserves the shape.
        return Object.values(cleaned).some((v) => v !== null) ? cleaned : null;
    }
    return value;
}

/**
 * Normalize an entity so that everything absent is expressed the same way — as null.
 *
 * OMC data arrives from spreadsheets, form fields, GraphQL responses and hand-edited JSON, and each
 * of them says "nothing here" differently: `''`, `[]`, `{}`, an object of nulls, or the property
 * simply missing. Left alone those differences are indistinguishable from content — an empty string
 * merges over a real value, an empty array reads as an answer, and comparing two entities that hold
 * the same information reports a difference. One spelling for absence removes all of that.
 *
 * Applied to every entity entering {@link omcSDK}, so consumers of the store never have to ask
 * which spelling they are looking at.
 *
 * Returns a new entity; the original is never modified, and nested values are rebuilt rather than
 * shared, so a caller still holding the input keeps it intact.
 *
 * @function cleanEntity
 * @static
 * @param {OmcEntity} omcEntity - The entity to normalize
 * @returns {OmcEntity} A new entity with every absence expressed as null
 *
 * @example
 * cleanEntity({ label: 'Scene 4', name: '', creativeWorkTitle: [{ titleName: '  ' }] });
 * // { label: 'Scene 4', name: null, creativeWorkTitle: null }
 */
export function cleanEntity(omcEntity) {
    if (!omcEntity || !isPlainObject(omcEntity)) return omcEntity;
    // The entity itself is never collapsed, however empty it is: callers are handed an entity and
    // must get one back.
    return Object.keys(omcEntity).reduce((acc, key) => {
        acc[key] = cleanValue(omcEntity[key]);
        return acc;
    }, {});
}
