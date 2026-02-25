/**
 * Validate OMC JSON against the schema
 *
 * @module omcValidate
 */

/**
 * @typedef {Object} ValidationOptions
 * @property {boolean} atomic - When true, all entities in the OmcJson must pass validation, or the result will be false
 * @property {string | null} schemaVersion - The schema version to validate against if not the native schema of the entity
 */

/**
 * @typeDef {Object} ValidationResult
 * @property {boolean} valid - Whether this entity passed validation or not
 * @property {Object | null} error - The error report from the validator or null if no error
 * @property {OmcEntity} omcEntity - The entity that was being validated
 */

import Ajv2019 from 'ajv/dist/2019.js';

import schemav21 from './schema/OMC-JSON-v2.1.schema.json' with { type: 'json' };
import schemav26 from './schema/OMC-JSON-v2.6.schema.json' with { type: 'json' };
import schemav28 from './schema/OMC-JSON-v2.8.schema.json' with { type: 'json' };
import schemav30 from './schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };

const schemaValidators = {
    'https://movielabs.com/omc/json/schema/v2.0': schemav21, // 2.1 is bug fix for 2.0
    'https://movielabs.com/omc/json/schema/v2.1': schemav21,
    'https://movielabs.com/omc/json/schema/v2.6': schemav26,
    'https://movielabs.com/omc/json/schema/v2.8': schemav28,
    'https://movielabs.com/omc/json/schema/v3.0': schemav30,
};

const schemaValidator = Object.keys(schemaValidators)
    .reduce((obj, versionName) => {
        const ajv = new Ajv2019({ allowUnionTypes: true, strict: 'log' })
            .addKeyword('$anchor')
            .addKeyword('controlledValues') // Annotation for controlled values
            .compile(schemaValidators[versionName]);
        return {
            ...obj,
            [versionName]: ajv,
        };
    }, {});

// Check all the entities in an OMC array are valid, or return false
function atomicResult(results) {
    const validationResults = Array.isArray(results)
        ? results.map((res) => res.valid)
        : Object.values(results).flat().map((res) => res.valid);
    return validationResults.every((b) => b);
}

function checkSingleEntity(entity, options) {
    const { schemaVersion } = options; // Has a specific schema version been specified?
    const testSchemaVersion = schemaVersion || entity.schemaVersion;

    // Ensure the schema version is supported
    if (!Object.hasOwn(schemaValidator, testSchemaVersion)) {
        return {
            valid: false,
            error: `Invalid schema version: ${testSchemaVersion}`,
            omcEntity: entity,
        };
    }

    // Validate the entity against the schema
    const valid = schemaValidator[testSchemaVersion](entity); // This entity has a valid schema version

    return {
        valid,
        error: valid ? null : schemaValidator[testSchemaVersion].errors,
        omcEntity: entity,
    };
}

/**
 * Given an array of OMC entities, validate each one against the schema
 * @ignore
 * @param {OmcJson} omc - A single OMC entity
 * @param {ValidationOptions} options - Additional options
 */
function checkOmcArray(omc, options) {
    const { schemaVersion } = options; // Has a specific schema version been specified?

    return omc.map((entity) => {
        const testSchemaVersion = schemaVersion || entity.schemaVersion;
        // Ensure the schema version is supported
        if (!Object.hasOwn(schemaValidator, testSchemaVersion)) {
            return {
                valid: false,
                error: `Invalid schema version: ${testSchemaVersion}`,
                omcEntity: entity,
            };
        }

        // Validate the entity against the schema
        const valid = schemaValidator[testSchemaVersion]([entity]); // This entity has a valid schema version

        return {
            valid,
            error: valid ? null : schemaValidator[testSchemaVersion].errors,
            omcEntity: entity,
        };
    });
}

/**
 * @ignore
 * @param {OmcJson} omc - OMC in object format
 * @param {ValidationOptions} options - Additional options
 * @returns {{}}
 */
function checkOmcObject(omc, options) {
    const keys = Object.keys(omc);

    if (keys.find((k) => k === 'schemaVersion')) {
        return checkSingleEntity(omc, options);
    }

    return keys.reduce((obj, entityType) => {
        const entityTypeResults = checkOmcArray(omc[entityType], options); // For each entity type, validate the entities
        return {
            ...obj,
            [entityType]: entityTypeResults,
        };
    }, {});
}

/**
 * Validates OmcJson against the OMC schema
 *
 * - Each entity in an array are validated separately
 * - Nested entities are validated in a single validation, mixing different schema versions in nested entities could cause validation errors
 * - Setting options.atomic to true, will evaluate all entities after validation and only respond true if all entities pass
 * - Setting options.schemaVersion to a specific schema, regardless of what the entity was encoded in, will validate against that version
 *
 * @function omcValidate
 * @static
 * @param {OmcJson} omc - Valid JSON to be validated
 * @param {ValidationOptions} options - Additional options
 * @returns { ValidationResult | boolean } - The full result, or atomic was true then a simple true/false
 */
export default function omcValidate(omc, options = {}) {
    const defaultOptions = {
        atomic: true, // The entire update must be valid or will be fail
        schemaVersion: null, // Uses the schemaVersion of from the entity
        ...options,
    };

    const testResult = Array.isArray(omc)
        ? checkOmcArray(omc, defaultOptions)
        : checkOmcObject(omc, defaultOptions);

    return defaultOptions.atomic
        ? atomicResult(testResult) // Returns a single true/false based on whether all entities pass validation
        : testResult; // Returns an array with results for each entity being checked
}
