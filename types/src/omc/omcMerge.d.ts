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
export function deepMerge(existing: object, incoming: object, options?: {
    nullOverwrite?: boolean;
    prefer?: ("existing" | "incoming");
    exclude?: string[];
    emptyAsNull?: boolean;
    schemaVersion?: string;
}, path?: string): object;
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
export function mergeEntity(omc1: OmcEntity, omc2: OmcEntity, options?: object): OmcEntity | false;
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
export function mergeChanges(existing: OmcEntity, incoming: OmcEntity, options?: {
    prefer?: ("existing" | "incoming");
    exclude?: string[];
    emptyAsNull?: boolean;
}): MergeChanges;
export function pathRoot(path: string): string;
/**
 * The result of asking what merging one entity into another would change.
 */
export type MergeChanges = {
    /**
     * - The merged entity; false when the two cannot be merged
     */
    merged: (OmcEntity | false);
    /**
     * - Dotted paths the merge contributes that `existing` lacked
     */
    added: Array<string>;
    /**
     * - Dotted paths where the merge takes a value `existing` disagrees with
     */
    updated: Array<string>;
    /**
     * - Whether applying `merged` in place of `existing` would change it
     */
    changed: boolean;
    /**
     * - Why an empty result is empty
     */
    status: ("merged" | "incompatible" | "no-entity");
};
//# sourceMappingURL=omcMerge.d.ts.map