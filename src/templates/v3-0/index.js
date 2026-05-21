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

import { fileURLToPath } from 'node:url';

import { isCapitalized } from '../../mlHelpers/util.js';

// eslint-disable-next-line import/order
import { graphQlSnippets } from './graphQlSnippets.js';
// eslint-disable-next-line import/order
import { inverseEdges } from './inverseEdges.js';
// eslint-disable-next-line import/order
import { buildEdgeTable } from './buildEdgeTable.js';

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
import Person from './participant/Person.js';
import Role from './participant/Role.js';
import Service from './participant/Service.js';
import Task from './task/Task.js';
import TaskSC from './task/TaskSC.js';
import Collection from './utility/Collection.js';
import Composition from './utility/Composition.js';
import Location from './utility/Location.js';
import Provenance from './utility/Provenance.js';
import { baseEntity } from './utility/utility.js';

const omcTemplate = {
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
    Provenance,
};

// Flattens the edge properties, and includes a JSON path
const buildEdges = ((edges, path) => {
    if (!edges || edges.$type) return {};
    return Object.keys(edges).reduce((obj, edge) => (
        isCapitalized(edge)
            ? {
                ...obj, [edge]: {
                    allowed: edges[edge].$edge.$allowed,
                    path: `${path ? `${path}${edge}` : edge}`,
                    type: edges[edge].$type,
                    inverse: edges[edge].$edge.$inverse || null,
                    omcPredicate: edges[edge].$edge.$omcPredicate || null,
                },
            }
            : { ...obj, ...buildEdges(edges[edge], `${path ? `${path}.${edge}.` : `${edge}.`}`) }
    ), {});
});

/**
 * For each entity type build a table specific to a certain request based off the core templates
 */

const entityTemplate = Object.keys(omcTemplate).reduce((obj, entityType) => {
    const { edges, ...rest } = omcTemplate[entityType].template;
    const { cxtEdges } = omcTemplate[entityType];
    const intrinsic = buildEdges(rest, null);
    const edge = buildEdges(edges, 'edges'); // Path for edges, always starts with edges
    const cxtEdge = cxtEdges ? buildEdges(cxtEdges, 'edges') : edge;
    return {
        ...obj,
        [entityType]: {
            idPrefix: omcTemplate[entityType].idPrefix,
            schemaGroup: omcTemplate[entityType].group,
            presentation: omcTemplate[entityType].presentation,
            edgeTable: { intrinsic, edges: edge, cxtEdges: cxtEdge },
            graphQl: omcTemplate[entityType].graphQl,
        },
    };
}, {});

// The graphQl table also needs access to the baseEntity, this is added as special case
entityTemplate.baseEntity = { graphQl: baseEntity.graphQl };

// Add the inverse edge table
entityTemplate.inverseEdges = inverseEdges;

/**
 * DRAFT STUB — preview of the consolidated edge build (edges.js / buildEdgeTable.js).
 * Not wired into `entityTemplate` above; the live `buildEdges` flattener is unchanged.
 * Runs only when this file is executed directly:  node src/templates/v3-0/index.js
 */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const { table, collisions } = buildEdgeTable();
    console.log(JSON.stringify(table, null, 2));
    console.warn(`\n[edge build preview] ${collisions.length} key collision(s)`);
    collisions.forEach((c) => console.warn(`  ! ${c}`));
}

export {
    inverseEdges,
    graphQlSnippets,
    entityTemplate,
};
