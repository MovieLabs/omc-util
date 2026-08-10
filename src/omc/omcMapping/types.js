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
 * One row of source data — a plain object keyed by column heading.
 *
 * This is the only shape omcMapping accepts. It knows nothing of files, sheets, workbooks or
 * tables: whoever holds the bytes parses them and feeds rows in.
 *
 * @typedef {Object.<string, (string|number|boolean|null)>} MappingRow
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
 * @property {*} [const] - A fixed value, written on every row. Takes precedence over `from`,
 *   because it is a decision the mapping makes rather than something the source said
 * @property {('number'|'string'|'boolean'|'datetime')} [as] - Cast the value
 * @property {string} [split] - Delimiter; the cell holds a list. Members are trimmed,
 *   de-duplicated and sorted, so a source writing the same set in two orders yields one result
 * @property {'single'} [when] - With `split`, withhold unless exactly one member remains, rather
 *   than guessing which of several applies
 */

/**
 * A relationship to another entity built from the same row.
 *
 * `via` names the column holding the **target's key** — "use this match key to create an id in
 * this edge". Because both entities seed their identifiers from a row value the same way, the
 * reference resolves whether or not the target was built in this row.
 *
 * @typedef {Object} EdgeMapping
 * @memberof OmcMapping
 * @property {string} to - The target entityType
 * @property {string} via - Column holding the target's key value
 * @property {string} [split] - The column holds several keys
 * @property {boolean} [inverse] - Also write the reciprocal edge. Declare on **one** side of a
 *   pair only, or the relationship is written twice
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
 * @property {string} entityType - The OMC entityType to build
 * @property {string} key - Column whose value seeds this entity's identifier. **Required**: it is
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
