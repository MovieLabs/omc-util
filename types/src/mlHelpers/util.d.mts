/**
 * Spreads an object into another deeply, recursing down the object only overwriting keys in the object being spread
 *
 * @function deepSpread
 * @param {Object} obj - The target object in which to spread properties
 * @param {Object} spread - The object to be spread into obj, only the specific properties are spread into the target object
 * @returns {Object} A new Object with the combined properties
 */
export function deepSpread(obj: any, spread: any): any;
/**
 * Recursively deep copy an object
 *
 * @function recursiveDeepCopy
 * @param {Object|Array<Object>} obj
 * @returns {*}
 */
export function recursiveDeepCopy(obj: any | Array<any>): any;
/**
 * An asynchronous queue that limits the concurrency of the number of events at any one time
 *
 * @function asyncQueue
 * @param {number} concurrency  - The maximum number of events at one time
 * @param {function} qDone - Callback when queue has emptied
 * @returns {Promise<{push: push}>}
 */
export function asyncQueue(concurrency?: number, qDone?: Function): Promise<{
    push: push;
}>;
export function emptyString(value: string): (string | null);
export function capitalize(value: string): (string | null);
export function convertNum(value: string): number;
export function makeArray(value: any): any[];
export function hasProp(obj: object, prop: string): boolean;
export function isPlainObject(value: any): boolean;
export function isCapitalized(value: any): boolean;
