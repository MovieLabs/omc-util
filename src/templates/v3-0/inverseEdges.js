/**
 * Inverse-edge map: predicate name -> inverse predicate name.
 *
 * Built from a set of edge definitions, each predicate declaring its own `inverse`. The shipped
 * map comes from what the Edge Editor published and from nothing else — see edgeTable.js.
 *
 * A hand-written map used to be merged in underneath, covering predicates that consumers referenced
 * but the seed did not model. Nothing is merged now: every inverse the library answers with comes
 * from the tool, so a predicate the publication lacks is added there rather than propped up here.
 */

/**
 * Build the inverse map from a set of edge definitions: each predicate's top-level `inverse`,
 * skipping null and the per-group-only ones, which this shape cannot express.
 *
 * @param {Object} definitions - Edge definitions in the published shape
 * @returns {Object<string, string>} predicate name -> inverse predicate name
 */
export const inverseEdgesFrom = (definitions) => Object.entries(definitions)
    .reduce((map, [predicate, def]) => {
        if (def.inverse) map[predicate] = def.inverse;
        return map;
    }, {});
