/**
 * Type definitions for the Ontology for Media Creation
 * @namespace OMC
 */

/**
 * An identifier uniquely identifies an entity within a particular scope.
 * @memberof OMC
 * @typedef {Object} OmcIdentifier
 * @property {string} identifierScope - The scope of the identifier
 * @property {string} identifierValue - The value of the identifier
 * @property {string} [combinedForm] - The conjunction of identifierScope & identifierValue, which should be globally unique
 * @property {string} [url] - A URL for the identifier
 */

/**
 * Declaration of what type of OMC entity this instance represents.
 * @memberof OMC
 * @typedef {string} OmcEntityType - A valid entity type
 */

/**
 * A user defined set of custom data in the payload of the instance, used where the formal schema lacks required properties.
 * @memberof OMC
 * @typedef {Object} OmcCustomData
 * @property {string | null} domain - Indicates the set or system in which the custom data is relevant or defined.
 * @property {string | null} namespace - The namespace used by the custom data.
 * @property {string | null} schema - URL for the schema used by the custom data.
 * @property {* | null} value - The user defined custom data.
 */

/**
 * Human readable commentary, explanation, or information.
 * @memberof OMC
 * @typedef {Object} OmcAnnotation
 * @property {string | null} author - Who wrote or added this annotation
 * @property {string | null} title - A title for the note or annotation.
 * @property {string | null} text - The text of the note or annotation.
 */

/**
 * A short string from a particular set, used for categorization and description.
 * @memberof OMC
 * @typedef {Object} OmcTag
 * @property {string | null} domain - An indication of the set or system in which the tag values are relevant or defined.
 * @property {Array<string> | null} value - A set of tags taken from the domain.
 */

/**
 * Properties that describe information about this particular instance of an entity
 * @memberof OMC
 * @typedef {Object} OmcInstanceInfo
 */

/**
 * A single instance of an OMC entity
 * @memberof OMC
 * @typedef {Object} OmcEntity
 * @property {string} [schemaVersion] - Describes the version of OMC-JSON schema that was used to create this instance.
 * @property {Array<OmcIdentifier>} [identifier]
 * @property {OmcEntityType} [entityType]
 * @property {string | null} name - A name for the entity, this is primarily for human consumption in things like user interfaces. It should not be considered a canonical name
 * @property {string | null} description - A brief description of the entity, primarily for human consumption
 * @property {Array<OmcCustomData> | null} customData - A array of OmcCustomData
 * @property {Array<OmcAnnotation> | null} annotation - An array of OmcAnnotation
 * @property {Array<OmcTag> | null} tag
 * @property {OmcInstanceInfo | null} instanceInfo
 * @property {*} key - Properties specific to this instance of the entityType
 */

/**
 * A valid OMC data structure
 * @memberof OMC
 * @typedef {Array<OmcEntity> | Object<string, Array<OmcEntity> | OmcEntity>} OmcJson
 */

/**
 * An in-memory store of OMC entities with methods for managing them
 * @memberof OMC
 * @typedef {Object} OmcStore
 * @property {Function} internalId - Return the internal cache identifier for an entity
 * @property {Function} getInternalId - Get an entity by its internal cache identifier
 * @property {Function} get - Retrieve an entity from the cache by its OMC identifier
 * @property {Function} set - Add entities to the cache
 * @property {Function} remove - Remove an entity from the cache
 * @property {Function} removeWithEdges - Remove an entity and clean up edges referencing it
 * @property {Function} replace - Replace entities in the cache
 * @property {Function} reset - Clear the cache and return the store
 * @property {Function} exportModel - Export all cached entities as an array
 * @property {Function} find - Find entities in the cache matching a filter
 * @property {Function} intrinsicProps - Get intrinsic properties for an entity
 * @property {Function} contextEdges - Get context edges for an entity
 * @property {Object} identifier - Identifier utilities
 */

export {};
