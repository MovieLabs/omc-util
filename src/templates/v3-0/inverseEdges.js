/**
 * Inverse-edge map: predicate name -> inverse predicate name.
 *
 * Generated from the consolidated edge definitions (edges.js) so the relational inverses no
 * longer need hand-maintaining — each predicate declares its own `inverse`. A small
 * `supplemental` map covers predicates not yet modelled in edges.js but still referenced by
 * consumers (e.g. the fMam edge service via `omcTemplate.inverseEdge()`).
 */

import { edgeDefinitions } from './edges.js';

// Predicates referenced by consumers but not yet present in edges.js
const supplemental = {
    contributor: 'contributesTo',
    contributesTo: 'contributor',
    represents: 'representedBy',
    representedBy: 'represents',
    idea: 'subject',
    subject: 'idea',
};

/**
 * Build the inverse map from a set of edge definitions: each predicate's top-level
 * `inverse` (skipping null and per-group-only inverses), over the supplemental map.
 *
 * @param {Object} definitions - Edge definitions in the edges.js shape
 * @returns {Object<string, string>} predicate name -> inverse predicate name
 */
export const inverseEdgesFrom = (definitions) => ({
    ...supplemental,
    ...Object.entries(definitions).reduce((map, [predicate, def]) => {
        if (def.inverse) map[predicate] = def.inverse;
        return map;
    }, {}),
});

export const inverseEdges = inverseEdgesFrom(edgeDefinitions);
