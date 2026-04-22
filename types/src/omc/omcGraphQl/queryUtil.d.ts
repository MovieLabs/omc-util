/**
 * Strip the graphQl wrapper from a graphQl response and return the OmcJson
 *
 * @function stripGraphQl
 * @memberOf module:omcGraphQl
 * @param {Object} graphQlResponse - The response from a graphQl query
 * @param {OmcJson} graphQlResponse.data - Valid OMC-JSON
 * @returns {OmcJson} The OmcJson in the graphQl query response
 */
export function stripGraphQl(graphQlResponse: {
    data: OmcJson;
}): OmcJson;
/**
 * For a given entityType returns the set of properties that can be filtered using a variable in graphQl query
 * The keys are the property name with the primitive type as the value
 *
 * @function queryVariables
 * @static
 * @memberOf module:omcGraphQl
 * @param {OmcEntityType} entityType
 * @returns {Array<Object.<string, string>>} Array of objects with property names as keys and their types as values
 *
 * @example
 * queryVariables('Depiction');
 * // returns [
 * //    { "identifierScope": "string" },
 * //    { "identifierValue": "string" },
 * //    { "name": "string" },
 * //    { "depictionType": "string" }
 * // ]
 */
export function queryVariables(entityType: OmcEntityType): Array<{
    [x: string]: string;
}>;
/**
 * Returns a set of all entities for which a graphQl query can be made and for each entity the properties
 * that can be filtered using a variable in graphQl query
 *
 * @function entityQueries
 * @static
 * @memberOf module:omcGraphQl
 * @returns {Array<{entityType: string, variables: Array<queryVariables>}>} Array of entity query configurations
 */
export function entityQueries(): Array<{
    entityType: string;
    variables: Array<typeof queryVariables>;
}>;
export function createEntitySchema(entityType: any): any;
//# sourceMappingURL=queryUtil.d.ts.map