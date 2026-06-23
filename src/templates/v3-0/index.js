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

// eslint-disable-next-line import/order
import { graphQlSnippets } from './graphQlSnippets.js';
// eslint-disable-next-line import/order
import { inverseEdges } from './inverseEdges.js';
// eslint-disable-next-line import/order
import { buildEdgeTable } from './buildEdgeTable.js';

import Asset from './asset/Asset.js';
import AssetStructure from './asset/AssetStructure.js';
import Infrastructure from './infrastructure/Infrastructure.js';
import InfrastructureStructure from './infrastructure/InfrastructureStructure.js';
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
import Realization from './mediaCreation/Realization.js';
import Slate from './mediaCreation/Slate.js';
import SpecialAction from './mediaCreation/SpecialAction.js';
import Department from './participant/Department.js';
import Organization from './participant/Organization.js';
import Participant from './participant/Participant.js';
import ParticipantStructure from './participant/ParticipantStructure.js';
import Person from './participant/Person.js';
import Role from './participant/Role.js';
import Service from './participant/Service.js';
import Task from './task/Task.js';
import TaskStructure from './task/TaskStructure.js';
import Collection from './utility/Collection.js';
import Composition from './utility/Composition.js';
import Location from './utility/Location.js';
import Provenance from './utility/Provenance.js';
import { baseEntity } from './utility/utility.js';

const omcTemplate = {
    Asset,
    AssetStructure,
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
    Realization,
    Slate,
    SpecialAction,
    Participant,
    ParticipantStructure,
    Organization,
    Department,
    Person,
    Service,
    Role,
    Infrastructure,
    InfrastructureStructure,
    Task,
    TaskStructure,
    Collection,
    Composition,
    Location,
    Provenance,
};

/**
 * For each entity type build the configuration consumed by the rest of the library.
 *
 * Edge tables ({ intrinsic, edges, cxtEdges } per entityType) are now generated from the
 * consolidated predicate definitions in edges.js (see buildEdgeTable.js) rather than
 * flattened out of the per-entity templates. Entries are keyed by their storage path.
 * Entity templates still supply idPrefix, schemaGroup, presentation and graphQl.
 */
const { table: edgeTables } = buildEdgeTable();

const entityTemplate = Object.keys(omcTemplate).reduce((obj, entityType) => ({
    ...obj,
    [entityType]: {
        idPrefix: omcTemplate[entityType].idPrefix,
        schemaGroup: omcTemplate[entityType].group,
        presentation: omcTemplate[entityType].presentation,
        edgeTable: edgeTables[entityType] || { intrinsic: {}, edges: {}, cxtEdges: {} },
        graphQl: omcTemplate[entityType].graphQl,
    },
}), {});

// The graphQl table also needs access to the baseEntity, this is added as special case
entityTemplate.baseEntity = { graphQl: baseEntity.graphQl };

// Add the inverse edge table
entityTemplate.inverseEdges = inverseEdges;

export {
    inverseEdges,
    graphQlSnippets,
    entityTemplate,
};
