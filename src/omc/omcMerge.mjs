/**
 * @module omcMerge
 */

import { isCapitalized, isPlainObject } from '../mlHelpers/util.mjs';

import { idKey } from './omcIdentifier.mjs';

const idKeyMapping = ((identifier) => identifier.reduce((obj, id) => ({
    ...obj,
    [idKey(id)]: id,
}), {}));

/**
 * @memberof module:omcMerge
 * @function mergeNonDestructive
 * @static
 * @param obj1
 * @param obj2
 * @returns {*}
 */
export function mergeNonDestructive(obj1, obj2) {
    if (!obj1) return obj2;
    if (!obj2) return obj1;
    const result = { ...obj1 };
    // Iterate through obj2's properties
    for (const key in obj2) {
        if (Object.hasOwn(obj2, key)) {
            // If obj2's value is null, keep obj1's value (if it exists)
            if (obj2[key] === null) {
                // Only keep obj1's value if it exists, otherwise set to null
                result[key] = key in obj1 ? obj1[key] : null;
            } else {
                // Otherwise, obj2's non-null value takes precedence
                result[key] = obj2[key];
            }
        }
    }
    return result;
}

/**
 * Takes in two sets of identifiers and merges them into a single set in a non-destructive manner
 *
 * - The two sets of array can be unordered both in the entities they refer to and for the
 * list of identifiers that are used within each Omc Identifier
 *
 * - The two sets are paired up based on having the same scope/value pair, where one set contains
 * fewer OMC identifiers the result will contain all unique scope/value pairings for a given entity
 *
 * - When merging identifiers, properties are preserved if they are missing or null in the other identifier,
 * i.e. the url property will survive even when missing on one of the pairs.
 *
 * @memberof module:omcMerge
 * @function mergeIdentifier
 * @static
 * @param {OmcIdentifier} omcId1
 * @param {OmcIdentifier} omcId2
 * @returns {Array<OmcIdentifier>}
 */
export function mergeIdentifier(omcId1, omcId2) {
    const id1 = omcId1 ? omcId1 : []; // Convert null to empty array
    const id2 = omcId2 ? omcId2 : [];

    const blendedSet1 = id1.map((omcIdentifier) => idKeyMapping(omcIdentifier.identifier));
    const blendedSet2 = id2.map((omcIdentifier) => idKeyMapping(omcIdentifier.identifier));

    const matchedSet = blendedSet1.map((idSet) => {
        const matchKeys = Object.keys(idSet);
        const matchingId = matchKeys.find((key) => blendedSet2.find((id) => Object.keys(id).includes(key)));
        if (!matchingId) return [idSet, null]; // Nothing matching in the other set
        const matchingIdentifier = blendedSet2.find((id) => Object.keys(id).includes(matchingId));
        const matchingIndex = blendedSet2.findIndex((id) => Object.keys(id).includes(matchingId));
        blendedSet2.splice(matchingIndex, 1);
        return [idSet, matchingIdentifier];
    });

    const allMatchedSet = [
        ...matchedSet,
        ...(blendedSet2.map((idSet) => [idSet, null])),
    ];

    const finalIds = allMatchedSet.reduce((arr, [idSet1, idSet2]) => {
        let mergedSet;
        if (!idSet1) mergedSet = idSet2;
        if (!idSet2) mergedSet = idSet1;
        if (idSet1 && idSet2) {
            const idKeySet = [...(new Set(Object.keys(idSet1), Object.keys(idSet2)))];
            mergedSet = idKeySet.reduce((obj, idKeyVal) => ({
                ...obj,
                [idKeyVal]: mergeNonDestructive(idSet1[idKeyVal] || null, idSet2[idKeyVal] || null),
            }), {});
        }

        return [
            ...arr,
            { identifier: [...Object.values(mergedSet)] },
        ];
    }, []);
    return finalIds;
}

/**
 * @memberof module:omcMerge
 * @function mergeEntity
 * @static
 * @param {OmcEntity} omc1
 * @param {OmcEntity} omc2
 * @returns {OmcEntity}
 */
export function mergeEntity(omc1, omc2) {
    const result = { ...omc1, ...omc2 }; // Combine objects so properties from omc2 are merged in // ToDo: Use deep
    for (const key in omc2) {
        if (key === 'identifier') {
            result.identifier = mergeIdentifier(omc1.identifier, omc2.identifier);
        }
        if (isCapitalized(key)) {
            result[key] = Array.isArray(omc2[key]) ? mergeIdentifier(omc1[key], omc2[key]) : omc2[key];
        } else if (isPlainObject(omc2[key])) {
            result[key] = result[key] ? mergeEntity(result[key], omc2[key]) : omc2[key];
        } else {
            result[key] = Object.hasOwn(omc2, key) ? omc2[key] : result[key]; // The 2nd entity will prevail in conflicts if there is a value set
        }
    }
    return result;
}
