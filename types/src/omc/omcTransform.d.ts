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
/**
 * Normalize an entity so that everything absent is expressed the same way — as null.
 *
 * OMC data arrives from spreadsheets, form fields, GraphQL responses and hand-edited JSON, and each
 * of them says "nothing here" differently: `''`, `[]`, `{}`, an object of nulls, or the property
 * simply missing. Left alone those differences are indistinguishable from content — an empty string
 * merges over a real value, an empty array reads as an answer, and comparing two entities that hold
 * the same information reports a difference. One spelling for absence removes all of that.
 *
 * Applied to every entity entering {@link omcSDK}, so consumers of the store never have to ask
 * which spelling they are looking at.
 *
 * Returns a new entity; the original is never modified, and nested values are rebuilt rather than
 * shared, so a caller still holding the input keeps it intact.
 *
 * @function cleanEntity
 * @static
 * @param {OmcEntity} omcEntity - The entity to normalize
 * @returns {OmcEntity} A new entity with every absence expressed as null
 *
 * @example
 * cleanEntity({ label: 'Scene 4', name: '', creativeWorkTitle: [{ titleName: '  ' }] });
 * // { label: 'Scene 4', name: null, creativeWorkTitle: null }
 */
export function cleanEntity(omcEntity: OmcEntity): OmcEntity;
//# sourceMappingURL=omcTransform.d.ts.map