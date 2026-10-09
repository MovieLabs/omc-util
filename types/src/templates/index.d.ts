export type EntityConfiguration = {
    schemaGroup: string;
    idPrefix: string;
    /**
     * - Property path(s) unique within a project, usable as an identity substitute (see OmcTemplate.mergeKey). `[]` when the type has none.
     */
    mergeKey: string[];
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
/**
 * Where the reverse of an edge is written on its target, decomposed as a forward path is.
 */
export type InverseEdge = {
    /**
     * - The verb for an `edges.*` path, the property name for an intrinsic one
     */
    predicate: string;
    bucket: "edges" | "intrinsic";
    /**
     * - Full storage path on the target
     */
    path: string;
    pathSegments: Array<string>;
    containerSegments: Array<string>;
    relativePath: string;
    /**
     * - Cap on the slot it lands in; `undefined` means uncapped
     */
    maxItems: number | undefined;
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
     * - Where the reverse reference goes. Null where the edge
     * is one-directional.
     */
    inverseEdge: InverseEdge | null;
    /**
     * - The formal predicate for this edge, from the RDF model: the
     * published property name where the model names exactly one; otherwise the name the publication
     * states for the predicate (an intrinsic property's `omc:has…`, or a constant). **Null** where
     * neither names one — a predicate whose RDF is still tentative has no name, and none is invented.
     */
    omcPredicate: string | null;
    /**
     * - Every RDF property the model names for this row, one per
     * allowed range it covers. Empty where the model names none.
     */
    rdfProperties: string[];
};
/**
 * A built edge table: what `omc-util/edge-build` produces, what `v3-0/edgeTable.json` holds, and
 * what `omcTemplate.setEdgeTable` installs.
 */
export type EdgeTableArtifact = {
    /**
     * - Provenance: the publication's `generated` block, the schema
     * fingerprint, row counts
     */
    generated: any | null;
    /**
     * - Per-entity edge tables
     */
    table: any;
    /**
     * - The flat predicate → inverse map
     */
    inverseEdges: {
        [x: string]: string;
    };
};
/**
 * Which edge table a schema version is serving.
 */
export type EdgeTableSource = {
    /**
     * - `installed` after `setEdgeTable`, until `resetEdgeTable`
     */
    kind: "bundled" | "installed";
    /**
     * - The schema version it serves
     */
    schemaVersion: string;
    /**
     * - `'bundled'`, or the `source` named when it was installed
     */
    label: string;
    /**
     * - The artifact's `generated` block
     */
    generated: any | null;
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
 * One input field of an entity type: a single value, or a list of values, at a data path.
 */
export type FieldEntry = {
    /**
     * - Dotted path from the entity's root, with no array indices
     */
    path: string;
    /**
     * - `path` split on `.`
     */
    segments: string[];
    /**
     * - The property's own name, the last segment
     */
    label: string;
    /**
     * - Scalar type of the value: 'string', 'number', 'integer', 'boolean' or 'object'
     */
    type: string;
    /**
     * - The value is a list of values. For `purpose: 'filter'`, whether the filter takes a list
     */
    isArray: boolean;
    /**
     * - The arrays of objects the value sits inside, outermost first. Each element of one holds its own copy of the value
     */
    within: Array<{
        path: string;
        maxItems: (number | undefined);
    }>;
    /**
     * - The only values the schema accepts
     */
    enum?: string[];
    /**
     * - The schema's controlled values: preferred, but any value is accepted
     */
    suggestions?: string[];
    /**
     * - The schema's default
     */
    default?: any;
    /**
     * - Cap on a list of values (edit only)
     */
    maxItems?: number;
    /**
     * - Required by the schema within its parent
     */
    required?: boolean;
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
     * - Where this entityType may store references, per partition. Null when the schema version or entityType is unknown — a type the schema no longer declares answers null rather than throwing.
     */
    edgeTable: (arg0: TemplateQuery) => (EdgeTable | null);
    /**
     * - The entity's data shape derived from the JSON Schema (v2.8+), carrying `$type`, `$maxItems`, `$default`, `$required`, `$controlledValues` (suggested values; any value is accepted) and `$enum` (the only values accepted) inline per property; edges (see edgeTable) and instanceInfo are excluded. Falls back to the hand-authored template for legacy versions; null when the entityType is unknown.
     */
    shape: (arg0: TemplateQuery) => (object | null);
    /**
     *   The entity's input fields as a flat list, read from its shape. `purpose: 'edit'` (the default)
     *   lists every data value, leaving out relationships, entityType and schemaVersion.
     *   `purpose: 'filter'` lists only the paths its graphQl query accepts a filter on, with `isArray`
     *   saying whether the filter takes a list. Empty for an unknown schema version or entityType.
     */
    fields: (arg0: {
        schemaVersion: string;
        entityType: OmcEntityType;
        purpose: ("edit" | "filter");
    }) => Array<FieldEntry>;
    /**
     * - The schema versions this library serves templates for, oldest first.
     */
    versions: () => string[];
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
     *   Where the reverse of one edge is written, resolved for the entityType asked about. Use this
     *   rather than `inverseEdge`.
     */
    inverseEdgeFor: (arg0: {
        schemaVersion: string;
        entityType: OmcEntityType;
        edge: string;
    }) => (InverseEdge | null);
    /**
     * - Returns all entities in schema by their group
     */
    allSchemaGroups: (arg0: TemplateQuery) => SchemaGroups;
    /**
     * - Returns a standard prefix for an entityType that can be used for identifierValue.
     */
    idPrefix: (arg0: TemplateQuery) => string;
    /**
     * - The property path(s) whose value(s) are unique within a project for this entityType, usable as an identity substitute when merging data from multiple sources. An ordered composite key; `[]` when the type has no merge key.
     */
    mergeKey: (arg0: TemplateQuery) => string[];
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
    /**
     * - The top-level envelope keys that do not identify an entity: the envelope (identifier, schemaVersion, entityType), the edge buckets (edges, Context) and the free-form extension keys (customData, annotation, tag). Excludes label/description/instanceInfo, which are data. Use it to skip non-identifying keys when treating an entity's own data as identity.
     */
    metaKeys: (arg0: {
        schemaVersion: string;
    } | undefined) => string[];
    /**
     *   Serve a different edge table for a schema version, until `resetEdgeTable` or the process ends.
     *   Throws on a malformed artifact and leaves the current table in place.
     */
    setEdgeTable: (arg0: {
        schemaVersion: string;
        artifact: EdgeTableArtifact;
        source: string;
    }) => {
        rows: number;
        unregistered: string[];
    };
    /**
     * - Serve the bundled edge table again.
     */
    resetEdgeTable: (arg0: {
        schemaVersion: string;
    }) => void;
    /**
     * - Which edge
     * table a schema version is serving. Null for an unknown schema version. Without a schema version,
     * the installed table of whichever version has one, or null when all serve their bundled table.
     */
    edgeTableSource: (arg0: {
        schemaVersion: string;
    } | undefined) => (EdgeTableSource | null);
    /**
     * - Call `listener` whenever an
     * edge table is installed or reset. Returns an unsubscribe.
     */
    subscribe: (arg0: () => void) => () => void;
    /**
     * - A counter that changes whenever the served templates do.
     */
    getVersion: () => number;
    /**
     * - The keys that describe the record rather than the entity's data: schemaVersion and entityType. A subset of metaKeys answering a different question — identifier, edges, customData, annotation and tag all carry information, so they are not included. Use it to keep encoding drift out of a data-level comparison.
     */
    recordKeys: (arg0: {
        schemaVersion: string;
    } | undefined) => string[];
};
/**
 * Methods returning templated values based on the schema version
 * @type {OmcTemplate}
 * @memberof OmcUtil
 */
export const omcTemplate: OmcTemplate;
//# sourceMappingURL=index.d.ts.map