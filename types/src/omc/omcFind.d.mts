/**
 * Given an array of OMC entities, return those matching the filter criteria
 *
 * @function omcFind
 * @static
 * @param {OmcJson} omc - Valid OMC-JSON
 * @param {Object} filter - Filter criteria matching the shape of an OMC entity
 * @returns {Array<OmcEntity>} All entities matching the filter or []
 */
export default function omcFind(omc: OmcJson, filter: any): Array<OmcEntity>;
