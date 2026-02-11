/**
 * Receives a simplified template that describes the shape of a graphql query and returns a string representing
 * the desired graphql query.
 *
 */

import { graphQlTemplate as entityTemplate } from '../../config/index.mjs';
import { isCapitalized, isPlainObject } from '../../mlHelpers/util.mjs';

import { graphqlSnippets } from './graphQlSnippets.mjs';

// Checks if a set of keys all have null values
const allNullValues = ((propKeys, obj) => {
    for (const key in propKeys) {
        if (!Object.hasOwn(obj, key) || obj[key] === null) continue;
        if (isPlainObject(obj[key])) {
            if (allNullValues(propKeys[key], obj[key])) continue;
        }
        return false;
    }
    return true;
});

// Checks if any of the baseEntity properties have filter values set
// If not then they can be removed and a baseEntity fragment used instead
const cleanBaseEntity = ((entity) => {
    const baseEntity = entityTemplate.baseEntity.properties;
    const isAllNull = allNullValues(baseEntity, entity);

    if (!isAllNull) return { cleanBase: entity, _fragment: null }; // A baseEntity prop has been set, so use the full query;
    const cleanBase = { ...entity };
    Object.keys(baseEntity).forEach((key) => delete cleanBase[key]);
    return { cleanBase, _fragment: 'baseEntity' }; // Removed props, use a fragment
});

// Check if any of the properties have a filter value passed in and replace
const filterVariables = ((entity, vars = {}) => {
    if (!entity) return null;
    return Object.keys(entity).reduce((obj, key) => {
        const replacement = isPlainObject(entity[key])
            ? filterVariables(entity[key], vars)
            : (Object.hasOwn(vars, key) && vars[key]) ? vars[key] : null; // Replace if variable key exists and valid
        return { ...obj, [key]: replacement };
    }, {});
});

const getEntityType = ((obj, key) => {
    const entityType = typeof obj[key] === 'string' ? obj[key] : key;
    if (!entityTemplate[entityType]) {
        console.log(`Unknown entityType requested ${key}`);
        return null;
    }
    return entityType;
});

/**
 * Creates a JS object that fully expands all the properties to be used in final graphQl query
 * @ignore
 * @param {Object} query - The simplified template for the query
 * @param {Object} template
 * @param {Object} inlineFragment
 * @returns {Object<string, *>} - An object representing the full query
 */
function buildTemplate(query = {}, template = {}, inlineFragment) {
    const fragment = inlineFragment || {}; // Protect against null
    const fullTemplate = { ...template, ...(isPlainObject(query) ? query : {}) }; // Combine template and query so all keys are available

    return Object.keys(fullTemplate).reduce((obj, key) => {
        // If the key is not capitalized then this is just a regular property
        if (!isCapitalized(key)) {
            const templateKeyValue = isPlainObject(fullTemplate[key])
                ? buildTemplate(query[key], fullTemplate[key], fragment[key]) // Recurse to next level of the property value
                : query[key] || null; // Use a query filter if there is one, or set to null
            return { ...obj, [key]: templateKeyValue }; // Return the updated template
        }

        // Is there a supplemental inline fragment associated with this entity
        const _supplemental = typeof fragment[key] === 'string' ? fragment[key] : null; // Supplemental inline fragments

        // Check if the query just requires a reference
        if (!fullTemplate[key]) {
            const reference = { _fragment: 'idFields', _entityType: `${key}` };
            if (_supplemental) reference._supplemental = _supplemental;
            return { ...obj, [key]: reference }; // Return a reference
        }

        // Deal with an entity that needs to be expanded
        const entityType = getEntityType(fullTemplate, key); // Checks for valid entity
        const nextInlineFragment = (entityType && entityTemplate?.[entityType].inlineFragment)
            ? entityTemplate[entityType].inlineFragment
            : fragment[key] || null; // Use an existing matching fragment if there is one

        const nextTemplate = entityType ? entityTemplate[entityType].properties : fullTemplate[key];
        const templateKeyValue = buildTemplate(query[key], nextTemplate, nextInlineFragment);

        // If this is a defined entity then a baseEntity fragment can be used if there are no filter on the properties
        const { cleanBase, _fragment } = entityType
            ? cleanBaseEntity(templateKeyValue)
            : { cleanBase: templateKeyValue };

        // Append the supplemental information about the entity query
        if (entityType) cleanBase._entityType = entityType;
        if (_fragment) cleanBase._fragment = _fragment;
        if (_supplemental) cleanBase._supplemental = _supplemental;
        return { ...obj, [key]: cleanBase }; // Return the updated template
    }, {});
}

/**
 * @function queryBuilder
 * @memberOf module:omcGraphQl
 * @param {Object} params - Parameters used for generating the query
 * @param {OmcEntityType} params.entityType - The root entity type from which to start the query
 * @param {QueryTemplate} params.template - The template for the query
 * @param {QueryVariable} params.variables - Query variables to be included in the query as filters
 * @returns {string} A graphQl query string
 */
export default function queryBuilder({
    entityType,
    template = {},
    variables = {},
}) {
    const fragmentUsed = new Set(); // Track the fragments used in the query, they are added to the graphql query

    /**
     * Take an object that describes the shape of the query and constructs a string with the graphql query
     * @ignore
     * @param {object} queryTemplate - An object describing the query
     * @returns {string} - The graphQl query string
     */

    function qlQuery(queryTemplate) {
        const {
            _fragment = null,
            _supplemental = null,
            _entityType = null,
            ...props
        } = queryTemplate;

        fragmentUsed.add(_fragment); // Track which fragments are used so they can be pre-pended to the graphQl

        return Object.keys(props).reduce((queryStr, key) => {
            const fragmentType = queryTemplate[key]?._fragment || null;
            const fragment = fragmentType ? `${graphqlSnippets?.[fragmentType].text}\n` : '';
            let str = '';

            // graphql unions must be wrapped with an inline fragment
            if (queryTemplate[key]?._supplemental === '...on') {
                const graphql = qlQuery(queryTemplate[key]);
                const target = graphql.slice(0, graphql.indexOf('{')).trim(); // Clean up a qwirk in the processing
                const text = target === key ? graphql.replace(/.*?{([\s\S]*)}.*/, '$1') : graphql;
                str += `  ...on ${queryTemplate[key]?._entityType} {\n ${fragment}\n ${text} }\n`;
                return queryStr + str;
            }

            if (isPlainObject(queryTemplate[key])) {
                const graphql = qlQuery(queryTemplate[key]);
                if (isCapitalized(key) && !queryTemplate[key]._supplemental) {
                    str += `${key} {\n  ${fragment}  ${graphql} }\n`;
                    return queryStr + str;
                } else if (isCapitalized(key) && queryTemplate._supplemental) {
                    str += `${fragment}  ${graphql}\n`;
                    return queryStr + str;
                }
                str += `${key} {\n${graphql}}\n`;
                return queryStr + str;
            } else {
                const value = (queryTemplate[key]) ? `(${key}: ${JSON.stringify(queryTemplate[key])})` : ''; // If there is a filter include it
                str += `${key} ${value}\n`;
                return queryStr + str;
            }
        }, '');
    }

    // Build the query, combine the base entity with entity specific properties and variables for inclusion,
    // then combine this with the extended query
    const queryTemplate = entityTemplate?.[entityType].properties;
    const queryFragment = entityTemplate?.[entityType].inlineFragment;
    const queryBase = filterVariables(queryTemplate, variables);
    const mainQuery = buildTemplate({ ...queryBase, ...template }, queryTemplate, queryFragment);

    // Build the text based graphql query
    const graphql = qlQuery(mainQuery); // Create the graphQl query itself
    let graphqlQuery = '';
    fragmentUsed.forEach((key) => graphqlQuery += key ? graphqlSnippets[key].fragment : ''); // Add any fragments that were used
    graphqlQuery += graphqlSnippets.entityQuery
        .replace('_get_', `get${entityType}`) // Add the base query with the starting entity type
        .replace('_query_', graphql); // Insert the final query

    console.log(mainQuery);
    console.log(graphqlQuery);
    return graphqlQuery;
}
