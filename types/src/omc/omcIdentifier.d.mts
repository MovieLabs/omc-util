/**
 * Create a new OMC identifier with the requested scope and unique identifierValue with an optional prefix
 *
 * @function idCreate
 * @static
 * @param {Object} params
 * @param {string} params.identifierScope - The scope of the identifier
 * @param {string | null} [params.prefix] - Optional prefix for the identifier value
 * @param {string | null} [params.entityType] - Uses a predefined prefix for the entityType [takes priority]
 * @returns {OmcIdentifier} An OMC identifier with the specified scope and new unique value
 *
 * @example
 * idCreate({ identifierScope: 'movielabs.com', entityType: 'Character' })
 * // returns {
 * //     identifierScope: 'movielabs.com',
 * //     identifierValue': 'chr-Yhq5EZz4zdQxgOt'
 * // }
 *
 */
export function idCreate({ identifierScope, prefix, entityType }: {
    identifierScope: string;
    prefix?: string | null;
    entityType?: string | null;
}): OmcIdentifier;
/**
 * Test if an identifier from one entity already exists within a set of other entities
 *
 * @function idIsDuplicate
 * @static
 * @param {Array<OmcIdentifier>} targetId - Set of target entities against which the source entity id's will be checked for matches
 * @param {OmcIdentifier} sourceId - source entity, used to check against the target
 * @returns {boolean} Returns True when duplicate identifiers exist between the target and source identifiers
 */
export function idIsDuplicate(targetId: Array<OmcIdentifier>, sourceId: OmcIdentifier): boolean;
/**
 * Merge an identifier into an existing array of identifiers
 *
 * @function idMerge
 * @static
 * @param {Array<OmcIdentifier>} targetId
 * @param {OmcIdentifier | Array<OmcIdentifier>} mergeId
 * @returns {Array<OmcIdentifier>} The merged set of identifiers
 */
export function idMerge(targetId: Array<OmcIdentifier>, mergeId: OmcIdentifier | Array<OmcIdentifier>): Array<OmcIdentifier>;
/**
 * Remove an identifier from an existing array of identifiers
 * @function idRemove
 * @static
 * @param {Array<OmcIdentifier>} targetId The array of identifiers targeted for removal
 * @param {OmcIdentifier} removeId The identifier to be removed
 * @returns {Array<OmcIdentifier>} The set with the identifier removed
 */
export function idRemove(targetId: Array<OmcIdentifier>, removeId: OmcIdentifier): Array<OmcIdentifier>;
/**
 * Cross-check all identifiers in the targetIdentifier with those in the remove identifier
 * If any identifiers present in the targetIdentifier have a match in the removeIdentifier null is returned
 * indicating it should be removed
 *
 * @function hasMatching
 * @static
 * @param {OmcEntity | Array<OmcIdentifier>} targetIdentifier
 * @param {OmcEntity | Array<OmcIdentifier>} matchIdentifier
 * @returns {Boolean} True if there are matching identifiers
 */
export function hasMatching(targetIdentifier: OmcEntity | Array<OmcIdentifier>, matchIdentifier: OmcEntity | Array<OmcIdentifier>): boolean;
/**
 * Find an entity in a set of OMC entities by its identifier
 *
 * @function find
 * @static
 * @param {Array<OmcEntity>} omc - Set of OMC entities to search
 * @param {OmcIdentifier | Array<OmcIdentifier>} identifier - The identifier(s) to search for
 * @returns {OmcEntity|null} The matching entity or null
 */
export function find(omc: Array<OmcEntity>, identifier: OmcIdentifier | Array<OmcIdentifier>): OmcEntity | null;
export function idNormalize(identifier: any): any;
export function idOfScope(identifier: any, identifierScope: any): any;
export function idKey(identifier: any): string;
