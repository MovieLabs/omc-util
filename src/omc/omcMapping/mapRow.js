/**
 * Turn one row of source data into the OMC entities a mapping describes.
 *
 * This is the whole of the per-row work, and it is stateless: the same row and mapping always give
 * the same entities, identifiers included. Anything needing to see more than one row at a time —
 * folding rows that share a key — belongs to {@link module:omcMapping/createRun}.
 *
 * @module omcMapping/mapRow
 */

import { omcTemplate } from '../../templates/index.js';
import { edgeCreate } from '../omcEdges.js';

import { createEntity, entityRef, resolveOptions } from './entity.js';
import { hasValue, typeAtPath, writeShaped } from './shapedValue.js';

/** The column a property spec reads, or null when it is a fixed value. */
const specColumn = (spec) => {
    if (typeof spec === 'string') return spec;
    if (spec && typeof spec === 'object' && spec.from !== undefined) return spec.from;
    return null;
};

import './types.js'; // Type definitions, resolved globally by JSDoc

/**
 * Split a delimited cell into trimmed, de-duplicated, sorted members.
 *
 * Sorting matters: a source that writes the same set in two orders — `13; 15` on one row and
 * `15; 13` on another — would otherwise produce two different sets of edges for one relationship.
 * Numeric-looking members sort numerically, so `2` precedes `10`.
 *
 * @param {*} value - The cell value
 * @param {string} delimiter - What to split on
 * @returns {Array<string>} The members
 */
export function splitList(value, delimiter) {
    if (!hasValue(value)) return [];
    return [...new Set(String(value).split(delimiter).map((s) => s.trim()).filter(Boolean))]
        .sort((a, b) => (Number(a) - Number(b)) || a.localeCompare(b));
}

/**
 * Cast a cell to the type OMC declares for the property.
 *
 * A spreadsheet has no types worth trusting — every cell may arrive as a string — so a mapping says
 * what the value is and this makes it so.
 *
 * @param {*} value - The cell value
 * @param {string} as - Target type
 * @returns {*} The cast value, or null when it cannot be cast
 */
export function cast(value, as) {
    if (!hasValue(value)) return null;
    if (as === 'number') {
        const n = Number(value);
        return Number.isNaN(n) ? null : n;
    }
    if (as === 'boolean') return value === true || value === 'true' || value === 'Y';
    if (as === 'string') return String(value);
    // OMC dateTime properties reject a date-only value. A source recording only the date is
    // promoted to midnight UTC — the day is asserted; the time is a convention, not a claim that
    // the event happened at 00:00.
    if (as === 'datetime') {
        return /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : String(value);
    }
    return value;
}

/**
 * Promote a text value to the type OMC declares for the property it is going to.
 *
 * A text source has no types, so its numbers arrive as `"1920"` and its booleans as `"true"`. The
 * schema already knows which is which, so it is asked rather than the characters being read — which
 * is what turns a slate `16E-1` into `1.6` and a slate `12-1` into a date.
 *
 * Deliberately narrow, so a typed source cannot be disturbed:
 *
 * - only a **string** is promoted; a value that already has a type is passed through untouched,
 * - only **to** `number` or `boolean`; nothing is ever stringified, because a source that supplied
 *   a real number said something the schema's `string` should not overwrite,
 * - a value that will not convert is left exactly as it came, so this can add no new failure.
 *
 * A mapping's own `as` outranks this: it is a decision, and this is a default.
 *
 * @param {*} value - The resolved value
 * @param {(string|undefined)} type - The declared type at the target path
 * @returns {*} The promoted value, or the original
 */
function promote(value, type) {
    if (typeof value !== 'string') return value;
    if (type !== 'number' && type !== 'boolean') return value;
    const cast_ = cast(value, type);
    return cast_ === null ? value : cast_;
}

/**
 * Resolve one property mapping against a row.
 *
 * @param {OmcMapping.PropertyMapping} spec - The mapping, or a bare column name
 * @param {MappingRow} row - The row
 * @returns {{value: *, withheld: (string|null)}} The value, or why it was withheld
 */
function resolveProperty(spec, row) {
    const source = typeof spec === 'string' ? { from: spec } : spec;
    const {
        from, as, split, when,
    } = source;

    // A fixed value is a decision the mapping makes, not something the source said.
    if (source.const !== undefined) return { value: source.const, withheld: null };

    const raw = row[from];
    if (!hasValue(raw)) return { value: null, withheld: null };

    let value = raw;
    if (split) {
        const members = splitList(value, split);
        if (when === 'single' && members.length !== 1) {
            return {
                value: null,
                withheld: `"${from}" holds ${members.length} values (${members.join(', ')}); `
                    + 'no single value applies',
            };
        }
        value = members.length === 1 ? members[0] : members.join(', ');
    }

    return { value: as ? cast(value, as) : value, withheld: null };
}

/**
 * Build a note-shaped property — an array of `{author, title, text}`.
 *
 * OMC uses that shape for more than `annotation`: `NarrativeScene.slugline` has it too. One
 * construct covers them all, so a mapping names the property rather than this file hard-coding
 * which properties are note-shaped.
 *
 * @param {Array<OmcMapping.NoteMapping>} entries - Note mappings
 * @param {MappingRow} row - The row
 * @returns {Array<Object>} The notes, empty ones dropped
 */
function buildNotes(entries, row) {
    return (entries ?? [])
        .map(({ title, author, from }) => ({ author, title, text: row[from] }))
        .filter((n) => hasValue(n.text))
        .map((n) => Object.fromEntries(Object.entries(n).filter(([, v]) => v !== undefined)));
}

/**
 * Build the customData array — the source's own columns under their own names.
 *
 * @param {OmcMapping.CustomDataMapping} mapping - The catch-all mapping
 * @param {MappingRow} row - The row
 * @param {Set<string>} consumed - Columns already carried by a real OMC property
 * @returns {Array<Object>} A one-element array, or an empty one
 */
function buildCustomData(mapping, row, consumed) {
    if (!mapping?.rest) return [];
    const {
        domain, namespace, schema, exclude = [],
    } = mapping;
    const skip = new Set([...consumed, ...exclude]);

    const value = {};
    for (const [column, cell] of Object.entries(row)) {
        if (skip.has(column) || !hasValue(cell)) continue;
        value[column] = cell;
    }
    if (!Object.keys(value).length) return [];
    return [{
        ...(domain ? { domain } : {}),
        ...(namespace ? { namespace } : {}),
        ...(schema ? { schema } : {}),
        value,
    }];
}

/**
 * Columns a mapping consumes as real OMC properties, so `customData.rest` does not repeat them.
 *
 * The `key` column is deliberately **not** consumed: it identifies the row in the source, and that
 * is worth carrying even though it also seeds the identifier.
 *
 * @param {OmcMapping.EntityMapping} mapping - The mapping
 * @returns {Set<string>} Consumed column names
 */
function consumedColumns(mapping) {
    const columns = new Set();
    for (const spec of Object.values(mapping.properties ?? {})) {
        const source = typeof spec === 'string' ? { from: spec } : spec;
        if (source.from) columns.add(source.from);
    }
    for (const entries of Object.values(mapping.notes ?? {})) {
        (entries ?? []).forEach(({ from }) => columns.add(from));
    }
    return columns;
}

/**
 * The property path a mapping writes an identifier value to, if any.
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {(string|null)} The path, e.g. `identifier[0].identifierValue`
 */
function identifierValuePath(mapping) {
    return Object.keys(mapping.properties ?? {})
        .find((path) => /^identifier(\[\d+\])?\.identifierValue$/.test(path)) ?? null;
}

/**
 * The column that identifies this entity — either the nominated key, or the column feeding a
 * mapped `identifierValue`.
 *
 * Mapping the source's own id **is** nominating a key: it says "this column names the thing", which
 * is the only question `key` asks. Requiring both would mean stating it twice, and hashing over a
 * name the source already gave would make the entity unreachable by that name.
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {(string|null)} The column, or null when the mapping has neither
 */
export function identityColumn(mapping) {
    const path = identifierValuePath(mapping);
    if (path) {
        const column = specColumn(mapping.properties[path]);
        if (column) return column;
    }
    return mapping.key ?? null;
}

/**
 * Does this entity take its identifier from the source rather than a hash?
 *
 * @param {OmcMapping.EntityMapping} mapping - One entity's mapping
 * @returns {boolean}
 */
export function hasSuppliedIdentifier(mapping) {
    const path = identifierValuePath(mapping);
    return Boolean(path && specColumn(mapping.properties[path]));
}

/**
 * What an edge points at: the entry it names with `to`, or, with `toType`, an entityType that no
 * entry in this template builds.
 *
 * @param {Array<OmcMapping.EntityMapping>} mapping - The whole template
 * @param {OmcMapping.EdgeMapping} edge - One of its edges
 * @returns {({entry: (OmcMapping.EntityMapping|null), entityType: string}|null)} The target entry
 *   (null for a `toType` reference) and its entityType, or null when `to` names no entry or the
 *   edge names neither
 */
export function edgeTarget(mapping, edge) {
    if (edge?.to !== undefined && edge.to !== null) {
        const entry = (mapping ?? []).find((m) => m.id === edge.to);
        return entry ? { entry, entityType: entry.entityType } : null;
    }
    return edge?.toType ? { entry: null, entityType: edge.toType } : null;
}

/**
 * Build one entity from one row.
 *
 * @param {OmcMapping.EntityMapping} mapping - What to build
 * @param {MappingRow} row - The row
 * @param {OmcMapping.MappingOptions} options - Resolved options
 * @param {Array<OmcMapping.MappingNote>} notes - Appended to in place
 * @returns {(Object|null)} The entity, or null when the row has no key value for it
 */
function buildEntity(mapping, row, options, notes) {
    const { entityType, key } = mapping;
    // An entity whose identifier the source supplies needs no key column: the identity comes from
    // the row itself. `identityColumn` resolves whichever of the two applies.
    const identity = identityColumn(mapping);
    const keyValue = row[identity];
    if (!hasValue(keyValue)) {
        notes.push({
            kind: 'noKeyValue',
            where: entityType,
            detail: `column "${identity ?? key}" is empty on this row, so no ${entityType} was built`,
        });
        return null;
    }

    const shape = omcTemplate.shape({ entityType, schemaVersion: options.schemaVersion });
    const properties = {};

    for (const [path, spec] of Object.entries(mapping.properties ?? {})) {
        const { value, withheld } = resolveProperty(spec, row);
        if (withheld) {
            notes.push({
                kind: 'propertyWithheld',
                where: `${entityType} ${keyValue}`,
                detail: `${path} not set: ${withheld}`,
            });
        }
        if (value !== null && value !== undefined) {
            const parts = path.split('.');
            // `as` is the mapping's own decision and is applied by `resolveProperty`; only where it
            // said nothing does the schema's declared type stand in.
            const declared = typeof spec === 'object' && spec?.as;
            writeShaped(properties, parts, declared ? value : promote(value, typeAtPath(parts, shape)), shape);
        }
    }

    for (const [path, entries] of Object.entries(mapping.notes ?? {})) {
        const noteList = buildNotes(entries, row);
        if (noteList.length) writeShaped(properties, path.split('.'), noteList, shape);
    }

    const customData = buildCustomData(mapping.customData, row, consumedColumns(mapping));
    if (customData.length) properties.customData = customData;

    return createEntity({
        entityType, key: String(keyValue), properties, options,
    });
}

/**
 * Create the relationships a mapping declares, once this row's entities exist.
 *
 * `via` names the column holding the target's key. Where that key belongs to the target entry's
 * entity built from this same row, the two are linked directly; where it does not, a reference stub
 * is minted from the same seed — so an edge can point at something another row, another template,
 * or (through `toType`) no entry at all will build.
 *
 * Paths, storage shape and inverses all come from the schema through `edgeCreate`, which returns
 * null for a relationship OMC does not allow rather than writing it. The inverse is written unless
 * the edge says `inverse: false`: onto the target directly when this row built it, and otherwise
 * handed back in `inverses` for the run to write onto the entity another row builds.
 *
 * @param {Array<OmcMapping.EntityMapping>} mapping - The whole template
 * @param {Object.<string, Object>} built - This row's entities, by entry id
 * @param {MappingRow} row - The row
 * @param {OmcMapping.MappingOptions} options - Resolved options
 * @param {Array<OmcMapping.MappingNote>} notes - Appended to in place
 * @param {Array<Object>} inverses - Appended to in place: `{ target, source, path }`, an inverse
 *   whose target this row did not build
 */
function applyEdges(mapping, built, row, options, notes, inverses) {
    for (const entry of mapping) {
        if (!built[entry.id]) continue;

        for (const edge of entry.edges ?? []) {
            const target = edgeTarget(mapping, edge);
            if (!target) {
                notes.push({
                    kind: 'unknownEdgeTarget',
                    where: entry.entityType,
                    detail: `an edge names "${edge.to ?? edge.toType}", which is no entry in this template; it was not written`,
                });
                continue;
            }
            const { entry: targetEntry, entityType: targetType } = target;
            // The identity value the target entry was built under on this row, so an edge can tell
            // "the entity this row built" from "an entity elsewhere that happens to be of that type".
            const builtUnder = targetEntry && hasValue(row[identityColumn(targetEntry)])
                ? String(row[identityColumn(targetEntry)])
                : null;
            const targetKeys = edge.split
                ? splitList(row[edge.via], edge.split)
                : [row[edge.via]].filter(hasValue).map(String);

            for (const targetKey of targetKeys) {
                const isSameRow = builtUnder === targetKey && Boolean(built[targetEntry.id]);
                let toEntity;
                if (isSameRow) {
                    toEntity = built[targetEntry.id];
                } else if (targetEntry && hasSuppliedIdentifier(targetEntry)) {
                    // The target names itself, so the reference is that name — hashing it would
                    // point at an entity nothing will ever build.
                    toEntity = {
                        schemaVersion: options.schemaVersion,
                        entityType: targetType,
                        identifier: [{
                            identifierScope: options.identifierScope,
                            identifierValue: targetKey,
                        }],
                    };
                } else {
                    toEntity = entityRef({ entityType: targetType, key: targetKey, options });
                }

                const result = edgeCreate({
                    fromEntity: built[entry.id],
                    toEntity,
                    // Which relationship, where the target type reaches the entity through more
                    // than one — `Asset` holds both `edges.has.Realization` and
                    // `edges.usedBy.Realization`. Optional: a mapping that does not say falls back
                    // to edgeCreate's own choice.
                    intrinsicEdge: edge.edgeKey ?? null,
                    inverse: edge.inverse !== false,
                });
                if (!result) {
                    notes.push({
                        kind: 'edgeNotAllowed',
                        where: `${entry.entityType} -> ${targetType}`,
                        detail: 'the schema does not allow this relationship; it was not written',
                    });
                    continue;
                }
                built[entry.id] = result.fromEntity;
                if (!result.toEdgePath) continue;
                if (isSameRow) {
                    built[targetEntry.id] = result.toEntity;
                } else {
                    // The target is a stub here; the run writes the inverse onto the real one.
                    const { entityType, schemaVersion, identifier } = result.fromEntity;
                    inverses.push({
                        target: toEntity.identifier,
                        source: { entityType, schemaVersion, identifier },
                        path: result.toEdgePath,
                    });
                }
            }
        }
    }
}

/**
 * Map one row to OMC entities.
 *
 * @param {Object} params
 * @param {MappingRow} params.row - One row, keyed by column heading
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {{entities: Object.<string, Object>, notes: Array<OmcMapping.MappingNote>, inverses: Array<Object>}}
 *   The entities by entry id, already linked to one another, anything worth reporting, and the
 *   inverses whose target another row builds. Two entries that build the same entity each hold a
 *   copy; {@link module:omcMapping/createRun} folds them and writes those inverses
 * @throws {Error} When a mapping names a property or entityType the schema does not have
 */
export function mapRow({ row, mapping, options = {} }) {
    const resolved = resolveOptions(options);
    const notes = [];
    const entities = {};
    const inverses = [];

    for (const entry of mapping) {
        const entity = buildEntity(entry, row, resolved, notes);
        if (entity) entities[entry.id] = entity;
    }

    applyEdges(mapping, entities, row, resolved, notes, inverses);

    return { entities, notes, inverses };
}

export default mapRow;
