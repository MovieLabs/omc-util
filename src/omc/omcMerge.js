/**
 * @module omcMerge
 */

import { isCapitalized, isPlainObject, makeArray } from '../mlHelpers/util.js';

const omcObjectArrays = {
    identifier: ['identifierScope', 'identifierValue'],
    customData: ['domain', 'namespace'],
    annotation: ['author', 'title', 'value'],
    tag: ['domain', 'value'],
};

const createKey = ((obj, keys) => keys.reduce((str, key) => str + (obj[key] ? obj[key] : ''), ''));

function mergeArrayObject(existing, incoming, keys) {
    const mergedMap = existing.reduce((obj, omcId) => ({ ...obj, [createKey(omcId, keys)]: omcId }), {});
    const mergedObjects = incoming.reduce((acc, omcObj) => {
        const key = createKey(omcObj, keys);
        return Object.hasOwn(acc, key)
            ? { ...acc, [key]: { ...acc[key], ...omcObj } } // Merge the incoming into existing (existing wins)
            : { ...acc, [key]: omcObj }; // Merge the missing identifier in
    }, mergedMap);
    return Object.values(mergedObjects);
}

/**
 * Normalize a value for deep equality comparison of array items
 * Sorts object keys recursively to ensure order-independent comparison
 *
 * @ignore
 * @param {*} item
 * @returns {string}
 */
function normalizeForComparison(item) {
    if (item === null || item === undefined) return JSON.stringify(item);
    if (typeof item !== 'object') return JSON.stringify(item);
    if (Array.isArray(item)) {
        return JSON.stringify(item.map((i) => JSON.parse(normalizeForComparison(i))));
    }
    // Sort keys for order-independent object comparison
    const sorted = Object.keys(item).sort().reduce((acc, key) => {
        acc[key] = JSON.parse(normalizeForComparison(item[key]));
        return acc;
    }, {});
    return JSON.stringify(sorted);
}

/**
 * Merge two arrays of primitives or objects without regard to order
 * Existing order is preserved, unmatched incoming items are appended
 *
 * @ignore
 * @param {Array} existing - The existing array
 * @param {Array} incoming - The incoming array to merge
 * @returns {Array} - The merged array
 */
function mergeArrays(existing, incoming) {
    // Track which incoming items have been matched
    const incomingNormalized = incoming.map((item) => normalizeForComparison(item));
    const matched = new Array(incoming.length).fill(false);

    // For each existing item, find and mark its match in incoming
    const result = existing.map((item) => {
        const norm = normalizeForComparison(item);
        const matchIdx = incomingNormalized.findIndex((inNorm, idx) => !matched[idx] && inNorm === norm);
        if (matchIdx !== -1) matched[matchIdx] = true;
        return item;
    });

    // Append unmatched incoming items
    incoming.forEach((item, idx) => {
        if (!matched[idx]) result.push(item);
    });

    return result;
}

/**
 * Get the type category of a value for conflict detection
 *
 * @param {*} value
 * @returns {string}
 */
function typeCategory(value) {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) return 'array';
    if (isPlainObject(value)) return 'object';
    return 'primitive';
}

/**
 * Deep merge two objects, traversing the entire structure and merging at the leaves.
 *
 * - Recursively merges nested objects
 * - Arrays are compared without regard to order; existing order is preserved
 * - The `identifier` property is merged using omcIdentifier.merge
 * - Existing data is preserved unless incoming data overwrites it
 * - Type conflicts (e.g., string vs object) throw a TypeError, unless existing is null
 *
 * @function deepMerge
 * @param {object} existing - The existing object (its data is preserved by default)
 * @param {object} incoming - The incoming object to merge
 * @param {object} [options={}] - Merge options
 * @param {boolean} [options.nullOverwrite=false] - When true, null in incoming replaces existing values
 * @param {string} [path=''] - Internal: tracks the current property path for error messages
 * @returns {object} - The merged object
 * @throws {TypeError} If a type conflict is detected between existing and incoming values
 */
export function deepMerge(existing, incoming, options = {}, path = '') {
    const { nullOverwrite = false } = options;
    const result = { ...existing };

    for (const key of Object.keys(incoming)) {
        const existingVal = existing[key];
        const incomingVal = incoming[key];
        const currentPath = path ? `${path}.${key}` : key;

        // Key only in incoming → add it
        if (!(key in existing)) {
            result[key] = incomingVal;
            continue;
        }

        // Existing is null → incoming wins
        if (existingVal === null || existingVal === undefined) {
            result[key] = incomingVal;
            continue;
        }

        // Incoming is null → respect nullOverwrite option
        if (incomingVal === null || incomingVal === undefined) {
            if (nullOverwrite) result[key] = incomingVal;
            continue;
        }

        const existingType = typeCategory(existingVal);
        const incomingType = typeCategory(incomingVal);

        // Type conflict check
        if (existingType !== incomingType) {
            throw new TypeError(
                `Type conflict at '${currentPath}': cannot merge ${existingType} with ${incomingType}`,
            );
        }

        // Both are plain objects → recurse
        if (existingType === 'object') {
            result[key] = deepMerge(existingVal, incomingVal, options, currentPath);
            continue;
        }

        // Both are arrays
        if (existingType === 'array') {
            result[key] = omcObjectArrays[key]
                ? mergeArrayObject(existingVal, incomingVal, omcObjectArrays[key])
                : mergeArrays(existingVal, incomingVal);
            continue;
        }

        // Both are primitives → incoming overwrites
        result[key] = incomingVal;
    }

    return result;
}

export function mergeEntity(omc1, omc2, options) {
    if ((!omc1 && !omc2)) return false; // Safety checks
    if (!omc1 && omc2) return omc2; // omc1 is undefined and omc2 is good, return omc2
    if (omc1 && !omc2) return omc1; // omc2 is undefined and omc1 is good, return omc1
    if ((omc1?.entityType !== omc2?.entityType)) return false; // Safety checks
    return deepMerge(omc1, omc2, options);
}
