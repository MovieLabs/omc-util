/**
 * Compare two Omc Entities and return a description of the differences between the two
 *
 * @module omcCompare
 */

/**
 * @typedef {Object} DiffResult - Result of a difference comparison
 * @property {OmcEntity} original - The original OMC entity
 * @property {OmcEntity} comparison - The entity to which the original was compared
 * @property {(Object.<string, {$remove: *} | {$create: *} | {$update: *}> | null)} diff - null if same, or Object describing the difference
 */

import { isPlainObject } from '../mlHelpers/util.mjs';

// Normalize primitives into strings for output;
const normalizeItem = ((item) => ((
    typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')
    ? item
    : JSON.stringify(item)));

/**
 * Compare two arrays and return differences, without regard to order
 *
 * @ignore
 * @param {Array} arr1 - The left-hand side array being compared to
 * @param {Array} arr2 - The right-hand side array being compared
 * @returns {{$remove: Array<*>, $create: Array<*>}} Items in the arrays that should be removed or created
 */
function compareArrays(arr1, arr2) {
    const lhs = arr1.map((item) => normalizeItem(item));
    const rhs = arr2.map((item) => normalizeItem(item));
    const diff = {
        $create: [],
        $remove: [],
    };
    arr1.forEach((item) => {
        if (!rhs.includes(normalizeItem(item))) {
            diff.$remove.push(item);
        } else {
            rhs.splice(rhs.indexOf(normalizeItem(item)), 1);
        }
    });
    arr2.forEach((item) => {
        if (!lhs.includes(normalizeItem(item))) {
            diff.$create.push(item);
            rhs.splice(rhs.indexOf(normalizeItem(item)), 1);
        } else {
            lhs.splice(lhs.indexOf(normalizeItem(item)), 1);
        }
    });
    return diff;
}

/**
 * Compare the keys of two OMC-JSON objects without regard to order
 *
 * @ignore
 * @param {Object} lhs - The left-hand side, object being compared to
 * @param {Object} rhs - The right-hand side, object being compared
 * @returns {{(Object.<string, {$remove: Array<*>} | {$create: Array<*>}>)}} Items that should be removed or created
 */
function compareKeys(lhs, rhs) {
    const lhsKeys = Object.keys(lhs);
    const rhsKeys = Object.keys(rhs);
    const keyDiff = compareArrays(lhsKeys, rhsKeys);

    // Create the diff object showing the added and removed keys and values
    const diff = {};
    keyDiff.$create.forEach((key) => {
        diff[key] = {
            $create: rhs[key],
        };
    });
    keyDiff.$remove.forEach((key) => {
        diff[key] = {
            $remove: lhs[key],
        };
    });

    return diff;
}

/**
 * Compare the values for each key of two objects
 *
 * @ignore
 * @param {Object} lhs
 * @param {Object} rhs
 * @returns {{(Object.<string, {$remove: Array<*>} | {$create: Array<*>}> | {$update: *} )}} Items that should be removed or created
 */
function compareValues(lhs, rhs) {
    const diff = {};
    Object.keys(lhs)
        .forEach((key) => {
            // Check if the key exists in the right-hand side and the value is a string or number
            if (rhs[key] && (typeof lhs[key] === 'string' || typeof lhs[key] === 'number')) {
                if (lhs[key] !== rhs[key]) {
                    diff[key] = {
                        $update: rhs[key],
                    };
                }
            }

            // Check values in arrays, without regard to order
            if (rhs[key] && Array.isArray(lhs[key]) && Array.isArray(rhs[key])) {
                const arrayDiff = compareArrays(lhs[key], rhs[key]);
                if (arrayDiff.$create.length || arrayDiff.$remove.length) {
                    diff[key] = arrayDiff;
                }
            }

            // Check values in complex objects, without regard key order
            if (rhs[key] && isPlainObject(lhs[key]) && isPlainObject(rhs[key])) {
                const keyDiff = compareKeys(lhs[key], rhs[key]); // Check for addition or deletion of keys
                const propertyDiff = compareValues(lhs[key], rhs[key]); // Check for changes in values
                const changes = { ...keyDiff, ...propertyDiff };
                if (Object.keys(changes).length) diff[key] = changes;
            }
        });
    return diff;
}

/**
 * Compares two OMC-JSON entities and returns the differences
 *
 * If the two entities are no different, having the same properties and values, the diff property will be null in the response
 *
 * If there are differences the diff property will contain an Object with just the properties that are different,
 * objects are compared without concern for the order of keys/properties.
 *
 * The value of the properties contain an action such as $create or $remove that describes what you would need to do
 * to the original to make it equal with the comparison.
 *
 * Primitive values are compared directly to one another
 * $remove - The property does not exist in the comparison and should be removed from the original.
 * $create - The property does not exist in the original and should be created.
 * $update - The property exists in both, but should be updated in the original
 *
 * Arrays are compared, but ordering is not considered, a direct comparison of each value is made.
 * i.e. the two arrays ['1', '2'] and ['2', '1'] are considered equal.
 * $remove - The elements in the response should be removed from the corresponding array in the original.
 * $create - The elements in the response should be added to the corresponding array in the original.
 *
 * Arrays of objects require the objects to be exactly alike to not be considered different.
 * In the case where two objects have the same key, but a different value, the entire object is considered
 * different, one would be removed, the other created.
 * i.e. in this example [{ a: '1'}, { b: '1' }] and [{ a: '1'}, { b: '2' }], the object with 'a' is considered the same
 * in both, and there is no action, the object 'b' is different, { b: '1' } would be removed and { b: '2' } created.
 *
 * @function omcCompare
 * @static
 * @param {Object} params
 * @param {OmcEntity} params.original - The source OMC entity
 * @param {OmcEntity} params.comparison - The OMC entity to compare against the original
 * @returns {DiffResult} The result of the comparison
 */
export default function omcCompare({ original, comparison }) {
    // If any of the entities is missing, then do not compare
    if (!original || !comparison) return { original, comparison, diff: null };

    const keyDiff = compareKeys(original, comparison); // Check for addition or deletion of keys
    const propertyDiff = compareValues(original, comparison); // Check for changes in values
    const diff = { ...keyDiff, ...propertyDiff };
    return {
        original,
        comparison,
        diff: Object.keys(diff).length ? diff : null, // Return null if there are no differences
    };
}
