/**
 * The input fields of an entity type, as a flat list a form can render from.
 *
 * Pure: it is handed the shape and the graphQl filter template, so it imports nothing from the
 * template index that serves it.
 *
 * @module templates/fields
 * @ignore
 */

import { isCapitalized } from '../mlHelpers/util.js';

const isMap = ((value) => !!value && typeof value === 'object' && !Array.isArray(value));

/** An array node whose items are objects with properties of their own, not one scalar. */
const holdsObjects = ((node) => isMap(node.$items) && node.$items.$type === undefined);

/**
 * The parts of one field entry read off a scalar shape node.
 *
 * @param {Object} node - The shape node for the value (an array's `$items` for a list of values)
 * @returns {Object}
 */
const valueFacts = ((node) => ({
    type: node?.$type ?? 'string',
    ...(Array.isArray(node?.$enum) ? { enum: [...node.$enum] } : {}),
    ...(Array.isArray(node?.$controlledValues) ? { suggestions: [...node.$controlledValues] } : {}),
    ...(node?.$default !== undefined ? { default: node.$default } : {}),
}));

/**
 * Walk a shape into field entries, depth first, in the shape's own key order.
 *
 * @param {Object} shape - The shape node being walked
 * @param {string[]} prefix - Segments of `shape` from the entity's root
 * @param {Array<{path: string, maxItems: (number|undefined)}>} within - Arrays of objects above
 * @param {Set<string>} skipTop - Top-level keys to leave out
 * @param {Array<FieldEntry>} out
 * @returns {Array<FieldEntry>}
 */
function walk(shape, prefix, within, skipTop, out) {
    Object.entries(shape).forEach(([key, node]) => {
        if (key.startsWith('$') || !isMap(node)) return;
        if (prefix.length === 0 && skipTop.has(key)) return;
        if (isCapitalized(key)) return;

        const segments = [...prefix, key];
        const path = segments.join('.');

        if (node.$type === 'array' && holdsObjects(node)) {
            walk(node.$items, segments, [...within, { path, maxItems: node.$maxItems }], skipTop, out);
            return;
        }
        if (node.$type === undefined) {
            walk(node, segments, within, skipTop, out);
            return;
        }

        const isArray = node.$type === 'array';
        out.push({
            path,
            segments,
            label: key,
            isArray,
            within,
            ...valueFacts(isArray ? node.$items : node),
            ...(isArray && typeof node.$maxItems === 'number' ? { maxItems: node.$maxItems } : {}),
            ...(node.$required ? { required: true } : {}),
        });
    });
    return out;
}

/**
 * Flatten a graphQl filter template into the paths it accepts. A value written as an array means
 * the filter takes a list of values.
 *
 * @param {Object} filter
 * @param {string[]} [prefix]
 * @param {Array<{path: string, isArray: boolean, type: string}>} [out]
 * @returns {Array<{path: string, isArray: boolean, type: string}>}
 */
function filterPaths(filter, prefix = [], out = []) {
    if (!isMap(filter)) return out;
    Object.entries(filter).forEach(([key, value]) => {
        if (isCapitalized(key)) return;
        const segments = [...prefix, key];
        if (Array.isArray(value)) out.push({ path: segments.join('.'), isArray: true, type: value[0] || 'string' });
        else if (value === null || typeof value === 'string') {
            out.push({ path: segments.join('.'), isArray: false, type: value || 'string' });
        } else filterPaths(value, segments, out);
    });
    return out;
}

/**
 * The field entries for one entity type.
 *
 * @param {Object} params
 * @param {(Object|null)} params.shape - `omcTemplate.shape()` for the type
 * @param {(Object|null)} params.filter - `omcTemplate.graphQl().filter` for the type
 * @param {('edit'|'filter')} params.purpose
 * @param {string[]} params.recordKeys - Top-level keys that describe the record, not its data
 * @returns {Array<FieldEntry>}
 */
export default function deriveFields({
    shape, filter, purpose, recordKeys,
}) {
    const edit = isMap(shape) ? walk(shape, [], [], new Set(recordKeys), []) : [];
    if (purpose !== 'filter') return edit;

    // A filter path the shape does not know is still one the query accepts, so it is kept, typed
    // from the filter template alone.
    const byPath = new Map(edit.map((entry) => [entry.path, entry]));
    const skipTop = new Set(recordKeys);
    return filterPaths(filter).filter(({ path }) => !skipTop.has(path)).map(({ path, isArray, type }) => {
        const known = byPath.get(path);
        if (!known) {
            const segments = path.split('.');
            return {
                path, segments, label: segments.at(-1), isArray, within: [], type,
            };
        }
        const { maxItems: _maxItems, ...entry } = known;
        return { ...entry, isArray };
    });
}
