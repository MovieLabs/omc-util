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
 */

/**
 * Additional annotations about the entity.
 * @memberof OMC
 * @typedef {Object} OmcAnnotation
 */

/**
 * User defined tags for the entity.
 * @memberof OMC
 * @typedef {Object} OmcTag
 */

/**
 * Properties that describe information about this particular instance of an entity
 * @memberof OMC
 * @typedef {Object} OmcInstanceInfo
 */

/**
 * A single instance of an OMC entity
 * @memberof OMC
 * @typedef {object} OmcEntity
 * @property {string} schemaVersion - Describes the version of OMC-JSON schema that was used to create this instance.
 * @property {Array<OmcIdentifier>} identifier
 * @property {OmcEntityType} entityType
 * @property {string} name - A name for the entity, this is primarily for human consumption in things like user interfaces. It should not be considered a canonical name
 * @property {string} description - A brief description of the entity, primarily for human consumption
 * @property {OmcCustomData} customData
 * @property {OmcAnnotation} annotation
 * @property {OmcTag} tag
 * @property {OmcInstanceInfo} instanceInfo
 * @property {*} key - Properties specific to this instance of the entityType
 */

/**
 * A valid OMC data structure
 * @memberof OMC
 * @typedef {Array<OmcEntity>|Object<string, Array<OmcEntity>>} Omc-Json
 */

export {};
