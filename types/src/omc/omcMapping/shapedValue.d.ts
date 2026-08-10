/**
 * Read and write values at a path, against the entity's shape.
 *
 * A dotted path is not enough on its own: OMC puts `annotation` in an array of objects, `slugline`
 * in an array of scalars, and `assetStructureProperties.fileDetails.fileName` in plain nested
 * objects. Writing `annotation.author` as `{annotation: {author}}` produces an entity the schema
 * rejects. So the shape decides how each segment is placed, and callers never do their own
 * array-wrapping or `identifier[0]` surgery.
 *
 * The shape is `omcTemplate.shape()`'s `$type`/`$items` form.
 *
 * @module omcMapping/shapedValue
 */
/**
 * Split a path segment into its name and optional explicit array index.
 *
 * `identifier[0]` → `{ name: 'identifier', index: 0 }`; `name` → `{ name, index: undefined }`.
 *
 * @param {string} seg - One path segment
 * @returns {{name: string, index: (number|undefined)}} The parts
 */
export function parseSegment(seg: string): {
    name: string;
    index: (number | undefined);
};
/**
 * Write `value` into `cursor` at a shaped path.
 *
 * - **Array-of-object** nodes (`{$type:'array', $items:{…}}`) create or reuse a single element and
 *   descend, so `annotation.author` and `annotation.title` merge into one element rather than two.
 * - An **explicit index** (`annotation[1].author`) targets that element.
 * - **Array-of-scalar** leaves wrap the value: `slug` → `[slug]`.
 * - Where the shape runs out — deeper than it describes — it falls back to plain nested objects.
 *
 * Mutates `cursor` in place.
 *
 * @param {Object} cursor - The object being written into
 * @param {Array<string>} parts - Remaining path segments, pre-split on `.`
 * @param {*} value - The value to write at the leaf
 * @param {(Object|undefined)} shape - Shape node describing `cursor`'s properties
 */
export function writeShaped(cursor: any, parts: Array<string>, value: any, shape: (any | undefined)): void;
/**
 * Read the value at a shaped path — the reader twin of {@link writeShaped}, mirroring its rules.
 *
 * Array-of-scalar leaves are unwrapped, so a round trip through `writeShaped`/`getShaped` returns
 * what went in. Returns `undefined` when the path is absent.
 *
 * @param {Object} cursor - The object being read from
 * @param {Array<string>} parts - Remaining path segments, pre-split on `.`
 * @param {(Object|undefined)} shape - Shape node describing `cursor`'s properties
 * @returns {*} The value, or undefined
 */
export function getShaped(cursor: any, parts: Array<string>, shape: (any | undefined)): any;
export function hasValue(v: any): boolean;
//# sourceMappingURL=shapedValue.d.ts.map