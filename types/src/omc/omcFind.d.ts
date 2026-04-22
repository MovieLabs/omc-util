export default omcFind;
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
//# sourceMappingURL=omcFind.d.ts.map