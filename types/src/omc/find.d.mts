/**
 * Given an array of OMC entities, return those matching the filter criteria
 *
 * @function find
 * @static
 * @param {OmcJson} omc - Valid OMC-JSON
 * @param {Object} filter - Filter criteria matching the shape of an OMC entity
 * @returns {Array<OmcEntity>} All entities matching the filter or []
 */
export default function find(omc: OmcJson, filter: any): Array<OmcEntity>;
