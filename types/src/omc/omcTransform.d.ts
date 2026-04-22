/**
 * De-Duplicate a set of entities based on their shared identifiers
 *
 * @function deDuplicate
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson}
 */
export function deDuplicate(omc: OmcJson): OmcJson;
/**
 * Convert Omc-Json from an array or single instance to the OMC object(map) format
 *
 * @function toObject
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson}
 */
export function toObject(omc: OmcJson): OmcJson;
/**
 * Convert Omc-Json array from the object(map) format
 *
 * @function toArray
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson} - Omc-Json in the Array format
 */
export function toArray(omc: OmcJson): OmcJson;
/**
 * Creates flattened Omc-Json with an array of single entities
 * Nested entities in the original OmsJson are removed and replaced with references
 *
 * @function unEmbed
 * @static
 * @param {OmcJson} omc - Valid Omc-Json
 * @returns {OmcJson} - Omc-Json with all nested entities replaced with a reference and the entities at the top level of the array
 */
export function unEmbed(omc: OmcJson): OmcJson;
//# sourceMappingURL=omcTransform.d.ts.map