/**
 * @memberof module:omcMerge
 * @function mergeNonDestructive
 * @static
 * @param obj1
 * @param obj2
 * @returns {*}
 */
export function mergeNonDestructive(obj1: any, obj2: any): any;
/**
 * Takes in two sets of identifiers and merges them into a single set in a non-destructive manner
 *
 * - The two sets of array can be unordered both in the entities they refer to and for the
 * list of identifiers that are used within each Omc Identifier
 *
 * - The two sets are paired up based on having the same scope/value pair, where one set contains
 * fewer OMC identifiers the result will contain all unique scope/value pairings for a given entity
 *
 * - When merging identifiers, properties are preserved if they are missing or null in the other identifier,
 * i.e. the url property will survive even when missing on one of the pairs.
 *
 * @memberof module:omcMerge
 * @function mergeIdentifier
 * @static
 * @param {OmcIdentifier} omcId1
 * @param {OmcIdentifier} omcId2
 * @returns {Array<OmcIdentifier>}
 */
export function mergeIdentifier(omcId1: OmcIdentifier, omcId2: OmcIdentifier): Array<OmcIdentifier>;
/**
 * @memberof module:omcMerge
 * @function mergeEntity
 * @static
 * @param {OmcEntity} omc1
 * @param {OmcEntity} omc2
 * @returns {OmcEntity}
 */
export function mergeEntity(omc1: OmcEntity, omc2: OmcEntity): OmcEntity;
