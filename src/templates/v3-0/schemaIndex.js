/**
 * Schema-derived fact indexes for v3.0, built once and shared.
 *
 * Both the edge-table build and the entity-template assembly need the same
 * cardinality facts; building the index here keeps the (single) schema walk out of
 * each of them and guarantees they cannot disagree.
 *
 * @module schemaIndex
 */

import schemav30 from '../../omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import { buildMaxItemsIndex } from '../schemaFacts.js';

/** @type {Map<string, number>} keyed `EntityType:dot.path` */
export const maxItemsIndex = buildMaxItemsIndex(schemav30);

export default { maxItemsIndex };
