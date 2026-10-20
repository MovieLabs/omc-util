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
 * The identifiers that carry a URL resolving them, typically a link to the entity in the system its
 * scope names. The URL is returned as written; whether it is safe to follow is the caller's to
 * decide.
 *
 * @function idUrls
 * @static
 * @param {OmcEntity | OmcIdentifier | Array<OmcIdentifier>} identifier - An entity, or its identifiers
 * @returns {Array<{identifierScope: string, identifierValue: string, url: string}>} One entry per
 *   identifier with a non-blank `url`, in the entity's order; empty when there are none
 *
 * @example
 * idUrls({
 *     identifier: [
 *         { identifierScope: 'labkoat.com', identifierValue: 'chr-bSvGGMtq55TRL8j' },
 *         { identifierScope: 'imdb.com', identifierValue: 'ch0000001', url: 'https://www.imdb.com/character/ch0000001/' },
 *     ],
 * })
 * // returns [{ identifierScope: 'imdb.com', identifierValue: 'ch0000001', url: 'https://www.imdb.com/character/ch0000001/' }]
 */
export function idUrls(identifier: OmcEntity | OmcIdentifier | Array<OmcIdentifier>): Array<{
    identifierScope: string;
    identifierValue: string;
    url: string;
}>;
/**
 * Mint an OMC identifier. The one minter: what varies is where the value comes from.
 *
 * - **No `value`**: a random value.
 * - **`value`, `hash` true (the default)**: the value hashed (cyrb53, base-36), so the same value
 *   always yields the same identifier. Re-imports update rather than duplicate, and an edge can
 *   point at an entity a later pass builds.
 * - **`value`, `hash` false**: the value used as given, so it can be read back off the identifier
 *   (a content hash, a source system's own id).
 *
 * The entityType's prefix is added after the value whenever `entityType` is given, and never
 * otherwise. Every entity type has its own prefix, so two types minted from one value stay
 * distinct without the type being hashed in.
 *
 * @function idMint
 * @static
 * @param {Object} params
 * @param {string} params.identifierScope - The scope of the identifier
 * @param {string} [params.value] - What the identifier is minted from; random when absent
 * @param {boolean} [params.hash=true] - Hash `value` rather than use it as given
 * @param {string | null} [params.entityType] - Adds this type's prefix
 * @param {string} [params.schemaVersion] - Schema version for the prefix lookup
 * @returns {OmcIdentifier}
 *
 * @example
 * idMint({ identifierScope: 'movielabs.com', value: 'wwdoat|1-1', entityType: 'ProductionScene' })
 * // returns { identifierScope: 'movielabs.com', identifierValue: 'pscn-<stable hash>' }
 *
 * idMint({ identifierScope: 'movielabs.com', value: '9e107d9d372bb6826bd81d3542a419d6', hash: false, entityType: 'Asset' })
 * // returns { identifierScope: 'movielabs.com', identifierValue: 'ast-9e107d9d372bb6826bd81d3542a419d6' }
 */
export function idMint({ identifierScope, value, hash, entityType, schemaVersion, }: {
    identifierScope: string;
    value?: string;
    hash?: boolean;
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