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
export default function omcCompare({ original, comparison }: {
    original: OmcEntity;
    comparison: OmcEntity;
}): DiffResult;
/**
 * - Result of a difference comparison
 */
export type DiffResult = {
    /**
     * - The original OMC entity
     */
    original: OmcEntity;
    /**
     * - The entity to which the original was compared
     */
    comparison: OmcEntity;
    /**
     * - null if same, or Object describing the difference
     */
    diff: ({
        [x: string]: {
            $remove: any;
        } | {
            $create: any;
        } | {
            $update: any;
        };
    } | null);
};
//# sourceMappingURL=omcCompare.d.ts.map