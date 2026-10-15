/**
 * What the schema's shared `edges` block declares, for the checks.
 *
 * @module edgeBuild/checks/declarations
 * @ignore
 */

import { resolveRef } from '../../templates/schemaDerive.js';

/** Plain-object test the checks share. */
export const isObject = ((v) => !!v && typeof v === 'object' && !Array.isArray(v));

/**
 * The range keys a predicate declares: its own `properties`, or those of what it reaches through a
 * `$ref` or an `anyOf`/`oneOf` branch (`informs` is `anyOf: [{ $ref: entityMap }, null]`).
 */
function rangesOf(schema, node, seen = new Set()) {
    if (!isObject(node) || seen.has(node)) return [];
    const nested = new Set(seen).add(node);
    const own = Object.keys(node.properties || {});
    const linked = [
        ...(node.$ref ? [resolveRef(schema, node.$ref)] : []),
        ...(node.anyOf || []),
        ...(node.oneOf || []),
    ].flatMap((branch) => rangesOf(schema, branch, nested));
    return [...new Set([...own, ...linked])];
}

/**
 * The verbs the schema declares, and the `verb.Range` pairs. The `edges` object and most predicates
 * leave `additionalProperties` open, so anything absent here still validates — which is why an
 * omission has to be reported rather than left to validation.
 *
 * @param {object} schema - A parsed OMC JSON Schema document
 * @returns {{verbs: Set<string>, pairs: Set<string>}}
 */
export function schemaEdgeDeclarations(schema) {
    const node = schema?.$defs?.core?.properties?.edges?.properties || {};
    return {
        verbs: new Set(Object.keys(node)),
        pairs: new Set(Object.keys(node).flatMap((verb) => (
            rangesOf(schema, node[verb]).map((range) => `${verb}.${range}`)
        ))),
    };
}
