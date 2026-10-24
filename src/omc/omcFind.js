/**
 * Find entities that match a set of criteria passed in the filter, and the parts of a model a query
 * template describes.
 *
 * `omcFind(arr, template)` compares entities one at a time. `omcFind.graph` walks a model from the
 * entities a query template's top level matches, along the links it names, keeping the entities
 * whose filters match: the same template `omcGraphQl.queryBuilder` takes, answered from memory.
 *
 * @module omcFind
 */

import { isCapitalized, isPlainObject } from '../mlHelpers/util.js';
import { omcTemplate } from '../templates/index.js';

import { slotType } from './omcGraphQl/queryUtil.js';

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

    if (Array.isArray(template)) {
        if (!Array.isArray(target)) return template.some((tplEl) => isMatch(target, tplEl, options));
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

/**
 * A query template's filters alone: its property values, with child links and unset properties left
 * out.
 *
 * @param {Object|string|null} spec - A query template body
 * @returns {Object}
 */
function filtersOf(spec) {
    if (!isPlainObject(spec)) return {};
    return Object.keys(spec).reduce((found, key) => {
        const value = spec[key];
        if (isCapitalized(key) || value === null || value === undefined) return found;
        if (!isPlainObject(value)) return { ...found, [key]: value };
        const nested = filtersOf(value);
        return Object.keys(nested).length ? { ...found, [key]: nested } : found;
    }, {});
}

/**
 * The links a query template body names on an entity: where each is stored, the type it reaches and
 * the template for that type. A link holding several types is keyed by type inside, as
 * `queryBuilder` takes it.
 *
 * @param {Object|string|null} spec
 * @param {string} owner - The entity type holding the links
 * @param {string} schemaVersion
 * @param {string[]} [at]
 * @returns {Array<{path: string[], entityType: string, spec: (Object|string|null)}>}
 */
function linksOf(spec, owner, schemaVersion, at = []) {
    if (!isPlainObject(spec)) return [];
    return Object.keys(spec).flatMap((key) => {
        const value = spec[key];
        if (!isCapitalized(key)) return isPlainObject(value) ? linksOf(value, owner, schemaVersion, [...at, key]) : [];
        const path = [...at, key];
        const entityType = (typeof value === 'string' && value)
            || slotType(owner, path, schemaVersion)
            || (omcTemplate.graphQl({ entityType: key, schemaVersion }) ? key : null);
        if (entityType) return [{ path, entityType, spec: value }];
        if (!isPlainObject(value)) return [];
        return Object.keys(value).map((type) => ({ path, entityType: type, spec: value[type] }));
    });
}

/**
 * @typedef {Object} FoundNode
 * @property {OmcEntity} entity
 * @property {Object|string|null} spec - The query template body it was reached by
 * @property {string[]} [path] - Where its parent holds the reference that reached it; absent on a
 *   top-level match
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
function findChildren({ model, entity, spec }) {
    const links = linksOf(spec, entity.entityType, entity.schemaVersion);
    if (!links.length) return null;
    return links.flatMap(({ path, entityType, spec: childSpec }) => {
        const held = path.reduce((at, key) => at?.[key], entity);
        const filters = filtersOf(childSpec);
        return [held ?? []].flat()
            .map((reference) => model.get(reference))
            .filter((child) => child?.entityType === entityType && isMatch(child, filters))
            .map((child) => ({
                entity: child,
                spec: childSpec,
                path,
                children: findChildren({ model, entity: child, spec: childSpec }) ?? [],
            }));
    });
}

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
function graph({ model, entityType, template = {} }) {
    const filters = filtersOf(template);
    return model.find({ entityType })
        .filter((entity) => isMatch(entity, filters))
        .map((entity) => ({ entity, spec: template, children: findChildren({ model, entity, spec: template }) ?? [] }));
}

omcFind.matches = isMatch;
omcFind.graph = graph;
omcFind.children = findChildren;

export default omcFind;
