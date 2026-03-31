/**
 * Find entities that match a set of criteria passed in the filter
 *
 * @module omcFind
 */

/**
 * Check if a value matches a template value.
 * - Primitives: strict equality
 * - Arrays in template: at least one template element must match at least one element in the target
 * - Objects: all template keys must match recursively
 */

function isMatch(target, template, options = {}) {
    const { normalize = false } = options;
    if (template === null || template === undefined) return target === template;

    // Primitive match
    if (typeof template !== 'object') {
        if (normalize && typeof template === 'string' && typeof target === 'string') {
            return target.trim().toLowerCase() === template.trim().toLowerCase();
        }
        return target === template;
    }

    // Template is an array — at least one template element must find a match in the target array
    if (Array.isArray(template)) {
        if (!Array.isArray(target)) return false;
        return template.every((tplEl) => target.some((tgtEl) => isMatch(tgtEl, tplEl, options)));
    }

    // Template is an object — every key in the template must match
    if (typeof target !== 'object' || target === null || Array.isArray(target)) return false;
    return Object.keys(template).every((key) => isMatch(target[key], template[key], options));
}

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
function omcFind(arr, template, options = {}) {
    return arr.filter((obj) => isMatch(obj, template, options));
}

export default omcFind;
