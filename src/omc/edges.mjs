/**
 * @module omcEdges
 */

/**
 * @typedef {import('../../types.mjs').OmcEntity} OmcEntity
 * @typedef {import('../../types.mjs').OmcIdentifier} OmcIdentifier
 */

import { inverseEdgeMap } from '../entityTemplates/index.mjs';
import { isCapitalized, isPlainObject } from '../mlHelpers/util.mjs';

import { normalizeIdentifier, hasMatching } from './identifier.mjs';

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

export function intrinsic(omcEntity) {
    return Object.keys(omcEntity).filter((k) => k[0].toLowerCase() !== k[0]); // Intrinsic properties are upper case
}

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
export function getContextProps(ent) {
    if (ent?.entityType !== 'Context') return null;
    const cxtKeys = getContextKeys(ent);
    return cxtKeys.reduce((acc, edgeName) => ({
        ...acc,
        [edgeName]: getIntrinsicProps(ent[edgeName]),
    }), {});
}

/**
 * Remove an identifier representing the edge to another entity from anywhere it is included in the entity
 *
 * @memberof module:omcEdges
 * @function removeEdge
 * @static
 * @param {OmcEntity} omcEntity
 * @param {OmcEntity | OmcIdentifier} identifier
 */
// Depending on if this is an Array, checks for matches, removes any and returns result or null if everything removed
const chkIdentifier = ((omcEntity, removeIdentifier) => {
    if (!omcEntity) return omcEntity; // Protect against null
    if (Array.isArray(omcEntity)) return omcEntity.filter((omc) => !hasMatching(omc, removeIdentifier));
    return hasMatching(omcEntity, removeIdentifier) ? null : omcEntity;
});

export function removeEdge(omcEnt, identifier) {
    const removeIdentifier = normalizeIdentifier(identifier);
    return Object.keys(omcEnt || {}).reduce((acc, key) => {
        if (isCapitalized(key)) return { ...acc, ...{ [key]: chkIdentifier(omcEnt[key], removeIdentifier) } };
        if (isPlainObject(omcEnt[key])) return { ...acc, ...{ [key]: removeEdge(omcEnt[key], removeIdentifier) } };
        return { ...acc, ...{ [key]: omcEnt[key] } };
    }, {});
}

/**
 * Return inverse relationships
 * @memberof module:omcEdges
 * @function inverse
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Array<Object>}
 */
const inverseRelation = ((rel) => (inverseEdgeMap[rel] ? inverseEdgeMap[rel] : rel));

export function inverse(omcContext) {
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
