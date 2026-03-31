/**
 * Creates
 */

/**
 * These files represent the schema for each of the OMC entities
 * The entities are created by combining the base schema with the specific properties of each entity
 *
 * @param {Object} properties - The properties specific to the entity (see below)
 * @param {Object} graphQl - Contain supplemental graphql for the query (see below)
 * @param {graphQl.filter} filter - Enumerate which properties on the entity can be filtered in graphql query
 * @param {graphQl.inlineFragment} inlineFragment - Properties that require an inline fragment, typically because this is a union type
 * @param {string} idPrefix - A prefix that can be optionally used on identifier values, provides a clue in the identifier as what this is.
 *
 * The values of the keys can be used to signify additional details about the property:
 *  - Setting this to <null> means it will be included in the query
 *  - Setting a value here means this property can include a filter, which is passed into the query builder, the value describes the form and type of the filter.
 *  - Intrinsic properties (capitalized) will be default be replaced with a reference identifier, unless overridden by the query template
 *
 * The graphql property contains a string that is applied to the query prior to the properties themselves being inserted
 * This is mostly used for properties created with unions and an inline fragment must be included to
 * specify which one of the types in the union is being queried
 *
 * Other Notes:
 * By default the versioning is not included as this would add a lot of properties for each query that are often not required
 * To include version information this can be setup and passed in as a query template.
 */

import { deepSpread, isCapitalized } from '../../mlHelpers/util.js';

// eslint-disable-next-line import/order
import { inverseEdges } from './inverseEdges.js';

import Asset from './asset/Asset.js';
import AssetSC from './asset/AssetSC.js';
import Infrastructure from './infrastructure/Infrastructure.js';
import InfrastructureSC from './infrastructure/InfrastructureSC.js';
import Character from './mediaCreation/Character.js';
import Context from './mediaCreation/Context.js';
import CreativeWork from './mediaCreation/CreativeWork.js';
import Depiction from './mediaCreation/Depiction.js';
import Effect from './mediaCreation/Effect.js';
import NarrativeAudio from './mediaCreation/NarrativeAudio.js';
import NarrativeLocation from './mediaCreation/NarrativeLocation.js';
import NarrativeObject from './mediaCreation/NarrativeObject.js';
import NarrativeScene from './mediaCreation/NarrativeScene.js';
import NarrativeStyling from './mediaCreation/NarrativeStyling.js';
import NarrativeWardrobe from './mediaCreation/NarrativeWardrobe.js';
import ProductionLocation from './mediaCreation/ProductionLocation.js';
import ProductionScene from './mediaCreation/ProductionScene.js';
import Slate from './mediaCreation/Slate.js';
import SpecialAction from './mediaCreation/SpecialAction.js';
import Department from './participant/Department.js';
import Organization from './participant/Organization.js';
import Participant from './participant/Participant.js';
import ParticipantSC from './participant/ParticipantSC.js';
import Person from './participant/Person.js';
import Role from './participant/Role.js';
import Service from './participant/Service.js';
import Task from './task/Task.js';
import TaskSC from './task/TaskSC.js';
import Collection from './utility/Collection.js';
import Composition from './utility/Composition.js';
import Location from './utility/Location.js';
import { baseEntity } from './utility/utility.js';

const masterTemplate = {
    Asset,
    AssetSC,
    Character,
    CreativeWork,
    Context,
    Depiction,
    Effect,
    NarrativeAudio,
    NarrativeLocation,
    NarrativeScene,
    NarrativeObject,
    NarrativeStyling,
    NarrativeWardrobe,
    ProductionScene,
    ProductionLocation,
    Slate,
    SpecialAction,
    Participant,
    ParticipantSC,
    Organization,
    Department,
    Person,
    Service,
    Role,
    Infrastructure,
    InfrastructureSC,
    Task,
    TaskSC,
    Collection,
    Composition,
    Location,
    baseEntity,
};

// Flattens the intrinsic properties, and includes a JSON path
const buildIntrinsic = ((intEdges, path) => {
    if (!intEdges) return {};
    return Object.keys(intEdges).reduce((obj, edge) => (
        isCapitalized(edge)
            ? { ...obj, [edge]: { ...intEdges[edge], path: `${path}${edge}` } }
            : { ...obj, ...buildIntrinsic(intEdges[edge], `${edge}.`) }
    ), {});
});

// Flattens the edge properties, and includes a JSON path
const buildEdges = ((edges, path) => {
    if (!edges) return {};
    return Object.keys(edges).reduce((obj, edge) => (
        isCapitalized(edge)
            ? { ...obj, [edge]: { ...edges[edge], path: `${path}${edge}`, type: 'array' } }
            : { ...obj, ...buildIntrinsic(edges[edge], `${edge}.`) }
    ), {});
});

const graphQlTemplate = Object.keys(masterTemplate).reduce((obj, entityType) => {
    obj[entityType] = {
        properties: deepSpread(masterTemplate[entityType].properties, masterTemplate[entityType].graphQl.filter),
        inlineFragment: masterTemplate[entityType].graphQl.inlineFragment,
    };
    return obj;
}, {});

// Create an entries for the edge table, matching the structure of the intrinsic properties
const allEdges = Object.keys(masterTemplate).reduce((obj, entityType) => {
    const { edges } = masterTemplate[entityType];
    if (!edges) return obj;
    const template = Object.keys(edges).reduce((obj1, predicate) => {
        const t = edges[predicate].allowed.reduce((obj2, entType) => ({
            ...obj2,
            [entType]: {
                type: 'array',
                allowed: [entType],
                path: `edges.${predicate}.${entType}`,
                inverse: `edges.${inverseEdges[predicate]}.${entityType}`,
                predicate,
            },
        }), {});
        return { ...obj1, ...t };
    }, {});
    return {
        ...obj,
        [entityType]: template,
    };
}, {});

console.log(allEdges);

const edgeTable = Object.keys(masterTemplate).reduce((obj, entityType) => ({
    ...obj,
    [entityType]: {
        intrinsic: buildIntrinsic(masterTemplate[entityType].intrinsic, ''),
        // edges: masterTemplate[entityType].edges,
        edges: allEdges?.[entityType] || {},
    },
}), {});

export {
    graphQlTemplate,
    edgeTable,
    inverseEdges,
};
