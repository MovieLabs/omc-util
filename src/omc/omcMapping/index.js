/**
 * Turn rows of source data into OMC, driven by a mapping that is data rather than code.
 *
 * A **mapping** says which column feeds which OMC property, which column identifies the entity, and
 * which entities reference one another. It is plain JSON, so the same mapping can be authored in a
 * form, stored in a database, and executed by a service that has never heard of the source it
 * describes — and the browser preview and the server run are then the same function, not two
 * implementations that happen to agree.
 *
 * ## The interface is one row at a time
 *
 * A row is a plain object keyed by column heading. **Nothing here reads a file, a sheet, a workbook
 * or a table**: parsing belongs to whoever holds the bytes, which is what keeps this module free of
 * spreadsheet dependencies and usable in a browser.
 *
 * ```js
 * const { entities } = omcMapping.mapRow({ row, mapping, options });
 * ```
 *
 * Use {@link createRun} instead when rows must fold together — that is what a match key means, and
 * it cannot be decided one row at a time. The caller still feeds it rows.
 *
 * ```js
 * const run = omcMapping.createRun({ mapping, options });
 * rows.forEach((row) => run.add(row));
 * const { entities, notes, counts } = run.result();
 * ```
 *
 * ## Identity is deterministic, and that is the point
 *
 * Every entity's identifier is hashed from the value in its `key` column, never generated at
 * random. So running a mapping twice **updates** the entities rather than duplicating them — which
 * is what makes it safe to change a mapping and run it again, and is the whole reason this is
 * useful while OMC itself is still moving.
 *
 * ## What it asks the schema
 *
 * Everything. Which properties exist and where an array element goes ({@link omcTemplate.shape}),
 * whether a relationship is allowed and where it is stored ({@link omcEdges.edgeCreate}), how an
 * identifier is formed ({@link omcIdentifier.idHash}). A mapping names paths; it never restates a
 * schema fact. Add a property to OMC and it becomes mappable with no change here.
 *
 * @module omcMapping
 */

// `identityColumn` and `hasSuppliedIdentifier` are exported because a consumer has to be able to
// ask **what identifies this entity**, and the answer is not simply `mapping.key`: an entity that
// maps a column onto `identifier[0].identifierValue` names itself, and needs no key at all. An
// editor that reads `.key` directly concludes such an entity cannot be referenced and refuses a
// relationship the engine would have built — which is exactly the kind of restated schema knowledge
// this package exists to prevent.
export {
    mapRow, cast, splitList, identityColumn, hasSuppliedIdentifier,
} from './mapRow.js';
export { createRun } from './createRun.js';
export { check, checkColumns } from './check.js';
export {
    createEntity, entityRef, seedFor, resolveOptions, DEFAULT_OPTIONS,
} from './entity.js';
// `typeAtPath` is exported for the same reason as `identityColumn`: a consumer holding text — a CSV
// reader, a form — must be able to ask what type OMC declares at a path rather than inferring one
// from the characters. Inferring is how slate `16E-1` becomes 1.6 and `12-1` becomes a date.
export {
    writeShaped, getShaped, hasValue, parseSegment, typeAtPath, shapedPath,
} from './shapedValue.js';
