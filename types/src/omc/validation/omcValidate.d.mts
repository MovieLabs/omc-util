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
 */
export type ValidationOptions = {
    /**
     */
    /**
     * - The schema version to validate against if not the native schema of the entity
     */
};
