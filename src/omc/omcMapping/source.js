/**
 * Where a mapping reads a value from a row: a column, named by its heading; a template — fixed
 * text with columns, or input paths, in braces, `{ template: 'scene-{Scene}-take-{Take}' }`, where
 * `{{` and `}}` write a literal brace; or an input — a path into the OMC entities the row carries under a name,
 * `{ input: 'video', path: 'assetFC.functionalType' }`.
 *
 * A key, an edge's `via` and a property can each take any of them, and all three read through here,
 * so a templated key and the edge that references it produce the same text.
 *
 * @module omcMapping/source
 */

import { idKey } from '../omcIdentifier.js';

import { hasValue, parseSegment } from './shapedValue.js';

import './types.js'; // Type definitions, resolved globally by JSDoc

// `{{`, `}}`, or a column or input path in braces.
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
 * The identities of the entities a row carries under an input: each entity's identifier in `scope`,
 * or else its lowest, as `scope:value`.
 *
 * @param {MappingRow} row
 * @param {string} input
 * @param {string} [scope]
 * @returns {Array<string>} The distinct identities
 */
function identities(row, input, scope) {
    return [...new Set([row[input] ?? []].flat()
        .filter((ent) => ent?.identifier?.length)
        .map((ent) => {
            const inScope = ent.identifier.find((id) => id.identifierScope === scope);
            return inScope ? idKey(inScope) : ent.identifier.map(idKey).sort()[0];
        }))];
}

/**
 * The values an input source gives: those at its path, or with no path, its entities' identities.
 *
 * @param {MappingRow} row
 * @param {{input: string, path: string}} source
 * @param {string} [scope]
 * @returns {Array<*>}
 */
const inputSourceValues = ((row, source, scope) => (source.path
    ? inputValues(row, source)
    : identities(row, source.input, scope)));

/**
 * Is a cell an input — an OMC entity, a list of them, or an empty list — rather than a column's value?
 *
 * @param {*} cell
 * @returns {boolean}
 */
const isInputCell = ((cell) => (Array.isArray(cell) && !cell.length)
    || [cell].flat().some((member) => Array.isArray(member?.identifier)));

/**
 * The values one template token gives: its column's cell, or, where the row has no such column and
 * the token begins with an input's name, that input read as `{ input, path }` (`{Asset.label}`, or
 * `{Asset}` for its identities).
 *
 * @param {MappingRow} row
 * @param {string} token
 * @param {string} [scope]
 * @returns {Array<*>}
 */
function tokenValues(row, token, scope) {
    if (hasValue(row[token]) && !isInputCell(row[token])) return [row[token]];
    const [input, ...rest] = token.split('.');
    if (!isInputCell(row[input])) return [];
    // An object is not text: a token reaching one reads nothing, rather than "[object Object]".
    return inputSourceValues(row, { input, path: rest.join('.') }, scope).filter((v) => typeof v !== 'object');
}

/**
 * The value a source gives on one row: a column's cell as it is, a template's text filled from the
 * row, or an input's values — an array when there is more than one. An input read with no path gives
 * its entities' identities. A template token reading several values gives one text for each, so
 * tokens of many values multiply: three of ten give a thousand texts.
 *
 * @param {MappingRow} row
 * @param {(OmcMapping.ValueSource|null|undefined)} source
 * @param {OmcMapping.MappingOptions} [options] - `identifierScope` chooses an entity's identity
 * @returns {*} The value, or null when the cell is empty, any token the template names is, or the
 *   input finds nothing
 */
export function sourceValue(row, source, options = {}) {
    if (typeof source === 'string') return hasValue(row[source]) ? row[source] : null;
    const one = ((values) => {
        if (!values.length) return null;
        return values.length === 1 ? values[0] : values;
    });
    if (isInput(source)) return one(inputSourceValues(row, source, options.identifierScope));
    if (typeof source?.template !== 'string') return null;
    // Each piece of the text is a set of alternatives; the texts are every combination of them.
    const pieces = [];
    let at = 0;
    for (const match of source.template.matchAll(TOKEN)) {
        pieces.push([source.template.slice(at, match.index)]);
        pieces.push(match[1] === undefined ? [match[0][0]] : tokenValues(row, match[1], options.identifierScope).map(String));
        at = match.index + match[0].length;
    }
    pieces.push([source.template.slice(at)]);
    if (pieces.some((piece) => !piece.length)) return null;
    const texts = pieces.reduce((acc, piece) => acc.flatMap((text) => piece.map((p) => `${text}${p}`)), ['']);
    return one([...new Set(texts)]);
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
