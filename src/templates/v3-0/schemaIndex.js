/**
 * Schema-derived fact indexes for v3.0, built once and shared.
 *
 * `buildEdgeTable` joins the index onto each row as `maxItems`. `schemaDerive` reads the same
 * `maxItems` nodes on its own walk when it stamps a shape with `$maxItems`, so the two agree by
 * reading one schema rather than by sharing this index.
 *
 * @module schemaIndex
 */

import schemav30 from '../../omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import { buildMaxItemsIndex } from '../schemaFacts.js';

/** @type {Map<string, number>} keyed `EntityType:dot.path` */
export const maxItemsIndex = buildMaxItemsIndex(schemav30);

export default { maxItemsIndex };
