/**
 * @module omcMerge
 */

import { isPlainObject } from '../mlHelpers/util.js';
import { omcTemplate } from '../templates/index.js';

import { idIsDuplicate } from './omcIdentifier.js';

/**
 * The top-level property a dotted path belongs to.
 *
 * `identifier[0].url` answers to `identifier`, `edges.has.Scene[1]` to `edges`. Splitting on the
 * first `.` or `[` is enough — OMC property names contain neither.
 *
 * Exported because the paths in {@link MergeChanges} are this module's format, so a consumer
 * grouping them by property would otherwise have to restate that format from outside.
 *
 * @function pathRoot
 * @param {string} path - A path as reported in `MergeChanges.added` / `MergeChanges.updated`
 * @returns {string} The top-level property name, or `''` for an empty path
 *
 * @example
 * pathRoot('AssetStructure[0].assetStructureType'); // 'AssetStructure'
 */
// Not wrapped in the usual extra parens: tsc reads the JSDoc off a bare arrow but not off a
// parenthesised one, and the emitted declaration degrades to `(path: any): any`.
export const pathRoot = (path) => (path ? path.split(/[.[]/, 1)[0] : '');

/**
 * Whether two objects sitting in the same array describe the same thing.
 *
 * Only the properties **present and non-null in both** are compared — those are the only ones where
 * the two can actually disagree. A property one of them is silent about is not a difference of
 * opinion; it is one of them knowing less.
 *
 * At least one such property must exist. Without that floor the test passes vacuously for objects
 * with nothing in common, and two entries describing genuinely different things collapse into one
 * merely because they happened to use different property names.
 *
 * This replaces a table of hand-declared key fields per array (`identifier` on scope+value,
 * `customData` on domain+namespace, and so on). The general rule gives the same answer for
 * identifiers — same scope and value merge and pick up a `url`, a different value stays a separate
 * entry — and extends to every other array of objects in the schema without anyone having to
 * remember to add it to a list.
 *
 * @ignore
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
function sameArrayObject(a, b) {
    let shared = 0;
    for (const key of Object.keys(a)) {
        // Absent and null are the same statement here, which is what entities normalized by
        // `cleanEntity` guarantee anyway.
        if (a[key] == null || b[key] == null) continue;
        if (normalizeForComparison(a[key]) !== normalizeForComparison(b[key])) return false;
        shared += 1;
    }
    return shared > 0;
}

/**
 * Combine two array objects already judged to be the same thing.
 *
 * The union of their properties. Where only one side has a value it is taken whichever side that
 * is — that is the whole point, since `{ prop1: 'ABC' }` and `{ prop1: 'ABC', prop2: 'XYZ' }` are
 * one entry that knows more than the other. A plain spread cannot do this: it would let an absent
 * or null incoming property erase a value the existing one holds.
 *
 * @ignore
 * @param {object} existing
 * @param {object} incoming
 * @param {boolean} preferExisting - Which side wins a property they both hold a value for
 * @returns {object}
 */
function combineArrayObjects(existing, incoming, preferExisting) {
    const keys = new Set([...Object.keys(existing), ...Object.keys(incoming)]);
    const merged = {};
    keys.forEach((key) => {
        const e = existing[key];
        const i = incoming[key];
        if (e == null) merged[key] = i ?? null;
        else if (i == null) merged[key] = e;
        else merged[key] = preferExisting ? e : i;
    });
    return merged;
}

/**
 * Normalize a value for deep equality comparison of array items
 * Sorts object keys recursively to ensure order-independent comparison
 *
 * @ignore
 * @param {*} item
 * @returns {string}
 */
function normalizeForComparison(item) {
    if (item === null || item === undefined) return JSON.stringify(item);
    if (typeof item !== 'object') return JSON.stringify(item);
    if (Array.isArray(item)) {
        return JSON.stringify(item.map((i) => JSON.parse(normalizeForComparison(i))));
    }
    // Sort keys for order-independent object comparison
    const sorted = Object.keys(item).sort().reduce((acc, key) => {
        acc[key] = JSON.parse(normalizeForComparison(item[key]));
        return acc;
    }, {});
    return JSON.stringify(sorted);
}

/**
 * Merge two arrays without regard to order. Existing order is preserved and unmatched incoming
 * items are appended, so the existing prefix never moves.
 *
 * Objects match on {@link sameArrayObject} — the properties both hold a value for — and matches are
 * combined rather than duplicated. That is what lets `{ titleName: 'Europa' }` and
 * `{ titleName: 'Europa', titleType: 'working' }` arrive as one title rather than two. Primitives,
 * and anything else that is not a plain object, match on exact value as before.
 *
 * @ignore
 * @param {Array} existing - The existing array
 * @param {Array} incoming - The incoming array to merge
 * @param {boolean} [preferExisting=false] - Which side wins a property both hold a value for
 * @returns {Array} - The merged array
 */
function mergeArrays(existing, incoming, preferExisting = false) {
    const result = [...existing];

    incoming.forEach((item) => {
        if (!isPlainObject(item)) {
            const norm = normalizeForComparison(item);
            if (!result.some((e) => normalizeForComparison(e) === norm)) result.push(item);
            return;
        }
        // First match wins. Several existing entries can satisfy the rule — an entry that names
        // only `titleName` matches every title sharing it — so the choice is deliberate and
        // deterministic rather than arbitrary.
        const idx = result.findIndex((e) => isPlainObject(e) && sameArrayObject(e, item));
        if (idx === -1) result.push(item);
        else result[idx] = combineArrayObjects(result[idx], item, preferExisting);
    });

    return result;
}

/**
 * Merge two arrays of entity references (a relationship property such as `Asset.AssetStructure`).
 *
 * Identity here is the **referenced entity**, not the shape of the referencing object. The same
 * relationship legitimately appears in several forms — a bare `{ identifier: [...] }` reference, a
 * reference carrying `entityType`, or the whole nested entity — and OMC's schema permits all of
 * them (`items.anyOf: [reference, <Entity>]`). Structural comparison therefore sees two unequal
 * objects where the data means one edge, and keeps both. That duplication is not merely untidy: it
 * overflows capped relationships (`Asset.AssetStructure` is `maxItems: 1`), so the merged entity
 * fails validation.
 *
 * Two references match when their identifier sets intersect, which is the same test used to
 * enforce identifier uniqueness elsewhere. Matches are deep-merged, so a bare reference and an
 * expanded entity collapse into the richer of the two rather than one overwriting the other.
 * References carrying no identifier cannot be keyed, so they fall back to structural de-duplication.
 *
 * @ignore
 * @param {Array} existing
 * @param {Array} incoming
 * @param {object} options - Passed through to deepMerge for matched pairs
 * @param {string} path - Current property path, for error messages
 * @returns {Array}
 */
function mergeReferenceArray(existing, incoming, options, path) {
    const result = [...existing];

    incoming.forEach((item) => {
        const ids = Array.isArray(item?.identifier) ? item.identifier : null;
        const matchIdx = ids && ids.length
            ? result.findIndex((e) => Array.isArray(e?.identifier) && idIsDuplicate(e.identifier, ids))
            : -1;

        if (matchIdx !== -1) {
            result[matchIdx] = deepMerge(result[matchIdx], item, options, path);
            return;
        }
        // Either a genuinely different entity, or one with no identifier to key on.
        const norm = normalizeForComparison(item);
        if (!result.some((e) => normalizeForComparison(e) === norm)) result.push(item);
    });

    return result;
}

/**
 * Get the type category of a value for conflict detection
 *
 * @param {*} value
 * @returns {string}
 */
function typeCategory(value) {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) return 'array';
    if (isPlainObject(value)) return 'object';
    return 'primitive';
}

/**
 * True when a value holds nothing: absent, null, an empty array, or an empty object.
 *
 * Under `emptyAsNull` these are all the same statement — "nothing is known" — which is what a
 * GraphQL response gives back for an unpopulated field. Treating them as distinct makes an empty
 * container look like content it is not.
 *
 * @ignore
 * @param {*} value
 * @returns {boolean}
 */
function isEmptyValue(value) {
    if (value === null || value === undefined) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (isPlainObject(value)) return Object.keys(value).length === 0;
    return false;
}

/**
 * Reject a merge between two objects that describe different things.
 *
 * `entityType` and `schemaVersion` are claims about what a record IS, so two objects that both
 * make the claim and disagree cannot be merged — at any depth. Nested references are checked as
 * well as the entity itself: a relationship array whose two references share an identifier but
 * name different types is a broken model, and silently merging them buries it.
 *
 * Declared on one side only is NOT a conflict. A bare `{ identifier: [...] }` reference carries
 * neither, and the whole point of `mergeReferenceArray` is that such a reference collapses into
 * the expanded entity for the same thing.
 *
 * @ignore
 * @param {object} existing
 * @param {object} incoming
 * @param {string} path - Current property path, for the error message
 * @throws {TypeError} If both sides declare an identity key and the values differ
 */
function assertSameIdentity(existing, incoming, path) {
    ['entityType', 'schemaVersion'].forEach((key) => {
        const a = existing[key];
        const b = incoming[key];
        if (a === undefined || a === null || b === undefined || b === null) return;
        if (a !== b) {
            const at = path ? ` at '${path}'` : '';
            throw new TypeError(`Cannot merge${at}: ${key} '${a}' does not match '${b}'`);
        }
    });
}

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
 * @param {('existing'|'incoming')} [options.prefer='incoming'] - Which side wins when both hold a
 *   value for the same property. Note this decides conflicts only: a property `existing` does not
 *   have is filled from `incoming` either way, since that is a gap rather than a disagreement.
 * @param {string[]} [options.exclude=[]] - Top-level keys that keep their `existing` value
 *   whatever `incoming` says. Top-level only, deliberately: excluding `entityType` at any depth
 *   would stop a bare reference merging with the expanded entity for the same thing.
 * @param {boolean} [options.emptyAsNull=false] - Treat `[]` and `{}` as null on both sides, and
 *   write null in their place. Absent, null and empty all say "nothing is known", so an empty
 *   container never wins over a populated one and `[]` against `{}` is not a type conflict.
 * @param {string} [options.schemaVersion] - Schema version used to recognise relationship keys.
 *   `mergeEntity` supplies it from the entities themselves; without it relationship arrays fall
 *   back to structural comparison.
 * @param {string} [path=''] - Internal: tracks the current property path for error messages
 * @returns {object} - The merged object
 * @throws {TypeError} If a type conflict is detected between existing and incoming values, or if
 *   both sides declare an entityType or schemaVersion and they disagree
 */
export function deepMerge(existing, incoming, options = {}, path = '') {
    const {
        nullOverwrite = false, schemaVersion, prefer = 'incoming', exclude = [], emptyAsNull = false,
    } = options;
    const preferExisting = prefer === 'existing';

    // Two objects that both claim an identity and disagree describe different things. Checked
    // here rather than only in mergeEntity so it holds at every depth — including the reference
    // pairs mergeReferenceArray matches on identifier and merges directly.
    assertSameIdentity(existing, incoming, path);

    const excluded = (path === '' && exclude.length) ? new Set(exclude) : null;
    const result = { ...existing };

    for (const key of Object.keys(incoming)) {
        if (excluded && excluded.has(key)) continue;

        const existingVal = (emptyAsNull && isEmptyValue(existing[key])) ? null : existing[key];
        const incomingVal = (emptyAsNull && isEmptyValue(incoming[key])) ? null : incoming[key];
        const currentPath = path ? `${path}.${key}` : key;

        // Key only in incoming → add it, unless it holds nothing. Absent and empty are the same
        // statement under emptyAsNull, so adding the key would assert a difference there is not.
        if (!(key in existing)) {
            if (!(emptyAsNull && incomingVal === null)) result[key] = incomingVal;
            continue;
        }

        // Existing is null → incoming wins
        if (existingVal === null || existingVal === undefined) {
            result[key] = incomingVal;
            continue;
        }

        // Incoming is null → respect nullOverwrite option
        if (incomingVal === null || incomingVal === undefined) {
            if (nullOverwrite) result[key] = incomingVal;
            continue;
        }

        const existingType = typeCategory(existingVal);
        const incomingType = typeCategory(incomingVal);

        // Type conflict check
        if (existingType !== incomingType) {
            throw new TypeError(
                `Type conflict at '${currentPath}': cannot merge ${existingType} with ${incomingType}`,
            );
        }

        // Both are plain objects → recurse
        if (existingType === 'object') {
            result[key] = deepMerge(existingVal, incomingVal, options, currentPath);
            continue;
        }

        // Both are arrays. Relationship arrays are the one exception to the general rule: their
        // identity is the entity being referenced, matched on an identifier INTERSECTION, so the
        // same edge written as a bare reference and as an expanded entity collapses to one. The
        // general rule would compare those identifier arrays as values, find them unequal, and keep
        // both — overflowing a capped relationship. See mergeReferenceArray.
        if (existingType === 'array') {
            if (schemaVersion && omcTemplate.isRelationshipKey({ key, schemaVersion })) {
                result[key] = mergeReferenceArray(existingVal, incomingVal, options, currentPath);
            } else {
                result[key] = mergeArrays(existingVal, incomingVal, preferExisting);
            }
            continue;
        }

        // Both are primitives → incoming overwrites, unless existing is preferred
        if (!preferExisting) result[key] = incomingVal;
    }

    if (emptyAsNull) {
        Object.keys(result).forEach((key) => {
            if (isEmptyValue(result[key])) result[key] = null;
        });
    }

    return result;
}

/**
 * Merge two OMC entities, reading the schema version off the entities themselves.
 *
 * Two entities that describe different things are not merged: differing `entityType`, or a
 * `schemaVersion` both declare and disagree on, returns `false` rather than producing a record
 * that is half one thing and half another. A version mismatch is a migration to run, not a merge
 * to resolve. `schemaVersion` declared on one side only is not a conflict.
 *
 * @function mergeEntity
 * @param {OmcEntity} omc1 - The existing entity
 * @param {OmcEntity} omc2 - The incoming entity
 * @param {object} [options={}] - Merge options, as deepMerge
 * @returns {OmcEntity|false} The merged entity, or false when the two cannot be merged
 * @throws {TypeError} As deepMerge, including an identity mismatch on a nested reference
 */
export function mergeEntity(omc1, omc2, options = {}) {
    if (!omc1 && !omc2) return false; // Safety checks
    if ((!omc1 || !(Object.keys(omc1)).length) && omc2) return omc2; // omc1 is undefined or has no keys and omc2 is good, return omc2
    if (omc1 && (!omc2 || !(Object.keys(omc2))).length) return omc1; // omc2 is undefined or has no keys and omc1 is good, return omc1
    if ((omc1?.entityType !== omc2?.entityType)) return false; // Safety checks
    // A schemaVersion both sides declare must agree — merging across versions silently stamps one
    // entity with the other's version without migrating it.
    if (omc1?.schemaVersion && omc2?.schemaVersion && omc1.schemaVersion !== omc2.schemaVersion) return false;
    // Read the schema version off the entities so relationship arrays merge by referenced
    // identifier without every caller having to know to ask for it.
    const schemaVersion = options.schemaVersion || omc1?.schemaVersion || omc2?.schemaVersion;
    return deepMerge(omc1, omc2, { ...options, schemaVersion });
}

/**
 * Collect the dotted paths at which `merged` differs from `existing`.
 *
 * Reads the merge's OUTPUT rather than instrumenting the merge itself. Merge never removes, so
 * every difference is either a key `merged` gained or a value it changed — and reading the output
 * means this cannot disagree with what the merge actually did.
 *
 * @ignore
 * @param {object} existing
 * @param {object} merged
 * @param {string} path - Current property path
 * @param {{added: string[], updated: string[]}} delta - Accumulator, mutated
 */
function collectDelta(existing, merged, path, delta) {
    Object.keys(merged).forEach((key) => {
        const before = existing[key];
        const after = merged[key];
        // deepMerge copies untouched keys by reference via `{ ...existing }`, so this skips most
        // of the entity without walking it.
        if (before === after) return;

        const currentPath = path ? `${path}.${key}` : key;
        const beforeEmpty = isEmptyValue(before);
        const afterEmpty = isEmptyValue(after);

        if (afterEmpty) {
            // The merge holds nothing here. Normally that means `existing` held nothing either
            // and there is nothing to report; under `nullOverwrite` it means a value was cleared,
            // which is a change even though it is not a contribution.
            if (!beforeEmpty) delta.updated.push(currentPath);
            return;
        }
        if (isPlainObject(before) && isPlainObject(after)) {
            collectDelta(before, after, currentPath, delta);
            return;
        }
        if (Array.isArray(before) && Array.isArray(after)) {
            collectArrayDelta(before, after, currentPath, delta);
            return;
        }
        if (beforeEmpty) {
            delta.added.push(currentPath);
            return;
        }
        if (normalizeForComparison(before) !== normalizeForComparison(after)) delta.updated.push(currentPath);
    });
}

/**
 * Collect array differences, relying on the existing-prefix invariant: all three array mergers
 * keep the existing items in their existing positions and append unmatched incoming items, so an
 * index-wise comparison holds below `existing.length` and anything above it was appended.
 *
 * A keyed merge can collapse two existing entries sharing a key, shortening the array. The
 * invariant does not hold there, so the array is reported as one change.
 *
 * @ignore
 * @param {Array} before
 * @param {Array} after
 * @param {string} path
 * @param {{added: string[], updated: string[]}} delta - Accumulator, mutated
 */
function collectArrayDelta(before, after, path, delta) {
    if (after.length < before.length) {
        if (normalizeForComparison(before) !== normalizeForComparison(after)) delta.updated.push(path);
        return;
    }
    before.forEach((b, i) => {
        const a = after[i];
        if (b === a) return;
        const itemPath = `${path}[${i}]`;
        if (isPlainObject(b) && isPlainObject(a)) collectDelta(b, a, itemPath, delta);
        else if (Array.isArray(b) && Array.isArray(a)) collectArrayDelta(b, a, itemPath, delta);
        else if (normalizeForComparison(b) !== normalizeForComparison(a)) delta.updated.push(itemPath);
    });
    for (let i = before.length; i < after.length; i += 1) delta.added.push(`${path}[${i}]`);
}

/**
 * The result of asking what merging one entity into another would change.
 *
 * @typedef {Object} MergeChanges
 * @property {(OmcEntity|false)} merged - The merged entity; false when the two cannot be merged
 * @property {Array<string>} added - Dotted paths the merge contributes that `existing` lacked
 * @property {Array<string>} updated - Dotted paths where the merge takes a value `existing` disagrees with
 * @property {boolean} changed - Whether applying `merged` in place of `existing` would change it
 * @property {('merged'|'incompatible'|'no-entity')} status - Why an empty result is empty
 */

/**
 * Would merging `incoming` into `existing` change `existing` — and where?
 *
 * The merge-semantics answer to "does this record carry new information?", and deliberately
 * ASYMMETRIC where a structural diff is symmetric. A record that is a strict subset of `existing`
 * carries nothing: a merge would not remove the surplus, so nothing changes. Only two things can
 * change `existing` — a value it did not have (`added`) and a value it had but disagrees with
 * (`updated`). There is no third category, because merge never removes.
 *
 * Because the merge itself decides, the OMC conventions come along for free: identifier,
 * customData, annotation and tag are keyed on their key fields rather than compared whole;
 * relationship arrays are keyed on the REFERENCED identifier, so the same edge written as a bare
 * reference on one side and an expanded entity on the other is one edge, not two; and object key
 * order is irrelevant.
 *
 * `prefer` decides who wins a conflict, and therefore what counts as a change:
 *   - `'incoming'` (default) — incoming wins, so `added` and `updated` both change `existing`
 *   - `'existing'` — existing wins every conflict, so ONLY `added` can change it
 *
 * @function mergeChanges
 * @param {OmcEntity} existing - The entity that would be changed
 * @param {OmcEntity} incoming - The entity being merged in
 * @param {object} [options={}] - Merge options, passed through to mergeEntity
 * @param {('existing'|'incoming')} [options.prefer='incoming'] - Which side wins a conflict
 * @param {string[]} [options.exclude] - Top-level keys neither merged nor reported. Defaults to
 *   `omcTemplate.recordKeys()`; extend it as `[...omcTemplate.recordKeys(), ...yourKeys]`.
 * @param {boolean} [options.emptyAsNull=true] - Treat `[]` and `{}` as null. Absent, empty and
 *   null all say "nothing is known", so none of them is a contribution over another.
 * @returns {MergeChanges}
 * @throws {TypeError} As mergeEntity — a type conflict, or an identity mismatch nested inside
 */
export function mergeChanges(existing, incoming, options = {}) {
    const {
        prefer = 'incoming', exclude = omcTemplate.recordKeys(), emptyAsNull = true, ...rest
    } = options;
    const mergeOptions = {
        ...rest, prefer, exclude, emptyAsNull,
    };
    const nothing = {
        merged: false, added: [], updated: [], changed: false, status: 'no-entity',
    };

    const hasExisting = !!existing && Object.keys(existing).length > 0;
    const hasIncoming = !!incoming && Object.keys(incoming).length > 0;
    if (!hasExisting && !hasIncoming) return nothing;
    // mergeEntity's own empty-side guard is unreachable (a stray paren puts `.length` on a
    // boolean), so the empty cases are answered here rather than falling through to 'incompatible'.
    if (!hasIncoming) {
        return {
            merged: existing, added: [], updated: [], changed: false, status: 'merged',
        };
    }
    if (!hasExisting) {
        const seed = { added: [], updated: [] };
        collectDelta({}, incoming, '', seed);
        const excluded = new Set(exclude);
        return {
            merged: incoming,
            added: seed.added.filter((p) => !excluded.has(p)),
            updated: [],
            changed: true,
            status: 'merged',
        };
    }

    // One orientation throughout: the result is always `existing` enriched, so `exclude` always
    // protects the same side and the existing-prefix invariant collectArrayDelta relies on holds.
    // `prefer` decides conflicts inside that merge rather than by swapping the arguments.
    const probe = mergeEntity(existing, incoming, { ...mergeOptions, prefer: 'incoming' });
    if (probe === false) return { ...nothing, status: 'incompatible' };

    const delta = { added: [], updated: [] };
    collectDelta(existing, probe, '', delta);

    return {
        merged: prefer === 'existing' ? mergeEntity(existing, incoming, mergeOptions) : probe,
        added: delta.added,
        updated: delta.updated,
        changed: prefer === 'existing'
            ? delta.added.length > 0
            : delta.added.length + delta.updated.length > 0,
        status: 'merged',
    };
}
