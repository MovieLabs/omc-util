/**
 * Deep merge two objects, traversing the entire structure and merging at the leaves.
 *
 * - Recursively merges nested objects
 * - Arrays are compared without regard to order; existing order is preserved
 * - Keyed object arrays (`identifier`, `customData`, `annotation`, `tag`) merge on their key fields
 * - Relationship arrays merge on the **referenced identifier** (see mergeReferenceArray), so the
 *   same edge expressed as a bare reference and as a nested entity collapses to one
 * - Existing data is preserved unless incoming data overwrites it
 * - Type conflicts (e.g., string vs object) throw a TypeError, unless existing is null
 *
 * @function deepMerge
 * @param {object} existing - The existing object (its data is preserved by default)
 * @param {object} incoming - The incoming object to merge
 * @param {object} [options={}] - Merge options
 * @param {boolean} [options.nullOverwrite=false] - When true, null in incoming replaces existing values
 * @param {string} [options.schemaVersion] - Schema version used to recognise relationship keys.
 *   `mergeEntity` supplies it from the entities themselves; without it relationship arrays fall
 *   back to structural comparison.
 * @param {string} [path=''] - Internal: tracks the current property path for error messages
 * @returns {object} - The merged object
 * @throws {TypeError} If a type conflict is detected between existing and incoming values
 */
export function deepMerge(existing: object, incoming: object, options?: {
    nullOverwrite?: boolean;
    schemaVersion?: string;
}, path?: string): object;
export function mergeEntity(omc1: any, omc2: any, options?: {}): any;
//# sourceMappingURL=omcMerge.d.ts.map