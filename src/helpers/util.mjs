/**
 * @module
 * @desc A set of useful utility functions
 *
 * @property { function } emptyString - Cleanup string and check if empty
 * @property { function } capitalize - Capitalize first letter of string
 * @property { function } convertNum - Convert a string number (with commas) to number primitive
 * @property { function } makeArray - Ensure value is array if not so already
 * @property {function} hasProp - Safely check if Object has this as own property
 */

/**
 * Trim any whitespace from a string, if the parameter passed in is either not a string
 * or is an empty string, or just has whitespace null will be returned, otherwise a trimmed string will be returned
 *
 * @param {string} str
 * @returns {(string|null)} - A valid non-empty string or null
 */

export const emptyString = (str) => (typeof str !== 'string' || str.trim().length === 0 ? null : str.trim());

/**
 * Capitalize the first letter of the string
 *
 * @param {string} str - String to be capitalized
 * @returns {(string|null)} - String with first letter capitalized or if not a string null is returned
 */

export const capitalize = (str) => (typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : null);

/**
 * Convert a string to a number, dealing with any comma separators in the string
 *
 * @param {string} str - String to be converted to a number
 * @returns {number} - A string converted to a number primitive
 */

export const convertNum = (str) => +str.replace(/,/g, '');

/**
 * Coerces any value into an array, making it iterable, existing arrays are returned as is
 *
 * @param {Object} val - Value to be placed in an array
 * @returns {Array}
 */

export const makeArray = (val) => (Array.isArray(val) ? val : [val]);

/**
 * Safely check whether a property exists as one of its own properties
 *
 * @param {object} obj - The object on which to check the property
 * @param {string} prop - The property name to be checked
 * @returns {boolean}
 */

export const hasProp = function hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

/**
 * Test if a something is a Javascript plain Object
 * excludes functions, arrays, null, undefined, NaN, strings, numbers, etc.
 *
 * @param {*} obj  - The variable to be tested
 * @returns {boolean} - True if a plain Object was passed in or false if not a plain Object
 */

export const isPlainObject = ((obj) => typeof obj === 'object'
  && obj !== null
  && !Array.isArray(obj)
  && !(obj instanceof Function));

/**
 * Tests if the string passed in is capitalized
 * @param {*} str - The variable to be tested
 * @returns {boolean} - True if a string and the first letter is capitalized
 */

// export const isCapitalized = ((str) => typeof str === 'string' && str[0] === str[0].toUpperCase());
export const isCapitalized = (str) => typeof str === 'string' && str.length > 0 && /^[A-Z]/.test(str);

/**
 * Spreads an object into another deeply, recursing down the object only overwriting the explicitly include keys
 * in the object being spread
 * @param {Object} obj - The target object in which to spread properties
 * @param {Object} spread - The object with only the properties to be spread into the target object
 * @returns {Object}
 */

export function deepSpread(obj, spread) {
    return Object.keys(spread).reduce((acc, key) => (
        isPlainObject(spread[key])
            ? { ...acc, [key]: deepSpread(acc[key], spread[key]) }
            : { ...acc, [key]: spread[key] }), obj);
}

/**
 * Recursively deep copy an object
 *
 * @param {Object|Array<Object>} o
 * @returns {*}
 */

export function recursiveDeepCopy(o) {
    let newO;
    let i;

    if (typeof o !== 'object') {
        return o;
    }
    if (!o) {
        return o;
    }

    if (Object.prototype.toString.apply(o) === '[object Array]') {
        newO = [];
        for (i = 0; i < o.length; i += 1) {
            newO[i] = recursiveDeepCopy(o[i]);
        }
        return newO;
    }

    newO = {};
    for (i in o) {
        if (Object.hasOwn(o, i)) {
            newO[i] = recursiveDeepCopy(o[i]);
        }
    }
    return newO;
}

/**
 * An asynchronous queue that limits the concurrency of the number of events at any one time
 * @param {number} concurrency  - The maximum number of events at one time
 * @param {function} qDone - Callback when queue has emptied
 * @returns {Promise<{push: push}>}
 */

export async function asyncQueue(concurrency = 2, qDone = null) {
    let running = 0;
    const taskQueue = [];

    const runTask = async () => {
        if (taskQueue.length !== 0) {
            running += 1;
            const task = taskQueue.shift(); // Pop the next task off the list
            await task();
            // await func; // Wait for the task to complete
            running -= 1;
            return runTask(); // Move to the next task in the list
        }
        if (qDone !== null && running === 0) qDone(); // Callback when queue is empty
        return false;
    };

    return {
        push: (task) => {
            const tasks = makeArray(task);
            taskQueue.push(...tasks);
            while (taskQueue.length > 0 && running < concurrency) runTask();
        },
    };
}
