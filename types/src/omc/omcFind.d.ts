export default omcFind;
export type FoundNode = {
    entity: OmcEntity;
    /**
     * - The query template body it was reached by
     */
    spec: any | string | null;
    /**
     * - The entities its links reach and whose filters match
     */
    children: Array<FoundNode>;
};
/**
 * Find all objects in an array that match a template.
 * Only fields present in the template are compared.
 *
 * @function
 * @param {Array<OmcEntity>} arr - Array of JSON objects to search
 * @param {Object} template - Template object defining the match criteria
 * @param {Object} [options] - Options
 * @param {boolean} [options.normalize=false] - Trim whitespace and compare strings case-insensitively
 * @returns {Array<OmcEntity>} - All matching objects
 *
 * @example
 * // Find all NarrativeScene entities
 * omcFind(data, { entityType: 'NarrativeScene' });
 *
 * @example
 * // Find characters named "Phoebe"
 * omcFind(data, { entityType: 'Character', characterName: { fullName: 'Phoebe' } });
 *
 * @example
 * // Find entities with a specific identifier
 * omcFind(data, { identifier: [{ identifierScope: 'movielabs.com' }] });
 */
declare function omcFind(arr: Array<OmcEntity>, template: any, options?: {
    normalize?: boolean;
}): Array<OmcEntity>;
declare namespace omcFind {
    export { isMatch as matches };
    export { graph };
    export { findChildren as children };
}
/**
 * Check if a value matches a template value.
 * - Primitives: strict equality
 * - An array in the template against an array in the target: every template element matches an
 *   element of the target
 * - An array in the template against a single value: the value matches one of the template's elements
 * - Objects: all template keys must match recursively
 *
 * @function matches
 * @memberof module:omcFind
 * @param {*} target - An entity, or a value within one
 * @param {*} template
 * @param {Object} [options]
 * @param {boolean} [options.normalize=false] - Trim whitespace and compare strings case-insensitively
 * @returns {boolean}
 */
declare function isMatch(target: any, template: any, options?: {
    normalize?: boolean;
}): boolean;
/**
 * The part of a model a query template describes: the entities of its top-level type whose filters
 * match, and down each link it names, the entities reached whose filters match. Filters compare as
 * fMam's do: a value must equal the filter, or one of the filter's values.
 *
 * @function graph
 * @memberof module:omcFind
 * @param {Object} params
 * @param {Object} params.model - An omcSDK store
 * @param {string} params.entityType - The top-level entity type
 * @param {Object} [params.template] - The query template body, as `omcGraphQl.queryBuilder` takes it
 * @returns {Array<FoundNode>} One per top-level match
 */
declare function graph({ model, entityType, template }: {
    model: any;
    entityType: string;
    template?: any;
}): Array<FoundNode>;
/**
 * @typedef {Object} FoundNode
 * @property {OmcEntity} entity
 * @property {Object|string|null} spec - The query template body it was reached by
 * @property {Array<FoundNode>} children - The entities its links reach and whose filters match
 */
/**
 * What an entity's links in a query template reach in a model, each with its own children.
 *
 * @param {Object} params
 * @param {Object} params.model - An omcSDK store
 * @param {OmcEntity} params.entity
 * @param {Object|string|null} params.spec - The query template body the entity was reached by
 * @returns {Array<FoundNode>|null} Null when the template names no links here: the query ends at
 *   this entity
 */
declare function findChildren({ model, entity, spec }: {
    model: any;
    entity: OmcEntity;
    spec: any | string | null;
}): Array<FoundNode> | null;
//# sourceMappingURL=omcFind.d.ts.map