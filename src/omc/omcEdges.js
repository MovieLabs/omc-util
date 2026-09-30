/**
 * Read and write the relationships an entity holds.
 *
 * OMC stores a relationship in one of two places, and which one is a schema fact rather than
 * something to infer: the general case is `edges.<predicate>.<TargetType>[]`, but some are named
 * properties on the entity itself (`Asset.AssetStructure`). Both are covered here, and both are
 * resolved through the edge table rather than by reading the shape of the data — which is also why
 * `edgeCreate` returns falsy for an edge the schema does not allow, instead of writing it.
 *
 * It returns falsy for a full slot on the same grounds. Every v3.0 edge is *stored* as an array, so
 * the shape of the data cannot say how many references a slot admits — only `maxItems` on the edge
 * table can, and it applies to the reverse as much as the forward side. `edgeRefusal` answers why,
 * for a caller that has someone to tell.
 *
 * The separation these functions draw is between an entity's own data and its references to other
 * entities. `getBaseProps` gives the former, `getIntrinsicProps` and `relatedEdges` the latter.
 *
 * @module omcEdges
 */

import { isCapitalized, isPlainObject } from '../mlHelpers/util.js';
import { omcTemplate } from '../templates/index.js';

import { idNormalize, hasMatching } from './omcIdentifier.js';

const baseKeys = [
    'schemaVersion',
    'identifier',
    'name',
    'description',
    'entityType',
    'customData',
    'annotation',
    'tag',
    'instanceInfo',
    'Context',
];

const contextKeys = [
    ...baseKeys,
    'contextType',
    'contextCategory',
    'contextProperties',
    'For',
    'ForEntity',
    'Context',
];

/**
 * Helper functions for edgeCreate
 */
// Depending on if this is an Array, checks for matches, removes any and returns result or null if everything removed
// Used by removeEdge
const chkIdentifier = ((omcEntity, removeIdentifier) => {
    if (!omcEntity) return omcEntity; // Protect against null
    if (Array.isArray(omcEntity)) return omcEntity.filter((omc) => !hasMatching(omc, removeIdentifier));
    return hasMatching(omcEntity, removeIdentifier) ? null : omcEntity;
});

// Dummy call
// Used by edgeCreate
const idDeDupe = ((identifier) => identifier); // Dummy entry for now

// Select the nested element using dotted path notation
// Used by edgeCreate
const recursePath = ((obj, path) => {
    const prop = path.shift();
    if (!path.length) return { obj, prop };
    obj[prop] = obj[prop] || {}; // Create nested structure if the prop does not already exist
    return recursePath(obj[prop], path);
});

// Insert an entities reference identifier into the selected edge
// Used by edgeCreate
const insertEdge = ((omcEnt, refEntity, selectedEdge) => {
    const updatedEntity = { ...omcEnt };
    const { path, type } = selectedEdge;
    const { obj, prop } = recursePath(updatedEntity, path.split('.')); // Recurse to the correct property based on the path
    if (type === 'array') {
        obj[prop] = idDeDupe([...obj[prop] || [], { identifier: refEntity.identifier }]);
    }
    if (type === 'object') obj[prop] = { identifier: refEntity.identifier }; // ToDo: Needs to not replace an existing
    return updatedEntity;
});

/**
 * Return an array containing property keys that are present and part of the base entity
 * @memberof module:omcEdges
 * @function getBaseKeys
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Array<string>} - An array of property names present in the entity
 */
export function getBaseKeys(omcEntity) {
    return Object.keys(omcEntity).filter((k) => baseKeys.includes(k));
}

/**
 * Return an object containing just base entity properties and their values
 * @memberof module:omcEdges
 * @function getBaseProps
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Object<string, *>} - Base properties and values present on the entity
 */
export function getBaseProps(omcEntity) {
    return Object.keys(omcEntity).reduce((obj, key) => (
        baseKeys.includes(key) ? { ...obj, ...{ [key]: omcEntity[key] } } : obj
    ), {});
}

export function relatedEdges(omcEntity) {
    if (omcEntity.entityType !== 'Context') return null;
    return Object.keys(omcEntity).filter((k) => !contextKeys.includes(k));
}

/**
 * If the entityType is a Context, return an array containing property keys that specific to that Context
 * @memberof module:omcEdges
 * @function getContextKeys
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {(Array<string> | null)} - An array of property names present on the entity, or null if not a Context
 */
export function getContextKeys(omcEntity) {
    if (omcEntity.entityType !== 'Context') return null;
    return Object.keys(omcEntity).filter((k) => !contextKeys.includes(k));
}

// export function intrinsic(omcEntity) {
//     return Object.keys(omcEntity).filter((k) => k[0].toLowerCase() !== k[0]); // Intrinsic properties are upper case
// }

/**
 * Return an array containing intrinsic property keys that are present on the entity
 * @memberof module:omcEdges
 * @function getIntrinsicKeys
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Array<string>} - An array of intrinsic property names present on the entity
 */
export function getIntrinsicKeys(omcEntity) {
    return Object.keys(omcEntity).filter((k) => k[0].toLowerCase() !== k[0]); // Intrinsic properties are upper case
}

/**
 * Recurses through an omcEntity and returns a flattened map of all the intrinsic properties
 * that have valid references
 *
 * intrinsic props that are singletons will be coerced into an array
 *
 * @memberof module:omcEdges
 * @function getIntrinsicProps
 * @static
 * @param {OmcEntity} omcEntity - The entity for which you want the intrinsic props
 * @returns {Object<string, *>}
 */
export function getIntrinsicProps(omcEntity) {
    return Object.keys(omcEntity || {}).reduce((acc, key) => {
        if (!omcEntity[key]) return acc; // Ignore null and empty arrays
        if (isCapitalized(key)) return { ...acc, ...{ [key]: Array.isArray(omcEntity[key]) ? omcEntity[key] : [omcEntity[key]] } };
        if (key !== 'customData' && isPlainObject(omcEntity[key])) return { ...acc, ...getIntrinsicProps(omcEntity[key]) };
        return acc;
    }, {});
}

// Returns all references to intrinsic properties
export function getContextProps(omcEntity) {
    if (omcEntity?.entityType !== 'Context') return null;
    const cxtKeys = getContextKeys(omcEntity);
    return cxtKeys.reduce((acc, edgeName) => ({
        ...acc,
        [edgeName]: getIntrinsicProps(omcEntity[edgeName]),
    }), {});
}

/**
 * Remove an identifier representing the edge to another entity from anywhere it is included in the entity
 *
 * @memberof module:omcEdges
 * @function removeEdge
 * @static
 * @param {OmcEntity} omcEntity - The entity from which the edge is to be removed
 * @param {OmcEntity | OmcIdentifier} identifier - The entity or the identifier of the edge to be removed
 * @returns {OmcEntity} The original entity with matching edges removed
 */
export function removeEdge(omcEntity, identifier) {
    const removeIdentifier = idNormalize(identifier);
    return Object.keys(omcEntity || {}).reduce((acc, key) => {
        if (isCapitalized(key)) return { ...acc, ...{ [key]: chkIdentifier(omcEntity[key], removeIdentifier) } };
        return (key !== 'customData' && isPlainObject(omcEntity[key]))
            ? { ...acc, ...{ [key]: removeEdge(omcEntity[key], removeIdentifier) } }
            : { ...acc, ...{ [key]: omcEntity[key] } };
    }, {});
}

/**
 * Returns an array of the entity types this entity can have an edge to as per the ontology
 * @function intrinsicAllowed
 * @static
 * @param {OmcEntityType} entityType - The entityType for which you wish to know the entities it can have an edge to.
 * @returns {Array<OmcEntityType>} An Array of the entity types this type may have an edge to
 */
// export function intrinsicAllowed(entityType) {
//     return Object.keys(edgeTable[entityType].intrinsic).flatMap((intEdge) => edgeTable[entityType].intrinsic[intEdge].allowed);
// }

/**
 * Returns an array of the entity types this entity can have an edge to as per the ontology
 * @function edgesAllowed
 * @static
 * @param {OmcEntityType} entityType - The entityType for which you wish to know the entities it can have an edge to.
 * @returns {Array<OmcEntityType>} An Array of the entity types this type may have an edge to
 */
// export function edgesAllowed(entityType) {
//     return Object.keys(edgeTable[entityType].edges).flatMap((predicate) => edgeTable[entityType].edges[predicate].allowed);
// }

/**
 * Tests if an edge between two entityTypes is valid as per OMC and returns that edge or null
 * @function edgeValid
 * @param {Object} params
 * @param {OmcEntity} params.fromEntity - The entity from which the edge is from
 * @param {OmcEntity} params.toEntity - The entity from which the edge is to
 * @param {OmcEntity} params.forEntity - If toEntity is a Context, this is the entity which the Context is related to
 * @returns {Object | null} - An array of the valid entityTypes the fromEntity may connect to
 */
export function edgeValid({
    fromEntity = null,
    toEntity = null,
    forEntity = null,
}) {
    const { entityType: fromEntityType } = fromEntity;
    const { entityType: toEntityType } = toEntity;
    // Select the right set of edges dependent on whether this is a Context or not
    const isContext = !!(fromEntityType === 'Context' && forEntity);

    // If this is a context, use the edges of the forEntity, but they need the schemaVersion of the from because this is where they are placed
    const edgeSet = isContext
        ? omcTemplate.edgeTable({ ...forEntity, schemaVersion: fromEntity.schemaVersion })
        : omcTemplate.edgeTable(fromEntity);
    const allEdges = isContext ? edgeSet.cxtEdges : { ...edgeSet.intrinsic, ...edgeSet.edges };

    const onlyValidEdges = Object.keys(allEdges).reduce((obj, key) => (
        allEdges[key].allowed.includes(toEntityType)
            ? { ...obj, [key]: allEdges[key] }
            : obj
    ), {});
    return Object.keys(onlyValidEdges).length ? onlyValidEdges : null;
}

/**
 * Why an edge was not written.
 *
 * @typedef {Object} EdgeRefusal
 * @property {'notAllowed'|'full'} reason - The schema does not admit the edge at all, or the slot it
 *   goes in is already at its cap
 * @property {'source'|'target'} side - Which entity the full slot is on. `target` means the reverse
 *   edge had nowhere to go, which refuses the forward edge with it: nothing is written on either.
 * @property {OmcEntityType} entityType - The type carrying the full slot
 * @property {string} [path] - The slot's storage path on that entity
 * @property {number} [maxItems] - What the schema admits there
 * @property {number} [held] - What it already holds
 * @property {boolean} [holdsTarget] - Whether one of those is the entity being connected, which
 *   makes this an existing relationship rather than a cap that has been reached
 */

/**
 * What a slot currently holds, as an array however the value is stored.
 *
 * @param {OmcEntity} omcEntity
 * @param {string} path - Dotted storage path from the edge table
 * @returns {Array<Object>}
 */
const slotHolds = ((omcEntity, path) => {
    const value = path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), omcEntity);
    if (value === null || value === undefined) return [];
    return Array.isArray(value) ? value : [value];
});

/**
 * Whether one side of a proposed edge would exceed the cap the schema puts on its slot.
 *
 * @param {Object} params
 * @param {'source'|'target'} params.side
 * @param {OmcEntity} params.omcEntity - The entity the reference would be written on
 * @param {OmcEntity} params.refEntity - The entity being referenced
 * @param {string} params.path
 * @param {number|undefined} params.maxItems
 * @returns {EdgeRefusal|null}
 */
const capExceeded = (({
    side, omcEntity, refEntity, path, maxItems,
}) => {
    if (!maxItems || !path) return null;
    const held = slotHolds(omcEntity, path);
    if (held.length < maxItems) return null;
    return {
        side,
        entityType: omcEntity.entityType,
        path,
        maxItems,
        held: held.length,
        holdsTarget: held.some((ref) => hasMatching(ref, refEntity.identifier)),
    };
});

/**
 * Why `edgeCreate` would refuse to write this edge, or null where it would write it.
 *
 * Ask this when there is someone to tell. `edgeCreate` returns falsy on a refusal and writes
 * nothing, which is the whole of what a caller with nowhere to put a message needs; this says which
 * side was full, how full, and whether the reference is one already there — the difference between
 * "only one is allowed" and "these two are already related", which read as different problems to
 * whoever pressed the button.
 *
 * The cap is checked on both sides because both are written. `Realization.RealizationOf` admits one
 * reference, so a second NarrativeObject connected to the same Realization is refused by the
 * reverse even though the forward slot on the NarrativeObject has room.
 *
 * @function edgeRefusal
 * @param {Object} params - The same parameters `edgeCreate` takes
 * @returns {EdgeRefusal|null}
 */
export function edgeRefusal(params) {
    const {
        fromEntity = null,
        toEntity = null,
        intrinsicEdge = null,
        inverse = false,
    } = params;

    const validEdges = edgeValid(params);
    if (!validEdges) return { side: 'source', reason: 'notAllowed', entityType: fromEntity?.entityType };

    const selectedEdge = validEdges[intrinsicEdge] || validEdges[Object.keys(validEdges)[0]];
    const forward = capExceeded({
        side: 'source',
        omcEntity: fromEntity,
        refEntity: toEntity,
        path: selectedEdge.path,
        maxItems: selectedEdge.maxItems,
    });
    if (forward) return { ...forward, reason: 'full' };

    if (!inverse || !selectedEdge.inverse) return null;
    const reverse = capExceeded({
        side: 'target',
        omcEntity: toEntity,
        refEntity: fromEntity,
        path: selectedEdge.inversePath,
        maxItems: selectedEdge.inverseEdge?.maxItems,
    });
    return reverse ? { ...reverse, reason: 'full' } : null;
}

/**
 * Creates a new edge from one entity to another, based on the allowed edges for the entity
 * - Setting the 'inverse' property will also create the inverse edge in the toEntity if applicable
 * - Some entities have multiple properties where the same toEntity is allowed, using the intrinsicEdge property allows a specific property to be targeted
 *
 * @function edgeCreate
 * @param {Object} params
 * @param {OmcEntity} params.fromEntity - The entity on which to create the new edge
 * @param {OmcEntity} params.toEntity - The entity to which the edge should be created
 * @param {OmcEntity} params.forEntity - The entity which a Context is for, when the fromEntity is a Context
 * @param {Object} params.intrinsicEdge - Specify a specific edge, for entities that have multiple valid edge patterns, this denotes the specific one to use
 * @param {boolean} params.inverse - Whether the inverse edge should also be set if there is one
 */
export function edgeCreate(params) {
    const {
        fromEntity = null,
        toEntity = null,
        intrinsicEdge = null,
        inverse = false,
    } = params;

    const validEdges = edgeValid(params);
    if (!validEdges) return null;
    // Nothing is written when either slot is already at its cap — not the forward edge either, so a
    // refused connection leaves both entities exactly as they were. `edgeRefusal` gives the reason.
    if (edgeRefusal(params)) return null;

    const selectedEdge = validEdges[intrinsicEdge] || validEdges[Object.keys(validEdges)[0]]; // Check if an edge was specified, otherwise default to first option
    const updatedEntity = insertEdge(fromEntity, toEntity, selectedEdge);

    // If inverse edges are requested and there is one to apply, then recurse with the entities reversed
    if (inverse && selectedEdge.inverse) {
        const { inversePath } = selectedEdge;
        const inverseEntity = insertEdge(toEntity, fromEntity, { path: inversePath, type: 'array' });
        // const updatedInverse = edgeCreate({
        //     toEntity: fromEntity, // Reverse the from and to entities to calculate the inverse edge
        //     fromEntity: toEntity,
        //     forEntity: toEntity.entityType === 'Context' ? fromEntity : toEntity,
        //     intrinsicEdge: selectedEdge.inverse, // Use the inverse edge from the edgeTable
        //     inverse: false, // Inverse is always false on second call
        //     toEdgePath: selectedEdge.path,
        // });
        // return {
        //     fromEntity: updatedEntity,
        //     toEntity: updatedInverse.fromEntity,
        //     fromEdgePath: selectedEdge.path,
        //     toEdgePath: updatedInverse.fromEdgePath,
        // };
        return {
            fromEntity: updatedEntity,
            toEntity: inverseEntity,
            fromEdgePath: selectedEdge.path,
            toEdgePath: inversePath,
        };
    }

    // Return the fromEntity with the updated edge
    return {
        fromEntity: updatedEntity,
        toEntity,
        fromEdgePath: selectedEdge.path,
    };
}
