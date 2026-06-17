/**
 * Builds the exported configuration tables for the desired schema
 *
 * This could be extended to include multiple versions of schemas in the future.
 */

/**
 * @typeDef {Object} EntityConfiguration
 * @memberOf namespace:OmcUtil
 * @property {string} schmaGroup
 * @property {string} idPrefix
 * @property {Object} presentation
 * @property {EntityTemplate} template
 * @property {GraphQlTemplate} graphQl
 */

/**
 * @typedef {Object} EntityTemplate
 * @memberOf namespace:OmcUtil
 * @property {Object.<string, PropertyTemplate>} property - The properties of the entity
 */

/**
 * @typedef PropertyTemplate
 * @memberOf namespace:OmcUtil
 * @property {string} type - The type for this property (JSON-Schema syntax)
 * @property {boolean} mergeKey - Set for properties that act as merge keys.
 */

/**
 * @typedef EdgeTemplate
 * @memberOf namespace:OmcUtil
 * @property {string} type - Whether this edge is an array or single object (array, object)
 * @property {Array<string>} allowed - The entity types allowed for this edge
 * @property {string} path - The path on this entity (source) that the edge is stored
 * @property {string} inverse - The path on the target entity that carries the inverse edge
 * @property {string} omcPredicate - The formal predicate for this edge, from RDF model
 */

/**
 * @typedef {Object} GraphQlTemplate
 * @memberOf namespace:OmcUtil
 * @property {Object} properties - The properties that can be queried
 * @property {Object| null} filter - Properties that accept a graphQl filter
 * @property {Object | null} inlineFragment - Supplemental inline fragments needed on properties
 */

/**
 * Parameters passed in to request template details
 *
 * @typedef {Object} TemplateQuery
 * @memberOf namespace:OmcUtil
 * @property {string} schemaVersion - The schema version key (e.g., "v1.0.0")
 * @property {string} entityType - The entity type key (e.g., "Asset", "Person")
 */

/**
 * The details for all edges on a given entityType
 *
 * @typedef {Object} EdgeTable
 * @memberOf namespace:OmcUtil
 * @property {Object.<OmcEntityType, EdgeTemplate>} edges - Descriptions of the regular edges
 * @property {Object.<OmcEntityType, EdgeTemplate>} intrinsic - Descriptions of the intrinsic edges
 * @property {Object.<OmcEntityType, EdgeTemplate>} cxtEdges - Descriptions of the edges allowed in related Context
 */

/**
 * Properties to be used when rendering the header section for an entity
 *
 * @typedef {Object} PresentationHeader
 * @memberOf namespace:OmcUtil
 * @property {string} backgroudColor - Background color for header when rendering the entity as node or in a UI
 * @property {string} fontColor - Font color for header when rendering the entity as node or in a UI
 * @property {string} entityLabel - A label for the entityType
 * @property {function(): string} entityLabelSuffix - A suffix for use with the label, generally it's type (subclass)
 */

/**
 * Provides a set of suggested properties to display when rendering a node
 * Either the string indicating the property key, or a function that will return a string
 *
 * @typedef {Array<string, function>} PresentationProps
 * @memberOf namespace:OmcUtil
 */

/**
 * A set of consistent values and methods useful when presenting an entity in a UI
 *
 * @typedef {Object} Presentation
 * @memberOf namespace:OmcUtil
 * @property {PresentationHeader} header
 * @property {PresentationProps} propRows
 */

/**
 * @typedef {Object<string, Array<OmcEntityType>>} SchemaGroups - Schema groups with all the entities that belong in that group
 * @memberOf namespace:OmcUtil
 */

/**
 * @typedef {Object} OmcTemplate
 * @memberOf namespace:OmcUtil
 * @property {function(TemplateQuery): EdgeTable} edgeTable - Returns the edge table definition for the given schema version and entity type.
 * @property {function(TemplateQuery): Presentation} presentation - Returns the presentation details for an entityType.
 * @property {function(TemplateQuery): string} schemaGroup - Returns a group name for which the entityType belongs.
 * @property {function(TemplateQuery): SchemaGroups} allSchemaGroups - Returns all entities in schema by their group
 * @property {function(TemplateQuery): string} idPrefix - Returns a standard prefix for an entityType that can be used for identifierValue.
 * @property {function(TemplateQuery): Array<OmcEntityType>} allEntityTypes - All entityTypes for this schema version
 * @property {function(TemplateQuery): GraphQlTemplate} graphQl - Templates for construction graphQl queries using queryBuiler
 * @property {function(TemplateQuery): Array<OmcEntityType>} graphQlEntities - An array of entityTypes that are available in the graphql schema for this version
 */

import { isCapitalized } from '../mlHelpers/util.js';

import * as omc2 from './v2-8/index.js';
import * as omc3 from './v3-0/index.js';

const versionTemplates = {
    'https://movielabs.com/omc/json/schema/v2.6': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v2.8': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v3.0': { ...omc3 },
};

/**
 * Methods returning templated values based on the schema version
 * @type {OmcTemplate}
 * @memberOf namespace:OmcUtil
 */
const omcTemplate = {
    edgeTable: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].edgeTable
    )),
    presentation: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].presentation
    )),
    schemaGroup: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].schemaGroup
    )),
    allSchemaGroups: (({ schemaVersion }) => {
        const allEntities = Object.keys(versionTemplates[schemaVersion].entityTemplate).filter((e) => isCapitalized(e));
        return allEntities.reduce((acc, entityType) => {
            const group = versionTemplates[schemaVersion].entityTemplate[entityType].schemaGroup;
            acc[group] = [...acc[group] || [], entityType];
            return acc;
        }, {});
    }),
    idPrefix: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].idPrefix
    )),
    allEntityTypes: (({ schemaVersion }) => (
        Object.keys(versionTemplates[schemaVersion].entityTemplate).filter((e) => isCapitalized(e))
    )),
    graphQl: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType]?.graphQl || null
    )),
    graphQlEntities: (({ schemaVersion }) => (
        Object.keys(versionTemplates[schemaVersion].entityTemplate).filter((e) => isCapitalized(e))
            .filter((eType) => Object.hasOwn(versionTemplates[schemaVersion].entityTemplate[eType], 'graphQl'))
    )),
    graphQlSnippets: (({ schemaVersion }) => (
        versionTemplates[schemaVersion].graphQlSnippets || null
    )),
    inverseEdge: (({ edge, schemaVersion }) => (
        versionTemplates[schemaVersion].inverseEdges[edge] || null
    )),
};

export { omcTemplate };
