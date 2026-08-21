declare const _default: {};
export default _default;
/**
 * One row of source data — a plain object keyed by column heading.
 *
 * This is the only shape omcMapping accepts. It knows nothing of files, sheets, workbooks or
 * tables: whoever holds the bytes parses them and feeds rows in.
 */
export type MappingRow = {
    [x: string]: string | number | boolean;
};
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
 * `via` names the column holding the **target's key** — "use this match key to create an id in
 * this edge". Because both entities seed their identifiers from a row value the same way, the
 * reference resolves whether or not the target was built in this row.
 *
 * `edgeKey` names **which** relationship, using the edge table's own key for it —
 * `AssetStructure` for an intrinsic edge, `edges.has.Slate` for a consolidated one. The target
 * type does not answer that where an entity reaches the same type through more than one
 * relationship, as `Asset` does `Realization` (`edges.has.Realization` and
 * `edges.usedBy.Realization`). Optional, and omitting it means what it always did: the first
 * relationship admitting the target.
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