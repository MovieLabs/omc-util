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
export function deepMerge(existing: object, incoming: object, options?: {
    nullOverwrite?: boolean;
}, path?: string): object;
export function mergeEntity(omc1: any, omc2: any, options: any): any;
//# sourceMappingURL=omcMerge.d.ts.map