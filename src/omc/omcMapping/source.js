/**
 * Where a mapping reads a value from a row: a column, named by its heading, or a template — fixed
 * text with columns in braces, `{ template: 'scene-{Scene}-take-{Take}' }`. `{{` and `}}` write a
 * literal brace.
 *
 * A key, an edge's `via` and a property can each take either, and all three read through here, so a
 * templated key and the edge that references it produce the same text.
 *
 * @module omcMapping/source
 */

import { hasValue } from './shapedValue.js';

import './types.js'; // Type definitions, resolved globally by JSDoc

// `{{`, `}}`, or a column in braces.
const TOKEN = /\{\{|\}\}|\{([^{}]*)\}/g;

/**
 * The columns a source reads.
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {Array<string>}
 */
export function sourceColumns(source) {
    if (typeof source === 'string') return [source];
    if (typeof source?.template !== 'string') return [];
    return [...source.template.matchAll(TOKEN)].map((m) => m[1]).filter((column) => column !== undefined);
}

/**
 * The value a source gives on one row: a column's cell as it is, or a template's text filled from
 * the row.
 *
 * @param {MappingRow} row
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {*} The value, or null when the cell is empty, or any column the template names is
 */
export function sourceValue(row, source) {
    if (typeof source === 'string') return hasValue(row[source]) ? row[source] : null;
    if (typeof source?.template !== 'string') return null;
    let empty = false;
    const text = source.template.replace(TOKEN, (token, column) => {
        if (column === undefined) return token[0];
        if (!hasValue(row[column])) empty = true;
        return String(row[column] ?? '');
    });
    return empty ? null : text;
}

/**
 * A source as a note names it: `column "Scene"` or `template "scene-{Scene}"`.
 *
 * @param {OmcMapping.ValueSource} source
 * @returns {string}
 */
export function sourceLabel(source) {
    return typeof source === 'string' ? `column "${source}"` : `template "${source?.template}"`;
}

/**
 * Do two sources read the same thing?
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} a
 * @param {(OmcMapping.ValueSource|null|undefined)} b
 * @returns {boolean}
 */
export function sameSource(a, b) {
    if (!a || !b) return false;
    if (typeof a === 'string' || typeof b === 'string') return a === b;
    return a.template === b.template;
}
