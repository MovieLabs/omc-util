/**
 * Check a mapping before it is saved or run.
 *
 * Two checks, deliberately separate because they answer different questions and are available at
 * different times. {@link check} asks whether the mapping describes legal OMC — it needs only the
 * schema, so an editor can run it on every keystroke. {@link checkColumns} asks whether it fits the
 * data in front of it, which needs a set of column headings but still not a single row.
 *
 * Neither ever sees data. That is what keeps them usable in an authoring UI, where the point is to
 * make an invalid mapping unauthorable rather than merely rejected.
 *
 * @module omcMapping/check
 */

import { omcTemplate } from '../../templates/index.js';

import { resolveOptions } from './entity.js';
import { edgeTarget, identitySource, specSource } from './mapRow.js';
import { parseSegment } from './shapedValue.js';
import { sourceColumns, sourceInputs, sourceLabel } from './source.js';

import './types.js'; // Type definitions, resolved globally by JSDoc

/**
 * Walk a dotted path through a shape, descending into `$items` for array-of-object nodes.
 *
 * @param {Object} shape - The entity shape
 * @param {string} path - Dotted path, possibly with `[n]` indices
 * @returns {(Object|null)} The shape node at that path, or null when it does not resolve
 */
function resolvePath(shape, path) {
    let node = shape;
    for (const segment of path.split('.')) {
        const { name } = parseSegment(segment);
        if (!node || typeof node !== 'object') return null;
        const next = node[name];
        if (!next) return null;
        node = next.$type === 'array' && next.$items ? next.$items : next;
        if (node !== next && Object.keys(node).every((k) => k.startsWith('$'))) node = next;
    }
    return node;
}

/**
 * Resolve a path that writes into a relationship slot.
 *
 * `omcTemplate.shape()` is deliberately data-only — relationships are delivered by `edgeTable()` —
 * so a path like `edges.has.Slate[0].identifier[0].identifierValue` resolves against neither the
 * shape nor anything else, and was reported as a property the entity does not have.
 *
 * It is a legitimate and useful mapping: it references an entity by an identifier the source
 * already carries, without building that entity. So the edge part is checked against the edge
 * table, and the remainder against the reference template — which is stricter than the shape walk
 * would have been, since it also rejects writing an arbitrary property into a reference.
 *
 * @param {Object} edgeTable - `omcTemplate.edgeTable()` for this entity
 * @param {string} schemaVersion
 * @param {string} path - The mapping's property path
 * @returns {({node: Object, edge: Object}|null)} The resolved leaf and the edge it sits in, or
 *   null when the path is not a relationship path at all
 */
function resolveEdgePath(edgeTable, schemaVersion, path) {
    const all = { ...edgeTable.intrinsic ?? {}, ...edgeTable.edges ?? {} };
    // Longest first, so `edges.has.Slate` wins over a shorter entry that also prefixes the path.
    const entry = Object.values(all)
        .filter((e) => path === e.path || path.startsWith(`${e.path}[`) || path.startsWith(`${e.path}.`))
        .sort((a, b) => b.path.length - a.path.length)[0];
    if (!entry) return null;

    const rest = path.slice(entry.path.length).replace(/^\[\d+\]\.?/, '').replace(/^\./, '');
    // The slot itself, with nothing after it, is a relationship — not something a column fills.
    if (!rest) return { node: null, edge: entry };

    const node = resolvePath(omcTemplate.referenceTemplate({ schemaVersion }), rest);
    return { node, edge: entry };
}

/**
 * Check a mapping against the schema.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {OmcMapping.MappingOptions} [params.options] - Schema version comes from here
 * @returns {{valid: boolean, schemaVersion: string, checked: Object,
 *   problems: Array<OmcMapping.MappingNote>, warnings: Array<OmcMapping.MappingNote>}} The outcome.
 *   `valid` reflects `problems` only; a warning, such as a fixed value outside a property's
 *   controlled values, never stops a save or a run
 */
export function check({ mapping, options = {} }) {
    const { schemaVersion } = resolveOptions(options);
    const problems = [];
    const warnings = [];
    const known = new Set(omcTemplate.allEntityTypes({ schemaVersion }) ?? []);
    const seenTypes = new Set();
    const seenIds = new Set();
    let properties = 0;
    let edges = 0;

    for (const entry of mapping ?? []) {
        const { entityType, id } = entry;
        const where = entityType ?? '(no entityType)';

        // The entry's id is what an edge names, so without one, or with one another entry has, an
        // edge cannot say which entry it means.
        if (typeof id !== 'string' || !id) {
            problems.push({
                kind: 'missingEntryId',
                where,
                detail: 'this entry has no id, so no edge can name it',
            });
        } else if (seenIds.has(id)) {
            problems.push({
                kind: 'duplicateEntryId',
                where,
                detail: `another entry already has the id "${id}"; each entry needs its own`,
            });
        }
        seenIds.add(id);

        if (!entityType || !known.has(entityType)) {
            problems.push({
                kind: 'unknownEntityType',
                where,
                detail: `${omcTemplate.versionLabel(schemaVersion)} has no entity type "${entityType}"`,
            });
            continue;
        }
        seenTypes.add(entityType);

        // Mapping the source's own id counts as nominating a key: it already says what names the
        // thing, and the identifier is taken verbatim rather than hashed.
        if (!identitySource(entry)) {
            problems.push({
                kind: 'missingKey',
                where,
                detail: 'no key, so this entity has nothing to identify it by and a re-run '
                    + 'would duplicate rather than update it. Nominate a key, or map the source\'s '
                    + 'own id onto identifierValue',
            });
        }

        // A property reads a value at a path in an input's entities; only a key or via may read the
        // input itself, which gives the entities' identities.
        const sources = Object.entries(entry.properties ?? {}).map(([path, spec]) => [path, specSource(spec)]);
        sources.filter(([, source]) => sourceInputs(source).length && !source.path).forEach(([what, source]) => {
            problems.push({ kind: 'inputWithoutPath', where, detail: `${what} reads input "${source.input}" with no path` });
        });

        const shape = omcTemplate.shape({ entityType, schemaVersion });
        const edgeTable = omcTemplate.edgeTable({ entityType, schemaVersion }) ?? {};

        for (const path of [...Object.keys(entry.properties ?? {}), ...Object.keys(entry.notes ?? {})]) {
            properties += 1;
            // A relationship path resolves against the edge table, not the shape.
            const asEdge = resolveEdgePath(edgeTable, schemaVersion, path);
            if (asEdge) {
                if (!asEdge.node) {
                    problems.push({
                        kind: 'unknownProperty',
                        where,
                        detail: `"${path}" is a relationship to ${asEdge.edge.allowed.join(' or ')}, not a `
                            + 'value. Map onto its identifierValue to reference an entity by an id '
                            + 'the source carries, or link the two entities on the canvas',
                    });
                }
                continue;
            }
            const node = resolvePath(shape, path);
            if (!node) {
                problems.push({
                    kind: 'unknownProperty',
                    where,
                    detail: `${entityType} has no property "${path}" in `
                        + `${omcTemplate.versionLabel(schemaVersion)}`,
                });
                continue;
            }
            const spec = entry.properties?.[path];
            const fixed = spec && typeof spec === 'object' ? spec.const : undefined;
            if (fixed !== undefined && Array.isArray(node.$enum) && !node.$enum.includes(fixed)) {
                problems.push({
                    kind: 'valueNotAllowed',
                    where,
                    detail: `"${fixed}" is not an allowed value for ${path}; the schema permits `
                        + `${node.$enum.join(', ')}`,
                });
            } else if (fixed !== undefined && Array.isArray(node.$controlledValues)
                && !node.$controlledValues.includes(fixed)) {
                warnings.push({
                    kind: 'valueNotSuggested',
                    where,
                    detail: `"${fixed}" is not one of the controlled values for ${path} `
                        + `(${node.$controlledValues.join(', ')}); it is accepted, but check it is not a `
                        + 'misspelling of one',
                });
            }
        }

        const allEdges = { ...edgeTable.intrinsic ?? {}, ...edgeTable.edges ?? {} };
        for (const edge of entry.edges ?? []) {
            edges += 1;
            if (typeof edge.input === 'string' && (edge.to !== undefined || edge.via !== undefined)) {
                problems.push({
                    kind: 'ambiguousEdge',
                    where,
                    detail: `an edge names input "${edge.input}" and also a to or via; an input edge targets the input's entities, so give it neither`,
                });
                continue;
            }
            const target = edgeTarget(mapping, edge);
            if (!target) {
                problems.push({
                    kind: 'unknownEdgeTarget',
                    where,
                    detail: (edge.to ?? edge.toType)
                        ? `an edge names "${edge.to}", which is no entry in this template`
                        : 'an edge names no target: give it the id of an entry (to), an entityType (toType) or an input',
                });
                continue;
            }
            const targetType = target.entityType;
            // `edgeKey` names the relationship being filled. When it is given, that relationship is
            // what has to admit the target — "some edge somewhere allows this type" would pass a
            // mapping that writes the reference into a different relationship than it names. It is
            // optional, so a mapping that names no relationship is still checked the old way.
            const named = edge.edgeKey ? allEdges[edge.edgeKey] : null;
            if (edge.edgeKey && !named) {
                problems.push({
                    kind: 'edgeNotAllowed',
                    where,
                    detail: `${entityType} has no relationship "${edge.edgeKey}" in `
                        + `${omcTemplate.versionLabel(schemaVersion)}`,
                });
                continue;
            }
            // An input edge without a toType takes whatever type the row's entities are.
            if (!targetType) {
                warnings.push({
                    kind: 'uncheckedEdge',
                    where,
                    detail: `the edge to input "${edge.input}" declares no toType, so whether it fits is known only when a row is mapped`,
                });
                continue;
            }
            const allowed = named
                ? named.allowed?.includes(targetType)
                : Object.values(allEdges).some((e) => e.allowed?.includes(targetType));
            if (!allowed) {
                problems.push({
                    kind: 'edgeNotAllowed',
                    where,
                    detail: named
                        ? `${entityType}.${edge.edgeKey} cannot reference ${targetType} in `
                        + `${omcTemplate.versionLabel(schemaVersion)}; it admits `
                        + `${named.allowed?.join(' or ') || 'nothing'}`
                        : `${entityType} cannot reference ${targetType} in `
                            + `${omcTemplate.versionLabel(schemaVersion)}`,
                });
            }
        }
    }

    // Two entries of one type identified the same way build one entity, which is right when they
    // describe it from different angles and a surprise when two entities were meant.
    const byIdentity = new Map();
    for (const entry of mapping ?? []) {
        const identity = identitySource(entry);
        if (!entry.entityType || !identity) continue;
        const key = `${entry.entityType}::${sourceLabel(identity)}`;
        if (byIdentity.has(key)) {
            warnings.push({
                kind: 'sameEntity',
                where: entry.entityType,
                detail: `two ${entry.entityType} entries are both identified by ${sourceLabel(identity)}, so `
                    + 'they build one entity between them. Identify one differently to build two',
            });
        }
        byIdentity.set(key, true);
    }

    return {
        valid: problems.length === 0,
        schemaVersion,
        checked: {
            entries: (mapping ?? []).length, entityTypes: [...seenTypes], properties, edges,
        },
        problems,
        warnings,
    };
}

/**
 * Check a mapping against the columns it will actually be given.
 *
 * The schema check cannot do this — it never learns what the data looks like — and a mapping that
 * is perfectly legal OMC still produces nothing if it names a column that is not there. Which is
 * the failure people actually hit, because column headings change.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {Array<string>} params.columns - The column headings available
 * @returns {{valid: boolean, problems: Array<OmcMapping.MappingNote>, missing: Array<string>}}
 *   The outcome, and every column named but absent
 */
export function checkColumns({ mapping, columns }) {
    const have = new Set(columns ?? []);
    const problems = [];
    const missing = new Set();

    const want = (column, where, what) => {
        if (!column || have.has(column)) return;
        missing.add(column);
        problems.push({
            kind: 'unknownColumn',
            where,
            detail: `${what} names column "${column}", which is not in this data`,
        });
    };

    for (const entry of mapping ?? []) {
        const where = entry.entityType ?? '(no entityType)';
        // Only when it is the identity — an entity naming itself through identifierValue has no
        // separate key column to check.
        sourceColumns(entry.key).forEach((column) => want(column, where, 'the key'));
        for (const [path, spec] of Object.entries(entry.properties ?? {})) {
            sourceColumns(specSource(spec)).forEach((column) => want(column, where, path));
        }
        for (const [path, entries] of Object.entries(entry.notes ?? {})) {
            (entries ?? []).forEach((n) => want(n.from, where, path));
        }
        for (const edge of entry.edges ?? []) {
            const what = `the edge to ${edgeTarget(mapping, edge)?.entityType ?? edge.to ?? edge.toType}`;
            sourceColumns(edge.via).forEach((column) => want(column, where, what));
        }
        for (const column of entry.customData?.exclude ?? []) {
            want(column, where, 'customData.exclude');
        }
    }

    return { valid: problems.length === 0, problems, missing: [...missing] };
}

/**
 * Check a mapping against the inputs it will actually be given: every input a source or an edge
 * names must be one of them.
 *
 * @param {Object} params
 * @param {Array<OmcMapping.EntityMapping>} params.mapping - The template
 * @param {Array<string>} params.inputs - The input names available
 * @returns {{valid: boolean, problems: Array<OmcMapping.MappingNote>, missing: Array<string>}}
 *   The outcome, and every input named but absent
 */
export function checkInputs({ mapping, inputs }) {
    const have = new Set(inputs ?? []);
    const problems = [];
    const missing = new Set();

    const want = (input, where, what) => {
        if (!input || have.has(input)) return;
        missing.add(input);
        problems.push({ kind: 'unknownInput', where, detail: `${what} names input "${input}", which is not given` });
    };

    for (const entry of mapping ?? []) {
        const where = entry.entityType ?? '(no entityType)';
        sourceInputs(entry.key).forEach((input) => want(input, where, 'the key'));
        for (const [path, spec] of Object.entries(entry.properties ?? {})) {
            sourceInputs(specSource(spec)).forEach((input) => want(input, where, path));
        }
        for (const edge of entry.edges ?? []) {
            want(edge.input, where, 'an edge');
            sourceInputs(edge.via).forEach((input) => want(input, where, 'an edge'));
        }
    }

    return { valid: problems.length === 0, problems, missing: [...missing] };
}
