/**
 * Inverse-edge map: predicate name -> inverse predicate name.
 *
 * Built from a set of edge definitions, each predicate declaring its own `inverse`. The shipped
 * map comes from what the Edge Editor published and from nothing else — see edgeTable.js.
 *
 * A hand-written `supplemental` map used to be merged in underneath, covering predicates that
 * consumers referenced but edges.js did not model. It is kept below as a record and is **not**
 * merged: every inverse the library answers with has to come from the tool, so a predicate the
 * publication lacks must be added there rather than propped up here.
 */

/**
 * What the old hand-written map supplied. Retained so the six are not forgotten while the tool
 * catches up; nothing reads it.
 *
 * @type {Object<string, string>}
 */
export const LEGACY_SUPPLEMENTAL = {
    contributor: 'contributesTo',
    contributesTo: 'contributor',
    represents: 'representedBy',
    representedBy: 'represents',
    idea: 'subject',
    subject: 'idea',
};

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
