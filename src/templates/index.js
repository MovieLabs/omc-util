/**
 * Builds the exported configuration tables for the desired schema
 *
 * This could be extended to include multiple versions of schemas in the future.
 */

/**
 * @memberof OmcUtil
 * @typedef {Object} EntityConfiguration
 * @property {string} schemaGroup
 * @property {string} idPrefix
 * @property {string[]} mergeKey - Property path(s) unique within a project, usable as an identity substitute (see OmcTemplate.mergeKey). `[]` when the type has none.
 * @property {Object} presentation
 * @property {EntityTemplate} template
 * @property {GraphQlTemplate} graphQl
 */

/**
 * @memberof OmcUtil
 * @typedef {Object} EntityTemplate
 * @property {Object.<string, PropertyTemplate>} property - The properties of the entity
 */

/**
 * @memberof OmcUtil
 * @typedef PropertyTemplate
 * @property {string} type - The type for this property (JSON-Schema syntax)
 * @property {boolean} mergeKey - Set for properties that act as merge keys.
 */

/**
 * @memberof OmcUtil
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
 * @property {string} omcPredicate - The formal predicate for this edge, from the RDF model: the
 *   published property name where the model names exactly one, otherwise the generated
 *   `omcT:` template.
 * @property {string[]} rdfProperties - Every RDF property the model names for this row, one per
 *   allowed range it covers. Empty where the model names none.
 * @property {string} rdfTemplated - The generated name, kept so a templated fallback can be
 *   told from a published one.
 */

/**
 * @memberof OmcUtil
 * @typedef {Object} GraphQlTemplate
 * @property {Object} properties - The properties that can be queried
 * @property {Object| null} filter - Properties that accept a graphQl filter
 * @property {Object | null} inlineFragment - Supplemental inline fragments needed on properties
 */

/**
 * Parameters passed in to request template details
 *
 * @memberof OmcUtil
 * @typedef {Object} TemplateQuery
 * @property {string} schemaVersion - The schema version key (e.g., "v1.0.0")
 * @property {string} entityType - The entity type key (e.g., "Asset", "Person")
 */

/**
 * The details for all edges on a given entityType
 *
 * @memberof OmcUtil
 * @typedef {Object} EdgeTable
 * @property {Object.<OmcEntityType, EdgeTemplate>} edges - Descriptions of the regular edges
 * @property {Object.<OmcEntityType, EdgeTemplate>} intrinsic - Descriptions of the intrinsic edges
 * @property {Object.<OmcEntityType, EdgeTemplate>} cxtEdges - Descriptions of the edges allowed in related Context
 */

/**
 * Properties to be used when rendering the header section for an entity
 *
 * @memberof OmcUtil
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
 * @memberof OmcUtil
 * @typedef {Array<string, function>} PresentationProps
 */

/**
 * A set of consistent values and methods useful when presenting an entity in a UI
 *
 * @memberof OmcUtil
 * @typedef {Object} Presentation
 * @property {PresentationHeader} header
 * @property {PresentationProps} propRows
 */

/**
 * @memberof OmcUtil
 * @typedef {Object<string, Array<OmcEntityType>>} SchemaGroups - Schema groups with all the entities that belong in that group
 */

/**
 * @memberof OmcUtil
 * @typedef {Object} OmcTemplate
 * @property {function(TemplateQuery): EdgeTable} edgeTable - Returns the edge table definition for the given schema version and entity type.
 * @property {function(TemplateQuery): (object|null)} shape - The entity's data shape derived from the JSON Schema (v2.8+), carrying `$type`, `$maxItems`, `$default`, `$required` and `$controlledValues` inline per property; edges (see edgeTable) and instanceInfo are excluded. Falls back to the hand-authored template for legacy versions; null when the entityType is unknown.
 * @property {function(TemplateQuery): Presentation|null} presentation - Returns the presentation details for an entityType, or null if the schema version or entityType is unknown.
 * @property {function(string, string=): string} versionLabel - The human-readable label for a schema version URL, e.g. 'v3.0'. Second argument is the fallback returned when there is no version (default 'unknown').
 * @property {function({key: string}): boolean} isRelationshipKey - True when `key` names an entity reference (a relationship) rather than a data property.
 * @property {function({schemaVersion: string}): (object|null)} referenceTemplate - The shape template of an entity reference (its identifier array), or null if the schema version is unknown. Required fields (identifierScope, identifierValue) are marked `$required`.
 * @property {function(TemplateQuery): string} schemaGroup - Returns a group name for which the entityType belongs.
 * @property {function({schemaVersion: string, entityType: OmcEntityType, edge: string}): (object|null)} inverseEdgeFor
 *   The reverse of one edge, as an edge — name, bucket and path, resolved per domain. Prefer
 *   it to `inverseEdge`, whose flat map cannot express an intrinsic inverse, a per-group
 *   override, or two pairs sharing a verb.
 * @property {function(TemplateQuery): SchemaGroups} allSchemaGroups - Returns all entities in schema by their group
 * @property {function(TemplateQuery): string} idPrefix - Returns a standard prefix for an entityType that can be used for identifierValue.
 * @property {function(TemplateQuery): string[]} mergeKey - The property path(s) whose value(s) are unique within a project for this entityType, usable as an identity substitute when merging data from multiple sources. An ordered composite key; `[]` when the type has no merge key.
 * @property {function(TemplateQuery): Array<OmcEntityType>} allEntityTypes - All entityTypes for this schema version
 * @property {function(TemplateQuery): GraphQlTemplate} graphQl - Templates for construction graphQl queries using queryBuiler
 * @property {function(TemplateQuery): Array<OmcEntityType>} graphQlEntities - An array of entityTypes that are available in the graphql schema for this version
 * @property {function({schemaVersion: string}=): string[]} metaKeys - The top-level envelope keys that do not identify an entity: the envelope (identifier, schemaVersion, entityType), the edge buckets (edges, Context) and the free-form extension keys (customData, annotation, tag). Excludes label/description/instanceInfo, which are data. Use it to skip non-identifying keys when treating an entity's own data as identity.
 * @property {function({schemaVersion: string}=): string[]} recordKeys - The keys that describe the record rather than the entity's data: schemaVersion and entityType. A subset of metaKeys answering a different question — identifier, edges, customData, annotation and tag all carry information, so they are not included. Use it to keep encoding drift out of a data-level comparison.
 */

import { isCapitalized } from '../mlHelpers/util.js';
import schemav21 from '../omc/validation/schema/OMC-JSON-v2.1.schema.json' with { type: 'json' };
import schemav26 from '../omc/validation/schema/OMC-JSON-v2.6.schema.json' with { type: 'json' };
import schemav28 from '../omc/validation/schema/OMC-JSON-v2.8.schema.json' with { type: 'json' };
import schemav30 from '../omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };

import { deriveForVersion, referenceShape } from './schemaDerive.js';
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

/** Versions whose entity shape is derived from the JSON Schema (see schemaDerive). Legacy
 *  versions fall back to the hand-authored template shape. */
const derivedShapeVersions = new Set([
    'https://movielabs.com/omc/json/schema/v2.8',
    'https://movielabs.com/omc/json/schema/v3.0',
]);

/**
 * Methods returning templated values based on the schema version
 * @type {OmcTemplate}
 * @memberof OmcUtil
 */
const omcTemplate = {
    edgeTable: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].edgeTable
    )),
    presentation: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion]?.entityTemplate?.[entityType]?.presentation || null
    )),
    shape: (({ schemaVersion, entityType }) => {
        if (derivedShapeVersions.has(schemaVersion) && versionSchemas[schemaVersion]) {
            const derived = deriveForVersion(schemaVersion, versionSchemas[schemaVersion]).shapes.get(entityType);
            if (!derived) return null;
            // Relationships are delivered via edgeTable(); the shape stays data-only.
            const dataShape = { ...derived };
            delete dataShape.edges;
            return dataShape;
        }
        return versionTemplates[schemaVersion]?.entityTemplate?.[entityType]?.template || null;
    }),
    versionLabel: ((schemaVersion, fallback = 'unknown') => (
        schemaVersion ? String(schemaVersion).split('/').pop() : fallback
    )),
    isRelationshipKey: (({ key }) => isCapitalized(key)),
    referenceTemplate: (({ schemaVersion }) => (
        versionSchemas[schemaVersion] ? referenceShape(versionSchemas[schemaVersion]) : null
    )),
    // Returns null rather than throwing for a schema version or entityType this build does not
    // know. Callers routinely ask about entities loaded from OTHER schema versions — data older
    // than the project it is being merged into — and a throw there takes down the render.
    schemaGroup: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion]?.entityTemplate?.[entityType]?.schemaGroup || null
    )),
    allSchemaGroups: (({ schemaVersion }) => {
        if (!versionTemplates[schemaVersion]) return {};
        const allEntities = Object.keys(versionTemplates[schemaVersion].entityTemplate).filter((e) => isCapitalized(e));
        return allEntities.reduce((acc, entityType) => {
            const group = versionTemplates[schemaVersion].entityTemplate[entityType].schemaGroup;
            // Skip entity types this version cannot describe. A few types are wired into the
            // template set without a generalConfig entry (v3.0: Depiction, Person, Organization,
            // Department, Service), so they have no group — and equally no idPrefix, mergeKey or
            // presentation. Grouping them under the key `undefined` produced a literal
            // "undefined" section in every consumer that renders these groups, offering entity
            // types nothing downstream can prefix, present or merge. An entity with no group is
            // not presentable, so it is not listed.
            if (!group) return acc;
            acc[group] = [...acc[group] || [], entityType];
            return acc;
        }, {});
    }),
    idPrefix: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].entityTemplate[entityType].idPrefix
    )),
    mergeKey: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion]?.entityTemplate?.[entityType]?.mergeKey || []
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
    /**
     * The reverse of one edge, as an edge: where the target writes its reference back.
     *
     * `inverseEdge` answers with a name from a flat predicate map, which cannot say three things it
     * needs to. An intrinsic inverse is a named property, not a predicate, so a caller building
     * `edges.<name>.<type>` from it writes to the wrong bucket. A `connects` group may override its
     * predicate's inverse, and one entry per predicate cannot hold both. And two predicate pairs
     * sharing a verb collapse into a single entry, so the last one loaded answers for both.
     *
     * This asks the edge instead. Every row already carries where its reverse lives, resolved
     * against the target's own table, so the bucket, the path and any override come with it.
     *
     * @param {Object} query
     * @param {string} query.schemaVersion
     * @param {OmcEntityType} query.entityType - The type the forward edge is on
     * @param {string} query.edge - The forward edge's storage path, or its predicate
     * @returns {{predicate: string, bucket: 'edges'|'intrinsic', path: string,
     *   pathSegments: string[], containerSegments: string[], relativePath: string}|null}
     *   Null when the edge is unknown, or carries no reverse — which is not a fault: an edge may
     *   be one-directional, and a caller must not invent a reverse for one that is.
     */
    inverseEdgeFor: (({ schemaVersion, entityType, edge }) => {
        const table = versionTemplates[schemaVersion]?.entityTemplate?.[entityType]?.edgeTable;
        if (!table) return null;
        const found = ['intrinsic', 'edges', 'cxtEdges']
            .flatMap((partition) => Object.values(table[partition] || {}))
            .find((entry) => entry.path === edge || entry.predicate === edge);
        return found?.inverseEdge ?? null;
    }),
    // The OMC envelope: the schema's `baseEntity` non-data properties
    // (identifier/schemaVersion + the free-form customData/annotation/tag), plus
    // the structural `entityType`/`edges` and the `Context` relationship bucket.
    // `label`/`description`/`instanceInfo` are deliberately excluded — they are
    // data. Schema-version-agnostic today (one shape across v2.1–v3.0); the query
    // shape is accepted for forward-compatibility. Returns a fresh array so callers
    // may mutate it freely.
    metaKeys: (() => ([
        'identifier', 'schemaVersion', 'entityType', 'edges',
        'customData', 'annotation', 'tag', 'Context',
    ])),
    // The keys that describe the record itself rather than the entity's data: which schema it
    // is written against, and which type it is. A narrower set than metaKeys, and a different
    // question — identifier, edges, customData, annotation and tag all carry information about
    // the thing described, so excluding them would be wrong here. Use it to keep encoding drift
    // out of a data-level comparison. Returns a fresh array so callers may mutate it freely.
    recordKeys: (() => (['schemaVersion', 'entityType'])),
};

export { omcTemplate };
