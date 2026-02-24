/**
 * - Templates only need to enumerate the entityType that is to be queried, all the properties for the entity are added automatically
 * - Will correctly handle union types in graphql by including the inline fragments needed.
 * - Any individual property in an entity can be overwritten by including an alternative in the template
 * - The template can indicate whether the full entity should be returned, or just the reference
 * - The template can include variables for properties that allow them in the graphql schema
 * - Custom variables can be passed into the top level entity as query filters
 */
export type QueryTemplate = any;
import { stripGraphQl } from './queryUtil.mjs';
import { entityQueries } from './queryUtil.mjs';
import { queryVariables } from './queryUtil.mjs';
import queryBuilder from './queryBuilder.mjs';
export { stripGraphQl, entityQueries, queryVariables, queryBuilder };
