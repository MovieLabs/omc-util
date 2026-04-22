/**
 * @function queryBuilder
 * @memberOf module:omcGraphQl
 * @param {Object} params - Parameters used for generating the query
 * @param {OmcEntityType} params.entityType - The root entity type from which to start the query
 * @param {QueryTemplate} params.template - The template for the query
 * @param {QueryVariable} params.variables - Query variables to be included in the query as filters
 * @returns {string} A graphQl query string
 */
export default function queryBuilder({ entityType, template, variables, }: {
    entityType: OmcEntityType;
    template: QueryTemplate;
    variables: QueryVariable;
}): string;
//# sourceMappingURL=queryBuilder.d.ts.map