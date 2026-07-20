export type EntityConfiguration = {
    schemaGroup: string;
    idPrefix: string;
    presentation: any;
    template: EntityTemplate;
    graphQl: GraphQlTemplate;
};
export type EntityTemplate = {
    /**
     * - The properties of the entity
     */
    property: {
        [x: string]: PropertyTemplate;
    };
};
export type PropertyTemplate = {
    /**
     * - The type for this property (JSON-Schema syntax)
     */
    type: string;
    /**
     * - Set for properties that act as merge keys.
     */
    mergeKey: boolean;
};
export type EdgeTemplate = {
    /**
     * - How the reference is STORED on the source entity ('array' | 'object').
     * This is a storage shape, NOT a cardinality cap — in v3.0 every edge is stored as an array.
     * Use `maxItems` to ask "at most one?".
     */
    type: string;
    /**
     * - Cardinality cap from the JSON Schema; `undefined` means
     * uncapped. Derived at build time (see schemaFacts.js) so it cannot drift from the schema.
     */
    maxItems: number | undefined;
    /**
     * - The entity types allowed for this edge
     */
    allowed: Array<string>;
    /**
     * - The path on this entity (source) that the edge is stored
     */
    path: string;
    /**
     * - The predicate (RDF property family) this edge belongs to
     */
    predicate: string;
    /**
     * - Which partition the edge is stored in
     */
    bucket: "edges" | "intrinsic";
    /**
     * - `path` pre-split, so consumers never split it themselves
     */
    pathSegments: Array<string>;
    /**
     * - The object path that must exist before the reference
     * can be written: `pathSegments` minus its final segment (the range type for `edges.*` paths, or
     * the property name for an intrinsic one). `[]` for a top-level intrinsic property.
     */
    containerSegments: Array<string>;
    /**
     * - `path` minus the bucket prefix (e.g. `hasCxt.Context`);
     * equal to `path` for intrinsic edges
     */
    relativePath: string;
    /**
     * - The path on the target entity that carries the inverse edge
     */
    inverse: string;
    /**
     * - The formal predicate for this edge, from RDF model
     */
    omcPredicate: string;
};
export type GraphQlTemplate = {
    /**
     * - The properties that can be queried
     */
    properties: any;
    /**
     * - Properties that accept a graphQl filter
     */
    filter: any | null;
    /**
     * - Supplemental inline fragments needed on properties
     */
    inlineFragment: any | null;
};
/**
 * Parameters passed in to request template details
 */
export type TemplateQuery = {
    /**
     * - The schema version key (e.g., "v1.0.0")
     */
    schemaVersion: string;
    /**
     * - The entity type key (e.g., "Asset", "Person")
     */
    entityType: string;
};
/**
 * The details for all edges on a given entityType
 */
export type EdgeTable = {
    /**
     * - Descriptions of the regular edges
     */
    edges: any;
    /**
     * - Descriptions of the intrinsic edges
     */
    intrinsic: any;
    /**
     * - Descriptions of the edges allowed in related Context
     */
    cxtEdges: any;
};
/**
 * Properties to be used when rendering the header section for an entity
 */
export type PresentationHeader = {
    /**
     * - Background color for header when rendering the entity as node or in a UI
     */
    backgroudColor: string;
    /**
     * - Font color for header when rendering the entity as node or in a UI
     */
    fontColor: string;
    /**
     * - A label for the entityType
     */
    entityLabel: string;
    /**
     * - A suffix for use with the label, generally it's type (subclass)
     */
    entityLabelSuffix: () => string;
};
/**
 * Provides a set of suggested properties to display when rendering a node
 * Either the string indicating the property key, or a function that will return a string
 */
export type PresentationProps = Array<string, Function>;
/**
 * A set of consistent values and methods useful when presenting an entity in a UI
 */
export type Presentation = {
    header: PresentationHeader;
    propRows: PresentationProps;
};
/**
 * - Schema groups with all the entities that belong in that group
 */
export type SchemaGroups = {
    [x: string]: string[];
};
export type OmcTemplate = {
    /**
     * - Returns the edge table definition for the given schema version and entity type.
     */
    edgeTable: (arg0: TemplateQuery) => EdgeTable;
    /**
     * - Returns the stripped typed shape ($type per property) for an entityType. Describes the entity's shape as defined by the schema; used to construct new entities and to build mapping targets.
     */
    template: (arg0: TemplateQuery) => EntityTemplate;
    /**
     * - The entity's data shape derived from the JSON Schema (v3.0+), carrying `$type`, `$maxItems`, `$default`, `$required` and `$controlledValues` inline per property; edges (see edgeTable) and instanceInfo are excluded. Falls back to the hand-authored template for legacy versions; null when the entityType is unknown.
     */
    shape: (arg0: TemplateQuery) => (object | null);
    /**
     * - Returns the presentation details for an entityType, or null if the schema version or entityType is unknown.
     */
    presentation: (arg0: TemplateQuery) => Presentation | null;
    /**
     * - The human-readable label for a schema version URL, e.g. 'v3.0'. Second argument is the fallback returned when there is no version (default 'unknown').
     */
    versionLabel: (arg0: string, arg1: string | undefined) => string;
    /**
     * - True when `key` names an entity reference (a relationship) rather than a data property.
     */
    isRelationshipKey: (arg0: {
        key: string;
    }) => boolean;
    /**
     * - The shape template of an entity reference (its identifier array), or null if the schema version is unknown. Required fields (identifierScope, identifierValue) are marked `$required`.
     */
    referenceTemplate: (arg0: {
        schemaVersion: string;
    }) => (object | null);
    /**
     * - Returns a group name for which the entityType belongs.
     */
    schemaGroup: (arg0: TemplateQuery) => string;
    /**
     * - Returns all entities in schema by their group
     */
    allSchemaGroups: (arg0: TemplateQuery) => SchemaGroups;
    /**
     * - Returns a standard prefix for an entityType that can be used for identifierValue.
     */
    idPrefix: (arg0: TemplateQuery) => string;
    /**
     * - All entityTypes for this schema version
     */
    allEntityTypes: (arg0: TemplateQuery) => Array<OmcEntityType>;
    /**
     * - Templates for construction graphQl queries using queryBuiler
     */
    graphQl: (arg0: TemplateQuery) => GraphQlTemplate;
    /**
     * - An array of entityTypes that are available in the graphql schema for this version
     */
    graphQlEntities: (arg0: TemplateQuery) => Array<OmcEntityType>;
};
/**
 * Methods returning templated values based on the schema version
 * @type {OmcTemplate}
 * @memberof namespace:OmcUtil
 */
export const omcTemplate: OmcTemplate;
//# sourceMappingURL=index.d.ts.map