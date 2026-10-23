/**
 * Type definitions for {@link module:omcMapping}, resolved globally by JSDoc.
 *
 * A mapping is **data, not code**: it round-trips through `JSON.stringify` losslessly, which is
 * what lets one be authored in a form, stored in a database, and executed by a service that has
 * never heard of the source it describes.
 *
 * @module omcMapping/types
 */

/**
 * One row of source data — a plain object keyed by column heading, and by input name for the OMC
 * entities it carries (one, or an array).
 *
 * This is the only shape omcMapping accepts. It knows nothing of files, sheets, workbooks, tables or
 * queries: whoever holds the data turns it into rows and feeds them in.
 *
 * @typedef {Object.<string, (string|number|boolean|null|Object|Array<Object>)>} MappingRow
 */

/**
 * Where a value is read from a row: a column heading, or a template — fixed text with columns in
 * braces, `{ template: 'scene-{Scene}-take-{Take}' }`, where `{{` and `}}` write a literal brace. A
 * template whose columns are not all filled on a row gives no value there. Or an input path,
 * `{ input: 'video', path: 'assetFC.functionalType' }`: the value at that path in each entity the row
 * carries under the input's name, an array when there are several.
 *
 * @typedef {(string|{template: string}|{input: string, path: string})} ValueSource
 * @memberof OmcMapping
 */

/**
 * Where a property's value comes from.
 *
 * A bare string is shorthand for `{ from: <column> }`.
 *
 * @typedef {(string|OmcMapping.PropertySource)} PropertyMapping
 * @memberof OmcMapping
 */

/**
 * @typedef {Object} PropertySource
 * @memberof OmcMapping
 * @property {string} [from] - Column to read
 * @property {string} [template] - Text to write, with columns in braces (see
 *   {@link OmcMapping.ValueSource}). Takes precedence over `from`
 * @property {string} [input] - Input to read, with `path`. A property holding one value refuses
 *   several: the row builds nothing
 * @property {string} [path] - Dotted path in each of the input's entities
 * @property {*} [const] - A fixed value, written on every row. Takes precedence over `template` and
 *   `from`, because it is a decision the mapping makes rather than something the source said
 * @property {('number'|'string'|'boolean'|'datetime')} [as] - Cast the value
 * @property {string} [split] - Delimiter; the cell holds a list. Members are trimmed,
 *   de-duplicated and sorted, so a source writing the same set in two orders yields one result
 * @property {'single'} [when] - With `split`, withhold unless exactly one member remains, rather
 *   than guessing which of several applies
 */

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
 * are and never built. More input entities than the relationship holds refuse the row. {@link module:omcMapping/mapRow.edgeTarget} resolves either.
 *
 * @typedef {Object} EdgeMapping
 * @memberof OmcMapping
 * @property {string} [to] - The `id` of the target entry in this template
 * @property {string} [toType] - The target entityType, when no entry in this template builds it
 * @property {string} [input] - The input whose entities are the targets; `toType` then only
 *   declares their type for {@link module:omcMapping/check}
 * @property {OmcMapping.ValueSource} [via] - Where the row holds the target's key value; not used
 *   with `input`
 * @property {string} [edgeKey] - Edge-table key of the relationship this fills
 * @property {string} [split] - The column holds several keys
 * @property {boolean} [inverse=true] - Also write the reciprocal edge onto the target, when the run
 *   builds it. `false` writes the forward edge alone
 */

/**
 * The source's own columns, carried verbatim where OMC has no home for them.
 *
 * @typedef {Object} CustomDataMapping
 * @memberof OmcMapping
 * @property {string} [domain] - The `customData.domain`, naming the source
 * @property {boolean} [rest] - Carry every column no property consumed
 * @property {Array<string>} [exclude] - Columns to withhold from `rest`
 * @property {string} [namespace]
 * @property {string} [schema]
 */

/**
 * How one row becomes one entity.
 *
 * A template is an array of these — several entities from one row, **each of a distinct type**,
 * linked to one another. `entityType` is therefore the entity's identity within a template; there
 * is no separate node id.
 *
 * @typedef {Object} EntityMapping
 * @memberof OmcMapping
 * @property {string} id - Identifies this entry within the template, and is what an edge's `to`
 *   names. Unique within the template. It identifies the entry, not the entity: the entity's
 *   identifier comes from its entityType and key value, so two entries of one type keyed on the
 *   same column build one entity, and on different columns build two
 * @property {string} entityType - The OMC entityType to build
 * @property {OmcMapping.ValueSource} key - The column or template whose value seeds this entity's
 *   identifier. **Required**: it is
 *   what makes a re-run update the entity in place instead of duplicating it, and what lets
 *   another entity reference it through {@link OmcMapping.EdgeMapping}`.via`
 * @property {Object.<string, OmcMapping.PropertyMapping>} [properties] - OMC property path to
 *   source. Paths are dotted, and address array elements with `[n]`: `annotation[1].author`
 * @property {Object.<string, Array<OmcMapping.NoteMapping>>} [notes] - Columns carried as
 *   note-shaped properties, keyed by the property path they are written to
 * @property {OmcMapping.CustomDataMapping} [customData] - The catch-all
 * @property {Array<OmcMapping.EdgeMapping>} [edges] - Relationships to other entities
 */

/**
 * @typedef {Object} NoteMapping
 * @memberof OmcMapping
 * @property {string} title
 * @property {string} from - Column holding the text
 * @property {string} [author]
 */

/**
 * Scope, schema version and namespace for the entities a run produces.
 *
 * @typedef {Object} MappingOptions
 * @memberof OmcMapping
 * @property {string} [identifierScope] - Scope every minted identifier carries
 * @property {string} [schemaVersion] - OMC schema version the property paths target
 * @property {(string|null)} [seedNamespace] - Namespace folded into every identifier seed, keeping
 *   projects from colliding. **Changing it rewrites every identifier the template produces**
 */

/**
 * Something worth reporting that did not stop the run.
 *
 * @typedef {Object} MappingNote
 * @memberof OmcMapping
 * @property {string} kind - Machine-readable category
 * @property {string} where - What it concerns
 * @property {string} detail - What happened
 */

export default {};
