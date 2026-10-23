declare const _default: {};
export default _default;
/**
 * One row of source data — a plain object keyed by column heading, and by input name for the OMC
 * entities it carries (one, or an array).
 *
 * This is the only shape omcMapping accepts. It knows nothing of files, sheets, workbooks, tables or
 * queries: whoever holds the data turns it into rows and feeds them in.
 */
export type MappingRow = {
    [x: string]: any;
};
/**
 * Where a value is read from a row: a column heading, or a template — fixed text with columns in
 * braces, `{ template: 'scene-{Scene}-take-{Take}' }`, where `{{` and `}}` write a literal brace. A
 * template whose columns are not all filled on a row gives no value there. Or an input path,
 * `{ input: 'video', path: 'assetFC.functionalType' }`: the value at that path in each entity the row
 * carries under the input's name, an array when there are several.
 */
export type ValueSource = (string | {
    template: string;
} | {
    input: string;
    path: string;
});
/**
 * Where a property's value comes from.
 *
 * A bare string is shorthand for `{ from: <column> }`.
 */
export type PropertyMapping = (string | OmcMapping.PropertySource);
export type PropertySource = any;
/**
 * A relationship to another entity built from the same row.
 *
 * `via` names where the row holds the **target's key** — "use this match key to create an id in
 * this edge" — and so is the same column or template that identifies the target. Because both entities seed their identifiers from a row value the same way, the
 * reference resolves whether or not the target was built in this row.
 *
 * `edgeKey` names **which** relationship, using the edge table's own key for it —
 * `AssetStructure` for an intrinsic edge, `edges.has.Slate` for a consolidated one. The target
 * type does not answer that where an entity reaches the same type through more than one
 * relationship, as `Asset` does `Realization` (`edges.has.Realization` and
 * `edges.usedBy.Realization`). Optional, and omitting it means what it always did: the first
 * relationship admitting the target.
 *
 * The target is named one of three ways: `to`, the `id` of an entry in this template; `toType`, an
 * entityType that no entry here builds — a reference to an entity another template or source
 * provides; or `input`, the existing entities the row carries under that name, referenced as they
 * are and never built. More input entities than the relationship holds refuse the row.
 * {@link module :omcMapping/mapRow.edgeTarget} resolves any of them.
 */
export type EdgeMapping = any;
/**
 * The source's own columns, carried verbatim where OMC has no home for them.
 */
export type CustomDataMapping = any;
/**
 * How one row becomes one entity.
 *
 * A template is an array of these — several entities from one row, **each of a distinct type**,
 * linked to one another. `entityType` is therefore the entity's identity within a template; there
 * is no separate node id.
 */
export type EntityMapping = any;
export type NoteMapping = any;
/**
 * Scope, schema version and namespace for the entities a run produces.
 */
export type MappingOptions = any;
/**
 * Something worth reporting that did not stop the run.
 */
export type MappingNote = any;
//# sourceMappingURL=types.d.ts.map