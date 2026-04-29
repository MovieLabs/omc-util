/**
 * Builds the exported configuration tables for the desired schema
 *
 * This could be extended to include multiple versions of schemas in the future.
 */

/**
 * @typeDef {Object} EntityConfiguration
 * @property {string} schmaGroup -
 * @property {string} idPrefix
 * @property {Object} presentation
 * @property {EntityTemplate} template
 * @property {GraphQlTemplate} graphQl
 */

/**
 * @typedef {Object} EntityTemplate
 * @property {Object.<string, PropertyTemplate>} property - The properties of the entity
 */

/**
 * @typedef PropertyTemplate
 * @property {string} type - The type for this property (JSON-Schema syntax)
 * @property {boolean} mergeKey - Set for properties that act as merge keys.
 */

/**
 * @typedef EdgeTemplate
 * @property {string} type - Whether this edge is an array or single object (array, object)
 * @property {Array<string>} allowed - The entity types allowed for this edge
 * @property {string} path - The path on this entity (source) that the edge is stored
 * @property {string} inverse - The path on the target entity that carries the inverse edge
 * @property {string} predicate - The formal predicate for this edge, from RDF model
 */

/**
 * @typedef {Object} GraphQlTemplate
 * @property {Object} properties - The properties that can be queried
 * @property {Object| null} filter - Properties that accept a graphQl filter
 * @property {Object | null} inlineFragment - Supplemental inline fragments needed on properties
 */

/**
 * Parameters passed in to request template details
 *
 * @typedef {Object} TemplateQuery
 * @property {string} schemaVersion - The schema version key (e.g., "v1.0.0")
 * @property {string} entityType - The entity type key (e.g., "Asset", "Person")
 */

/**
 * The details for all edges on a given entityType
 *
 * @typedef {Object} EdgeTable
 * @property {Object.<OmcEntityType, EdgeTemplate>} edges - Descriptions of the regular edges
 * @property {Object.<OmcEntityType, EdgeTemplate>} intrinsic - Descriptions of the intrinsic edges
 */

/**
 * A set of consistent values and methods useful when presenting an entity in a UI
 *
 * @typedef {Object} Presentation
 * @property {string} entityColor - Background color when rendering the entity as node or in a UI
 * @property {string} entityLabel - A label for the entityType
 * @property {() => string} entityLabelSuffix - A suffix for use with the label, generally it's type (subclass)
 */

/**
 * @typedef {Object} SchemaGroup
 * @property {string} property - describe...
 */

/**
 * @typedef {Object} OmcTemplate
 * @property {(query: TemplateQuery) => EdgeTable} edgeTable - Returns the edge table definition for the given schema version and entity type.
 * @property {(query: TemplateQuery) => Presentation} presentation - Returns the presentation details for an entityType.
 * @property {(query: TemplateQuery) => SchemaGroup} schemaGroup - Returns a group name for which the entityType belongs.
 * @property {(query: TemplateQuery) => string} idPrefix - Returns a standard prefix for an entityType that can be used for identifierValue.
 * @property {(query: TemplateQuery) => GraphQlTemplate} graphQl -
 * @property {(query: TemplateQuery) => Array<OmcEntityType>} graphQlEntities - An array of entityTypes that are available in the graphql schema for this version
 */

import { isCapitalized } from '../mlHelpers/util.js';

import { generalConfig } from './generalConfig.js';
import * as omc2 from './v2-8/index.js';
import * as omc3 from './v3-0/index.js';

const versionTemplates = {
    'https://movielabs.com/omc/json/schema/v2.6': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v2.8': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v3.0': { ...omc3 },
};

/**
 * @type {OmcTemplate}
 */
// Function driven access to the templated values, based on the schema version
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
    idPrefix: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].idPrefix
    )),
    graphQl: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType]?.graphQl || null
    )),
    graphQlEntities: (({ schemaVersion }) => (
        Object.keys(versionTemplates[schemaVersion].entityTemplate).filter((e) => isCapitalized(e))
            .filter((eType) => Object.hasOwn(versionTemplates[schemaVersion].entityTemplate[eType], 'graphQl'))
    )),
    inverseEdge: (({ edge, schemaVersion }) => (
        versionTemplates[schemaVersion].inverseEdges[edge] || null
    )),
};

export {
    generalConfig,
    // graphQlTemplate,
    // inverseEdges,
    // edgeTable,
    omcTemplate,
};
