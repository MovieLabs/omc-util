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

import { deepSpread, isCapitalized } from '../../mlHelpers/util.mjs';

// eslint-disable-next-line import/order
import { inverseEdges } from './inverseEdges.mjs';

import Asset from './asset/Asset.mjs';
import AssetSC from './asset/AssetSC.mjs';
import Infrastructure from './infrastructure/Infrastructure.mjs';
import InfrastructureSC from './infrastructure/InfrastructureSC.mjs';
import Character from './mediaCreation/Character.mjs';
import Context from './mediaCreation/Context.mjs';
import CreativeWork from './mediaCreation/CreativeWork.mjs';
import Depiction from './mediaCreation/Depiction.mjs';
import Effect from './mediaCreation/Effect.mjs';
import NarrativeAudio from './mediaCreation/NarrativeAudio.mjs';
import NarrativeLocation from './mediaCreation/NarrativeLocation.mjs';
import NarrativeObject from './mediaCreation/NarrativeObject.mjs';
import NarrativeScene from './mediaCreation/NarrativeScene.mjs';
import NarrativeStyling from './mediaCreation/NarrativeStyling.mjs';
import NarrativeWardrobe from './mediaCreation/NarrativeWardrobe.mjs';
import ProductionLocation from './mediaCreation/ProductionLocation.mjs';
import ProductionScene from './mediaCreation/ProductionScene.mjs';
import Slate from './mediaCreation/Slate.mjs';
import SpecialAction from './mediaCreation/SpecialAction.mjs';
import Department from './participant/Department.mjs';
import Organization from './participant/Organization.mjs';
import Participant from './participant/Participant.mjs';
import ParticipantSC from './participant/ParticipantSC.mjs';
import Person from './participant/Person.mjs';
import Role from './participant/Role.mjs';
import Service from './participant/Service.mjs';
import Task from './task/Task.mjs';
import TaskSC from './task/TaskSC.mjs';
import Collection from './utility/Collection.mjs';
import Composition from './utility/Composition.mjs';
import Location from './utility/Location.mjs';
import { baseEntity } from './utility/utility.mjs';

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
