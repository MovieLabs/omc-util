/**
 * An identifier uniquely identifies an entity within a particular scope.
 */
export type OmcIdentifier = {
    /**
     * - The scope of the identifier
     */
    identifierScope: string;
    /**
     * - The value of the identifier
     */
    identifierValue: string;
    /**
     * - The conjunction of identifierScope & identifierValue, which should be globally unique
     */
    combinedForm?: string;
    /**
     * - A URL for the identifier
     */
    url?: string;
};
/**
 * - A valid entity type
 */
export type OmcEntityType = string;
/**
 * A user defined set of custom data in the payload of the instance, used where the formal schema lacks required properties.
 */
export type OmcCustomData = {
    /**
     * - Indicates the set or system in which the custom data is relevant or defined.
     */
    domain: string | null;
    /**
     * - The namespace used by the custom data.
     */
    namespace: string | null;
    /**
     * - URL for the schema used by the custom data.
     */
    schema: string | null;
    /**
     * - The user defined custom data.
     */
    value: any | null;
};
/**
 * Human readable commentary, explanation, or information.
 */
export type OmcAnnotation = {
    /**
     * - Who wrote or added this annotation
     */
    author: string | null;
    /**
     * - A title for the note or annotation.
     */
    title: string | null;
    /**
     * - The text of the note or annotation.
     */
    text: string | null;
};
/**
 * A short string from a particular set, used for categorization and description.
 */
export type OmcTag = {
    /**
     * - An indication of the set or system in which the tag values are relevant or defined.
     */
    domain: string | null;
    /**
     * - A set of tags taken from the domain.
     */
    value: Array<string> | null;
};
/**
 * Properties that describe information about this particular instance of an entity
 */
export type OmcInstanceInfo = any;
/**
 * A single instance of an OMC entity
 */
export type OmcEntity = {
    /**
     * - Describes the version of OMC-JSON schema that was used to create this instance.
     */
    schemaVersion?: string;
    identifier?: Array<OmcIdentifier>;
    entityType?: OmcEntityType;
    /**
     * - A name for the entity, this is primarily for human consumption in things like user interfaces. It should not be considered a canonical name
     */
    name: string | null;
    /**
     * - A brief description of the entity, primarily for human consumption
     */
    description: string | null;
    /**
     * - A array of OmcCustomData
     */
    customData: Array<OmcCustomData> | null;
    /**
     * - An array of OmcAnnotation
     */
    annotation: Array<OmcAnnotation> | null;
    tag: Array<OmcTag> | null;
    instanceInfo: OmcInstanceInfo | null;
    /**
     * - Properties specific to this instance of the entityType
     */
    key: any;
};
/**
 * A valid OMC data structure
 */
export type OmcJson = Array<OmcEntity> | {
    [x: string]: Array<OmcEntity> | OmcEntity;
};
/**
 * An in-memory store of OMC entities with methods for managing them
 */
export type OmcStore = {
    /**
     * - Return the internal cache identifier for an entity
     */
    internalId: Function;
    /**
     * - Get an entity by its internal cache identifier
     */
    getInternalId: Function;
    /**
     * - Retrieve an entity from the cache by its OMC identifier
     */
    get: Function;
    /**
     * - Add entities to the cache
     */
    set: Function;
    /**
     * - Remove an entity from the cache
     */
    remove: Function;
    /**
     * - Remove an entity and clean up edges referencing it
     */
    removeWithEdges: Function;
    /**
     * - Replace entities in the cache
     */
    replace: Function;
    /**
     * - Clear the cache and return the store
     */
    reset: Function;
    /**
     * - Export all cached entities as an array
     */
    exportModel: Function;
    /**
     * - Find entities in the cache matching a filter
     */
    find: Function;
    /**
     * - Get intrinsic properties for an entity
     */
    intrinsicProps: Function;
    /**
     * - Get context edges for an entity
     */
    contextEdges: Function;
    /**
     * - Identifier utilities
     */
    identifier: any;
};
//# sourceMappingURL=types.d.ts.map