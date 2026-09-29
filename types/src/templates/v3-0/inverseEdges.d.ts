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
export const LEGACY_SUPPLEMENTAL: {
    [x: string]: string;
};
export function inverseEdgesFrom(definitions: any): {
    [x: string]: string;
};
//# sourceMappingURL=inverseEdges.d.ts.map