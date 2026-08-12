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
export function parseSegment(seg) {
    const m = /^(.*)\[(\d+)\]$/.exec(seg);
    return m ? { name: m[1], index: Number(m[2]) } : { name: seg, index: undefined };
}

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
export function writeShaped(cursor, parts, value, shape) {
    if (value === undefined) return;
    const { name, index } = parseSegment(parts[0]);
    const node = shape ? shape[name] : undefined;
    const isArray = node?.$type === 'array';
    const isLast = parts.length === 1;

    if (index !== undefined) {
        if (!Array.isArray(cursor[name])) cursor[name] = [];
        while (cursor[name].length <= index) cursor[name].push({});
        if (isLast) cursor[name][index] = value;
        else writeShaped(cursor[name][index], parts.slice(1), value, node?.$items);
        return;
    }

    if (isLast) {
        cursor[name] = isArray && !Array.isArray(value) ? [value] : value;
        return;
    }
    if (isArray) {
        // Implicit single element; sibling sub-property mappings merge into the same one.
        if (!Array.isArray(cursor[name]) || cursor[name].length === 0) cursor[name] = [{}];
        writeShaped(cursor[name][0], parts.slice(1), value, node.$items);
        return;
    }
    if (cursor[name] == null || typeof cursor[name] !== 'object' || Array.isArray(cursor[name])) {
        cursor[name] = {};
    }
    writeShaped(cursor[name], parts.slice(1), value, node);
}

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
export function getShaped(cursor, parts, shape) {
    if (!cursor || typeof cursor !== 'object') return undefined;
    const { name, index } = parseSegment(parts[0]);
    const node = shape ? shape[name] : undefined;
    const isArray = node?.$type === 'array';
    const isLast = parts.length === 1;

    if (index !== undefined) {
        const arr = cursor[name];
        if (!Array.isArray(arr)) return undefined;
        if (isLast) return arr[index];
        return getShaped(arr[index], parts.slice(1), node?.$items);
    }

    if (isLast) {
        const v = cursor[name];
        if (isArray && Array.isArray(v)) return v.length ? v[0] : undefined;
        return v;
    }
    if (isArray) {
        const arr = cursor[name];
        if (!Array.isArray(arr) || arr.length === 0) return undefined;
        return getShaped(arr[0], parts.slice(1), node.$items);
    }
    return getShaped(cursor[name], parts.slice(1), node);
}

/**
 * The fully-indexed path a value actually lands at.
 *
 * {@link writeShaped} treats an array-of-object segment with no index as element 0 — `annotation.text`
 * and `annotation[0].text` write to the same place. That is a convenience for whoever authors a
 * mapping by hand, and a trap for anything that has to *address* the result: an editor rendering
 * `annotation[0].text` and a mapping saying `annotation.text` name one value with two strings, and
 * two strings that must match never do.
 *
 * So the implicit index is made explicit here, by the same descent that writes it. Segments the
 * shape does not describe are returned unchanged.
 *
 * @param {Array<string>} parts - Path segments, pre-split on `.`
 * @param {(Object|undefined)} shape - Shape node describing the root
 * @returns {Array<string>} The canonical segments
 *
 * @example
 * shapedPath(['annotation', 'text'], shape); // ['annotation[0]', 'text']
 */
export function shapedPath(parts, shape) {
    const out = [];
    let node = shape;
    for (let i = 0; i < parts.length; i += 1) {
        const { name, index } = parseSegment(parts[i]);
        const child = node && typeof node === 'object' ? node[name] : undefined;
        const isLast = i === parts.length - 1;
        // Only a non-leaf array of objects carries an element index. An array-of-scalar leaf is
        // written as a whole array, and a leaf index the caller gave is kept as it came.
        const implicit = !isLast && index === undefined && child?.$type === 'array';
        out.push(implicit ? `${name}[0]` : parts[i]);
        node = child?.$type === 'array' ? child.$items : child;
    }
    return out;
}

/**
 * The scalar type OMC declares at a shaped path.
 *
 * The twin of {@link writeShaped}'s descent, so it answers for exactly the leaf a write would land
 * on: an array-of-scalar leaf reports its **item** type, because that is what the value becomes
 * before being wrapped.
 *
 * Used to promote text to what the schema says it is. A text source — a CSV, a form field — has no
 * types, and guessing one from the characters is wrong precisely where it matters most: `16E-1` is
 * a slate, not `1.6`. So nothing is inferred from the value; the type is asked of the schema.
 *
 * @param {Array<string>} parts - Path segments, pre-split on `.`
 * @param {(Object|undefined)} shape - Shape node describing the root
 * @returns {(string|undefined)} `'string'`, `'number'`, `'boolean'`, … or undefined when the shape
 *   does not describe this path
 */
export function typeAtPath(parts, shape) {
    let node = shape;
    for (let i = 0; i < parts.length; i += 1) {
        if (!node || typeof node !== 'object') return undefined;
        node = node[parseSegment(parts[i]).name];
        if (!node) return undefined;
        if (i === parts.length - 1) {
            return node.$type === 'array' ? node.$items?.$type : node.$type;
        }
        if (node.$type === 'array') node = node.$items;
    }
    return undefined;
}

/**
 * Is a value present?
 *
 * An empty string counts as **absent**. A spreadsheet reader fills blank cells with `''`, and a
 * blank cell says the source recorded nothing — not that it recorded emptiness.
 *
 * @param {*} v - The value
 * @returns {boolean} True when the value carries information
 */
export const hasValue = (v) => v !== '' && v !== undefined && v !== null;
