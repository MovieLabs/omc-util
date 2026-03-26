/**
 * Validates OmcJson against the OMC schema
 *
 * @function omcValidate
 * @static
 * @param {OmcJson} omc - Valid JSON to be validated
 * @param {ValidationOptions} options - Additional options
 * @returns { boolean } - True if valid OmcJson, false if not
 */
export default function omcValidate(omc: OmcJson, options?: ValidationOptions): boolean;
export type ValidationOptions = {
    /**
     * - The entire update must be valid, or it will be fail
     */
    atomic: boolean;
    /**
     * - The schema version to validate against
     */
    schemaVersion: string;
    /**
     * - The type of response to return if there is an error
     */
    errorResponse: string;
};
