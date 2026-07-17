/**
 * Builds the exported configuration tables for the desired schema
 *
 * This could be extended to include multiple versions of schemas in the future.
 */

/**
 * @memberof namespace:OmcUtil
 * @typedef {Object} EntityConfiguration
 * @property {string} schemaGroup
 * @property {string} idPrefix
 * @property {Object} presentation
 * @property {EntityTemplate} template
 * @property {GraphQlTemplate} graphQl
 */

/**
 * @memberof namespace:OmcUtil
 * @typedef {Object} EntityTemplate
 * @property {Object.<string, PropertyTemplate>} property - The properties of the entity
 */

/**
 * @memberof namespace:OmcUtil
 * @typedef PropertyTemplate
 * @property {string} type - The type for this property (JSON-Schema syntax)
 * @property {boolean} mergeKey - Set for properties that act as merge keys.
 */

/**
 * @memberof namespace:OmcUtil
 * @typedef EdgeTemplate
 * @property {string} type - How the reference is STORED on the source entity ('array' | 'object').
 *   This is a storage shape, NOT a cardinality cap — in v3.0 every edge is stored as an array.
 *   Use `maxItems` to ask "at most one?".
 * @property {number|undefined} maxItems - Cardinality cap from the JSON Schema; `undefined` means
 *   uncapped. Derived at build time (see schemaFacts.js) so it cannot drift from the schema.
 * @property {Array<string>} allowed - The entity types allowed for this edge
 * @property {string} path - The path on this entity (source) that the edge is stored
 * @property {string} predicate - The predicate (RDF property family) this edge belongs to
 * @property {'edges'|'intrinsic'} bucket - Which partition the edge is stored in
 * @property {Array<string>} pathSegments - `path` pre-split, so consumers never split it themselves
 * @property {Array<string>} containerSegments - The object path that must exist before the reference
 *   can be written: `pathSegments` minus its final segment (the range type for `edges.*` paths, or
 *   the property name for an intrinsic one). `[]` for a top-level intrinsic property.
 * @property {string} relativePath - `path` minus the bucket prefix (e.g. `hasCxt.Context`);
 *   equal to `path` for intrinsic edges
 * @property {string} inverse - The path on the target entity that carries the inverse edge
 * @property {string} omcPredicate - The formal predicate for this edge, from RDF model
 */

/**
 * @memberof namespace:OmcUtil
 * @typedef {Object} GraphQlTemplate
 * @property {Object} properties - The properties that can be queried
 * @property {Object| null} filter - Properties that accept a graphQl filter
 * @property {Object | null} inlineFragment - Supplemental inline fragments needed on properties
 */

/**
 * Parameters passed in to request template details
 *
 * @memberof namespace:OmcUtil
 * @typedef {Object} TemplateQuery
 * @property {string} schemaVersion - The schema version key (e.g., "v1.0.0")
 * @property {string} entityType - The entity type key (e.g., "Asset", "Person")
 */

/**
 * The details for all edges on a given entityType
 *
 * @memberof namespace:OmcUtil
 * @typedef {Object} EdgeTable
 * @property {Object.<OmcEntityType, EdgeTemplate>} edges - Descriptions of the regular edges
 * @property {Object.<OmcEntityType, EdgeTemplate>} intrinsic - Descriptions of the intrinsic edges
 * @property {Object.<OmcEntityType, EdgeTemplate>} cxtEdges - Descriptions of the edges allowed in related Context
 */

/**
 * Properties to be used when rendering the header section for an entity
 *
 * @memberof namespace:OmcUtil
 * @typedef {Object} PresentationHeader
 * @property {string} backgroudColor - Background color for header when rendering the entity as node or in a UI
 * @property {string} fontColor - Font color for header when rendering the entity as node or in a UI
 * @property {string} entityLabel - A label for the entityType
 * @property {function(): string} entityLabelSuffix - A suffix for use with the label, generally it's type (subclass)
 */

/**
 * Provides a set of suggested properties to display when rendering a node
 * Either the string indicating the property key, or a function that will return a string
 *
 * @memberof namespace:OmcUtil
 * @typedef {Array<string, function>} PresentationProps
 */

/**
 * A set of consistent values and methods useful when presenting an entity in a UI
 *
 * @memberof namespace:OmcUtil
 * @typedef {Object} Presentation
 * @property {PresentationHeader} header
 * @property {PresentationProps} propRows
 */

/**
 * @memberof namespace:OmcUtil
 * @typedef {Object<string, Array<OmcEntityType>>} SchemaGroups - Schema groups with all the entities that belong in that group
 */

/**
 * @memberof namespace:OmcUtil
 * @typedef {Object} OmcTemplate
 * @property {function(TemplateQuery): EdgeTable} edgeTable - Returns the edge table definition for the given schema version and entity type.
 * @property {function(TemplateQuery): EntityTemplate} template - Returns the stripped typed shape ($type per property) for an entityType. Describes the entity's shape as defined by the schema; used to construct new entities and to build mapping targets.
 * @property {function(TemplateQuery): Presentation|null} presentation - Returns the presentation details for an entityType, or null if the schema version or entityType is unknown.
 * @property {function(string, string=): string} versionLabel - The human-readable label for a schema version URL, e.g. 'v3.0'. Second argument is the fallback returned when there is no version (default 'unknown').
 * @property {function({key: string}): boolean} isRelationshipKey - True when `key` names an entity reference (a relationship) rather than a data property.
 * @property {function({schemaVersion: string}): (object|null)} referenceTemplate - The shape template of an entity reference (its identifier array), or null if the schema version is unknown. Required fields (identifierScope, identifierValue) are marked `$required`.
 * @property {function(TemplateQuery): string} schemaGroup - Returns a group name for which the entityType belongs.
 * @property {function(TemplateQuery): SchemaGroups} allSchemaGroups - Returns all entities in schema by their group
 * @property {function(TemplateQuery): string} idPrefix - Returns a standard prefix for an entityType that can be used for identifierValue.
 * @property {function(TemplateQuery): Array<OmcEntityType>} allEntityTypes - All entityTypes for this schema version
 * @property {function(TemplateQuery): GraphQlTemplate} graphQl - Templates for construction graphQl queries using queryBuiler
 * @property {function(TemplateQuery): Array<OmcEntityType>} graphQlEntities - An array of entityTypes that are available in the graphql schema for this version
 */

import { isCapitalized } from '../mlHelpers/util.js';
import schemav21 from '../omc/validation/schema/OMC-JSON-v2.1.schema.json' with { type: 'json' };
import schemav26 from '../omc/validation/schema/OMC-JSON-v2.6.schema.json' with { type: 'json' };
import schemav28 from '../omc/validation/schema/OMC-JSON-v2.8.schema.json' with { type: 'json' };
import schemav30 from '../omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };

import { referenceRequiredFields } from './schemaFacts.js';
import * as omc2 from './v2-8/index.js';
import * as omc3 from './v3-0/index.js';

const versionTemplates = {
    'https://movielabs.com/omc/json/schema/v2.1': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v2.6': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v2.8': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v3.0': { ...omc3 },
};

/** The schema behind each version, for facts the hand-authored templates don't carry. */
const versionSchemas = {
    'https://movielabs.com/omc/json/schema/v2.1': schemav21,
    'https://movielabs.com/omc/json/schema/v2.6': schemav26,
    'https://movielabs.com/omc/json/schema/v2.8': schemav28,
    'https://movielabs.com/omc/json/schema/v3.0': schemav30,
};

/**
 * Methods returning templated values based on the schema version
 * @type {OmcTemplate}
 * @memberof namespace:OmcUtil
 */
const omcTemplate = {
    edgeTable: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].edgeTable
    )),
    presentation: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion]?.entityTemplate?.[entityType]?.presentation || null
    )),
    template: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType]?.template || null
    )),
    versionLabel: ((schemaVersion, fallback = 'unknown') => (
        schemaVersion ? String(schemaVersion).split('/').pop() : fallback
    )),
    isRelationshipKey: (({ key }) => isCapitalized(key)),
    referenceTemplate: (({ schemaVersion }) => {
        const base = versionTemplates[schemaVersion]?.entityTemplate?.baseEntity?.template;
        if (!base?.identifier) return null;
        const required = new Set(referenceRequiredFields(versionSchemas[schemaVersion]));
        const items = base.identifier.$items || {};
        const $items = Object.fromEntries(Object.entries(items).map(([key, node]) => (
            [key, required.has(key) ? { ...node, $required: true } : node]
        )));
        return { identifier: { ...base.identifier, $items } };
    }),
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
