/**
 * Utility functions for building OMC queries
 *
 */

import { graphQlTemplate as entityTemplate } from '../../config/v2-8/index.js';
import { isCapitalized, isPlainObject } from '../../mlHelpers/util.js';

// Create an entity object for the given entityType including the base entity properties
export const createEntitySchema = ((entityType) => (
    entityTemplate[entityType] ? entityTemplate[entityType].properties : {})
);

/**
 * Strip the graphQl wrapper from a graphQl response and return the OmcJson
 *
 * @function stripGraphQl
 * @memberOf module:omcGraphQl
 * @param {Object} graphQlResponse - The response from a graphQl query
 * @param {OmcJson} graphQlResponse.data - Valid OMC-JSON
 * @returns {OmcJson} The OmcJson in the graphQl query response
 */
export function stripGraphQl(graphQlResponse) {
    if (!Object.hasOwn(graphQlResponse, 'data')) {
        console.log('Problem');
    }
    const { data } = graphQlResponse;
    return Object.keys(data).flatMap((key) => data[key]);
}

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
export function queryVariables(entityType) {
    const entity = createEntitySchema(entityType);
    const variables = [];

    const traverse = ((ent) => {
        Object.keys(ent).forEach((key) => {
            if (isPlainObject(ent[key])) {
                traverse(ent[key]);
            } else if (ent[key]) {
                variables.push({ [key]: ent[key] });
            }
        });
    });
    traverse(entity);
    return variables;
}

/**
 * Returns a set of all entities for which a graphQl query can be made and for each entity the properties
 * that can be filtered using a variable in graphQl query
 *
 * @function entityQueries
 * @static
 * @memberOf module:omcGraphQl
 * @returns {Array<{entityType: string, variables: Array<queryVariables>}>} Array of entity query configurations
 */
export function entityQueries() {
    const allEntities = Object.keys(entityTemplate).filter((key) => isCapitalized(key));
    return allEntities.map((entityType) => ({
        entityType,
        variables: queryVariables(entityType),
    }));
}
