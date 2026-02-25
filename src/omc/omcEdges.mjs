/**
 * @module omcEdges
 */

import { edgeTable, inverseEdges } from '../config/index.mjs';
import { isCapitalized, isPlainObject } from '../mlHelpers/util.mjs';

import { idNormalize, hasMatching } from './omcIdentifier.mjs';

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
        if (isPlainObject(omcEntity[key])) return { ...acc, ...getIntrinsicProps(omcEntity[key]) };
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
export function intrinsicAllowed(entityType) {
    return Object.keys(edgeTable[entityType].intrinsic).flatMap((intEdge) => edgeTable[entityType].intrinsic[intEdge].allowed);
}

/**
 * Returns an array of the entity types this entity can have an edge to as per the ontology
 * @function edgesAllowed
 * @static
 * @param {OmcEntityType} entityType - The entityType for which you wish to know the entities it can have an edge to.
 * @returns {Array<OmcEntityType>} An Array of the entity types this type may have an edge to
 */
export function edgesAllowed(entityType) {
    return Object.keys(edgeTable[entityType].edges).flatMap((predicate) => edgeTable[entityType].edges[predicate].allowed);
}

/**
 * Tests if an edge between two entityTypes is valid as per OMC and returns that edge or null
 * @param {OmcEntity} fromEntity
 * @param {OmcEntity} toEntity
 * @param {'edges'|'intrinsic'} edgeType - Check against intrinsic or regular edges
 * @returns {Object | null}
 */
export function edgeValid(fromEntity, toEntity, edgeType = 'intrinsic') {
    const { schemaVersion, entityType: fromEntityType } = fromEntity;
    const { entityType: toEntityType } = toEntity;
    // Check against the intrinsic edges of the entity
    const edges = schemaVersion === 'https://movielabs.com/omc/json/schema/v3.0'
        ? { ...edgeTable[fromEntityType].intrinsic || {}, ...edgeTable[fromEntityType].edges || {} }
        : edgeTable[fromEntityType][edgeType] || {};

    const validEdges = Object.keys(edges).reduce((obj, key) => (
        edges[key].allowed.includes(toEntityType)
            ? { ...obj, [key]: edges[key] }
            : obj
    ), {});
    return (Object.keys(validEdges)).length ? validEdges : null;
}

/**
 * Creates a new edge from one entity to another, based on the allowed edges for the entity
 * - Setting the 'inverse' property will also create the inverse edge in the toEntity if applicable
 * - Some entities have multiple properties where the same toEntity is allowed, using the intrinsicEdge property allows a specific one to be specified
 *
 * @function edgeCreate
 * @static
 * @param {Object} params
 * @param {OmcEntity} params.fromEntity - The entity on which to create the new edge
 * @param {OmcEntity} params.toEntity - The entity to which the edge should be created
 * @param {OmcEntity} params.forEntity - Use when setting edges in a Context, this is the entity for which the Context is For.
 * @param {Object} params.intrinsicEdge - Specify a specific edge, for entities that have multiple valid edge patterns, this denotes the specific one to use
 * @param {boolean} params.inverse - Whether the inverse edge should also be set if there is one
 * @param {'edges'|'intrinsic'} params.edgeType - Which edge table to use, intrinsic or regular edges.
 */
export function edgeCreate({
    fromEntity = null,
    toEntity = null,
    forEntity = null,
    intrinsicEdge = null,
    inverse = false,
    edgeType = 'intrinsic', // Do this for intrinsic or regular edges
}) {
    const validEdges = forEntity
        ? edgeValid(forEntity, toEntity, 'edges')
        : edgeValid(fromEntity, toEntity, edgeType); // Valid edges between to the from and to entities
    if (!validEdges) return null;
    const selectedEdge = validEdges[intrinsicEdge] || validEdges[Object.keys(validEdges)[0]]; // Check if an edge was specified, otherwise default to first option

    const updatedEntity = insertEdge(fromEntity, toEntity, selectedEdge);

    // If inverse edges are requested and there is one to apply, then recurse with the entities reversed
    if (inverse && selectedEdge.inverse) {
        const { fromEntity: updatedToEntity } = edgeCreate({
            toEntity: fromEntity, // Reverse the from and to entities to calculate the inverse edge
            fromEntity: toEntity,
            intrinsicEdge: selectedEdge.inverse, // Use the inverse edge from the edgeTable
            inverse: false, // Inverse is always false on second call
        });
        return {
            fromEntity: updatedEntity,
            toEntity: updatedToEntity,
        };
    }

    // Return the fromEntity with the updated edge
    return {
        fromEntity: updatedEntity,
        toEntity,
    };
}

/**
 * Return inverse relationships
 * @memberof module:omcEdges
 * @function edgeInverse
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Array<Object>}
 */
const inverseRelation = ((rel) => (inverseEdges[rel] ? inverseEdges[rel] : rel));

export function edgeInverse(omcContext) {
    // Generate the relationships to the source entities in the ForEntity properties
    const sourceRelated = ((sourceEntity) => sourceEntity.reduce((obj, srcEnt) => {
        const { entityType, identifier } = srcEnt;// The type and identifier of the source entity
        obj[entityType] = [...obj[entityType] || [], { identifier }];
        return obj;
    }, {}));

    // Invert all the relations in the context, these are independently each a context (merge them later)
    const invert = ((cxt, sourceEntity) => {
        const relations = related(cxt); // The relations in the context
        if (!relations) return []; // If no relations, then nothing to do
        const res = [];
        relations.forEach((relation) => {
            const revRelation = inverseRelation(relation); // Reverse the relation
            const relEntities = Object.keys(cxt[relation]); // The related entities for this relation
            relEntities.forEach((key) => {
                if (cxt[relation][key]) {
                    res.push(cxt[relation][key].map((relEnt) => ({
                        entityType: 'Context',
                        ForEntity: {
                            identifier: relEnt.identifier,
                        },
                        [revRelation]: sourceRelated(sourceEntity),
                    })));
                }
            });
        });
        return res.flat();
    });

    const sourceEntity = omcContext.ForEntity.filter((srcEnt) => {
        if (!Object.hasOwn(srcEnt, 'entityType')) {
            console.log('Error: omcUtil.context.inverse - Missing entityType in the ForEntity');
            return null;
        }
        return srcEnt; // The inverse context for the source entity
    }).filter((d) => d);
    return sourceEntity.length ? invert(omcContext, sourceEntity) : []; // Check that there were no errors
}
