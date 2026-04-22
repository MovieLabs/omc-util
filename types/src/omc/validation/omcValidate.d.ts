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
 * @overload
 * @param {OmcJson} omc - Valid JSON to be validated
 * @param {ValidationOptions & { atomic: false }} options
 * @returns {ValidationResult[]}
 */
export default function omcValidate(omc: OmcJson, options: ValidationOptions & {
    atomic: false;
}): ValidationResult[];
/**
 * @overload
 * @param {OmcJson} omc - Valid JSON to be validated
 * @param {ValidationOptions} [options]
 * @returns {boolean}
 */
export default function omcValidate(omc: OmcJson, options?: ValidationOptions): boolean;
export type ValidationOptions = {
    /**
     * - When true, all entities must pass or result is false
     */
    atomic?: boolean;
    /**
     * - The schema version to validate against if not the native schema of the entity
     */
    schemaVersion?: string | null;
};
export type ValidationResult = {
    /**
     * - Whether this entity passed validation or not
     */
    valid: boolean;
    /**
     * - The error report from the validator or null if no error
     */
    error: any | null;
    /**
     * - The entity that was being validated
     */
    omcEntity: OmcEntity;
};
//# sourceMappingURL=omcValidate.d.ts.map