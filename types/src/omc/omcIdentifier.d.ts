/**
 * Normalizes the input based on whether an OmcEntity or just OmcIdentifier was passed in
 * returning just an array of OmcIdentifiers.
 *
 * @function idNormalize
 * @ignore
 * @static
 * @param {OmcEntity | OmcIdentifier} identifier
 * @returns {Array<OmcIdentifier>} - An array of just identifiers
 */
export function idNormalize(identifier: OmcEntity | OmcIdentifier): Array<OmcIdentifier>;
/**
 * OMC entities may have multiple identifiers, this returns the identifier of the requested scope if found
 *
 * @function idOfScope
 * @static
 * @param {Array<OmcIdentifier>} identifier - An array of OMC identifiers
 * @param {string} identifierScope - The scope of the required identifierValue
 * @returns {OmcIdentifier | null} - A single identifier if the scope is matched, null it not
 *
 * @example
 * idOfScope(
 *  [
 *     { identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt'},
 *     { identifierScope: 'labkoat.com', identifierValue: 'chr-bSvGGMtq55TRL8j'},
 *  ],
 *  'movielabs.com'
 * )
 * // returns { identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt'}
 */
export function idOfScope(identifier: Array<OmcIdentifier>, identifierScope: string): OmcIdentifier | null;
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
export function idCreate({ identifierScope, prefix, entityType, schemaVersion, }: {
    identifierScope: string;
    prefix?: string | null;
    entityType?: string | null;
}): OmcIdentifier;
/**
 * Build an OMC identifier around a value the caller already holds, applying the entityType's
 * prefix. Use this when identity is derived from something external and must stay readable in
 * the identifierValue — a content hash, a vendor's asset id, a filesystem key. Unlike
 * {@link idHash} the value is used verbatim, so it can still be read back off the identifier;
 * unlike {@link idCreate} nothing is generated.
 *
 * Two entityTypes given the same value stay distinct through their prefixes (e.g. an Asset and
 * its AssetStructure sharing one file hash become `ast-<value>` and `asts-<value>`), so a pair
 * built this way does not collide.
 *
 * @function idFromValue
 * @static
 * @param {Object} params
 * @param {string} params.identifierScope - The scope of the identifier
 * @param {string} params.value - The value used verbatim as the identifierValue body
 * @param {boolean} [params.prefix] - Use the entityType's predefined prefix on the value
 * @param {string | null} [params.entityType] - Entity type, for the prefix
 * @param {string} [params.schemaVersion] - Schema version for the prefix lookup
 * @returns {OmcIdentifier} An OMC identifier wrapping the supplied value
 * @throws {Error} When no value is supplied — minting an identifier around a missing value
 *   would silently produce a colliding, meaningless identity
 *
 * @example
 * idFromValue({
 *     identifierScope: 'movielabs.com',
 *     value: '9e107d9d372bb6826bd81d3542a419d6',
 *     entityType: 'Asset',
 *     prefix: true,
 * })
 * // returns {
 * //     identifierScope: 'movielabs.com',
 * //     identifierValue: 'ast-9e107d9d372bb6826bd81d3542a419d6'
 * // }
 */
export function idFromValue({ identifierScope, value, prefix, entityType, schemaVersion, }: {
    identifierScope: string;
    value: string;
    prefix?: boolean;
    entityType?: string | null;
    schemaVersion?: string;
}): OmcIdentifier;
/**
 * Create a stable, deterministic OMC identifier by hashing a seed value. The same seed always
 * produces the same identifierValue, so entities sharing a seed (e.g. a spreadsheet merge key)
 * de-duplicate and re-imports are idempotent. The entityType is folded into the hash so two
 * different types with the same seed stay distinct.
 *
 * @function idHash
 * @static
 * @param {Object} params
 * @param {string} params.identifierScope - The scope of the identifier
 * @param {string} params.seed - The value hashed into a stable identifierValue
 * @param {boolean} [params.prefix] - Use the entityType's predefined prefix on the value
 * @param {string | null} [params.entityType] - Entity type, for the prefix and the hash seed
 * @param {string} [params.schemaVersion] - Schema version for the prefix lookup
 * @returns {OmcIdentifier} An OMC identifier whose value is stable for the given seed
 *
 * @example
 * idHash({ identifierScope: 'movielabs.com', seed: '2a', entityType: 'ProductionScene' })
 * // returns { identifierScope: 'movielabs.com', identifierValue: 'pscn-<stable hash>' }
 */
export function idHash({ identifierScope, seed, prefix, entityType, schemaVersion, }: {
    identifierScope: string;
    seed: string;
    prefix?: boolean;
    entityType?: string | null;
    schemaVersion?: string;
}): OmcIdentifier;
/**
 * Creates a globally unique key by combining the identifierScope and identifierValue of an OMC identifier
 *
 * @function idKey
 * @static
 * @param {OmcIdentifier} identifier - An OMC identifier
 * @returns {string} A unique key
 *
 * @example
 * idKey({ identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt' })
 * // returns 'movielabs.com:chr-Yhq5EZz4zdQxgOt'
 */
export function idKey(identifier: OmcIdentifier): string;
/**
 * Returns the combinedForm of an identifier which is the conjunction of its scope and value, this should be globally unique
 *
 * @function idCombinedForm
 * @static
 * @param {OmcIdentifier} identifier - An OMC identifier
 * @param {string} separator - An optional sting to be place between the scope and identifier
 * @returns {string} A unique key representing the combined form of the identifier
 *
 * @example
 * idCombinedForm({ identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt' }, ':')
 * // returns 'movielabs.com:chr-Yhq5EZz4zdQxgOt'
 */
export function idCombinedForm(identifier: OmcIdentifier, separator?: string): string;
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
//# sourceMappingURL=omcIdentifier.d.ts.map