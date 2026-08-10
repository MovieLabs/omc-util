/**
 * Accumulate many rows into one set of entities.
 *
 * This exists for one reason: **match keys**. Rows sharing a key value describe the same thing and
 * must collapse into a single entity, and no amount of looking at one row can decide that. A
 * spreadsheet of takes repeats its scene on every row; the scene is one entity, not forty.
 *
 * The caller still feeds rows one at a time and still never hands over a table — this holds the
 * accumulator, not the data source.
 *
 * @module omcMapping/createRun
 */

import { mergeEntity } from '../omcMerge.js';

import { resolveOptions } from './entity.js';
import { mapRow } from './mapRow.js';

import './types.js'; // Type definitions, resolved globally by JSDoc

/**
 * Start a run.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Scope, schema version and namespace
 * @returns {{add: Function, result: Function}} The accumulator
 *
 * @example
 * const run = createRun({ mapping, options });
 * rows.forEach((row) => run.add(row));
 * const { entities, notes, counts } = run.result();
 */
export function createRun({ mapping, options = {} }) {
    const resolved = resolveOptions(options);
    // Keyed by identifier rather than by entityType + key value: two entities of different types
    // may share a key, and the identifier already folds the type in.
    const byIdentifier = new Map();
    const notes = [];
    let rowCount = 0;

    /**
     * Fold one row's entities into the accumulator.
     *
     * @param {MappingRow} row - One row, keyed by column heading
     */
    const add = (row) => {
        rowCount += 1;
        const outcome = mapRow({ row, mapping, options: resolved });
        notes.push(...outcome.notes);

        for (const entity of Object.values(outcome.entities)) {
            const id = entity.identifier?.[0]?.identifierValue;
            if (!id) continue;
            const seen = byIdentifier.get(id);
            if (!seen) {
                byIdentifier.set(id, entity);
                continue;
            }
            // `prefer: 'existing'` is load-bearing. The default is `'incoming'`, which would let
            // every later row overwrite what an earlier one established — so a scene repeated on
            // forty take rows would end up describing the last take rather than the scene. First
            // value seen wins; later rows fill gaps. `prefer` decides this inside the merge, so
            // the arguments stay in their natural order rather than being swapped.
            const merged = mergeEntity(seen, entity, { prefer: 'existing', emptyAsNull: true });
            if (merged === false) {
                notes.push({
                    kind: 'mergeRejected',
                    where: `${entity.entityType} ${id}`,
                    detail: 'two rows produced the same identifier but disagree on entityType or '
                        + 'schemaVersion; the later row was dropped',
                });
                continue;
            }
            byIdentifier.set(id, merged);
        }
    };

    /**
     * Everything the run produced.
     *
     * @returns {{entities: Array<Object>, notes: Array<OmcMapping.MappingNote>, counts: Object}}
     */
    const result = () => {
        const entities = [...byIdentifier.values()];
        const byType = {};
        for (const e of entities) byType[e.entityType] = (byType[e.entityType] ?? 0) + 1;
        return {
            entities,
            notes,
            counts: {
                rows: rowCount,
                entities: entities.length,
                byType,
                identifierScope: resolved.identifierScope,
                schemaVersion: resolved.schemaVersion,
                seedNamespace: resolved.seedNamespace,
            },
        };
    };

    return { add, result };
}

export default createRun;
