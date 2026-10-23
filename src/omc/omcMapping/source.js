/**
 * Where a mapping reads a value from a row: a column, named by its heading; a template — fixed
 * text with columns in braces, `{ template: 'scene-{Scene}-take-{Take}' }`, where `{{` and `}}`
 * write a literal brace; or an input — a path into the OMC entities the row carries under a name,
 * `{ input: 'video', path: 'assetFC.functionalType' }`.
 *
 * A key, an edge's `via` and a property can each take any of them, and all three read through here,
 * so a templated key and the edge that references it produce the same text.
 *
 * @module omcMapping/source
 */

import { hasValue, parseSegment } from './shapedValue.js';

import './types.js'; // Type definitions, resolved globally by JSDoc

// `{{`, `}}`, or a column in braces.
const TOKEN = /\{\{|\}\}|\{([^{}]*)\}/g;

/**
 * Is this source an input path?
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {boolean}
 */
const isInput = ((source) => typeof source?.input === 'string');

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
 * The inputs a source reads.
 *
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {Array<string>}
 */
export function sourceInputs(source) {
    return isInput(source) ? [source.input] : [];
}

/**
 * Every value at a dotted path under a value, descending into each member of an array the path
 * passes through, and spreading an array it ends on.
 *
 * @param {*} value
 * @param {Array<string>} parts - Path segments, each possibly with `[n]`
 * @returns {Array<*>} The non-empty values found
 */
function valuesAt(value, parts) {
    if (Array.isArray(value)) return value.flatMap((member) => valuesAt(member, parts));
    if (!parts.length) return hasValue(value) ? [value] : [];
    if (!value || typeof value !== 'object') return [];
    const { name, index } = parseSegment(parts[0]);
    const next = index === undefined ? value[name] : value[name]?.[index];
    return valuesAt(next, parts.slice(1));
}

/**
 * The values an input path gives on one row, from every entity the row carries under that name.
 *
 * @param {MappingRow} row
 * @param {{input: string, path: string}} source
 * @returns {Array<*>} The distinct non-empty values
 */
export function inputValues(row, source) {
    const parts = source.path ? source.path.split('.') : [];
    return [...new Set(valuesAt(row[source.input], parts))];
}

/**
 * The value a source gives on one row: a column's cell as it is, a template's text filled from the
 * row, or an input path's value — an array when it finds more than one.
 *
 * @param {MappingRow} row
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @returns {*} The value, or null when the cell is empty, any column the template names is, or the
 *   input path finds nothing
 */
export function sourceValue(row, source) {
    if (typeof source === 'string') return hasValue(row[source]) ? row[source] : null;
    if (isInput(source)) {
        const values = inputValues(row, source);
        if (!values.length) return null;
        return values.length === 1 ? values[0] : values;
    }
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
 * A source as a note names it: `column "Scene"`, `template "scene-{Scene}"` or
 * `input "video" path "label"`.
 *
 * @param {OmcMapping.ValueSource} source
 * @returns {string}
 */
export function sourceLabel(source) {
    if (typeof source === 'string') return `column "${source}"`;
    if (isInput(source)) return `input "${source.input}" path "${source.path ?? ''}"`;
    return `template "${source?.template}"`;
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
    if (isInput(a) || isInput(b)) return a.input === b.input && (a.path ?? '') === (b.path ?? '');
    return a.template === b.template;
}
