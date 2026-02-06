/**
 * Utility functions for building OMC queries
 */

import { graphQlTemplate as entityTemplate } from '../../entityTemplates/v2-8/index.mjs';
import { isCapitalized, isPlainObject } from '../../helpers/util.mjs';

// Create an entity object for the given entityType including the base entity properties
export const createEntitySchema = ((entityType) => (
    entityTemplate[entityType] ? entityTemplate[entityType].properties : {})
);

/**
 * Strip the graphQl wrapper from a graphQl response and return the OMC-JSON
 *
 * @function stripGraphQl
 * @memberOf module:omcQueryBuilder
 * @param {Object} graphQlResponse
 * @param {Omc-Json} graphQlResponse.data - Valid OMC-JSON
 * @return {Omc-Json}
 */

export function stripGraphQl(graphQlResponse) {
    if (!Object.hasOwn(graphQlResponse, 'data')) {
        console.log('Problem');
    }
    const { data } = graphQlResponse;
    return Object.keys(data).flatMap((key) => data[key]);
}

/**
 * For given entityType returns the set of properties that can be filtered using a variable
 *
 * @function queryVariables
 * @memberOf module:omcQueryBuilder
 * @param {OmcEntityType} entityType
 * @returns {Array<QueryVariable>} Array of objects with property names as keys and their types as values
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
 * Returns a set of all entities for which a graphQl query can be made, and for each entity the properties
 * that can accept a variable as a filter
 *
 * @function entityQueries
 * @memberOf module:omcQueryBuilder
 * @returns {Array<EntityQuery>} Array of entity query configurations
 */

export function entityQueries() {
    const allEntities = Object.keys(entityTemplate).filter((key) => isCapitalized(key));
    return allEntities.map((entityType) => ({
        entityType,
        variables: queryVariables(entityType),
    }));
}
