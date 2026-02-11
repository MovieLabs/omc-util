/**
* OMC Query Builder
*
* Utilities for building and executing GraphQL queries for OMC entities.
*
* @module omcGraphQl
*/

/**
 * - Templates only need to enumerate the entityType that is to be queried, all the properties for the entity are added automatically
 * - Will correctly handle union types in graphql by including the inline fragments needed.
 * - Any individual property in an entity can be overwritten by including an alternative in the template
 * - The template can indicate whether the full entity should be returned, or just the reference
 * - The template can include variables for properties that allow them in the graphql schema
 * - Custom variables can be passed into the top level entity as query filters
 *
 * @typedef {Object} QueryTemplate
 */
import queryBuilder from './queryBuilder.mjs';
import { entityQueries, queryVariables, stripGraphQl } from './queryUtil.mjs';

export {
    stripGraphQl,
    entityQueries,
    queryVariables,
    queryBuilder,
};
