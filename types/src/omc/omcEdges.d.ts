/**
 * Return an array containing property keys that are present and part of the base entity
 * @memberof module:omcEdges
 * @function getBaseKeys
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Array<string>} - An array of property names present in the entity
 */
export function getBaseKeys(omcEntity: OmcEntity): Array<string>;
/**
 * Return an object containing just base entity properties and their values
 * @memberof module:omcEdges
 * @function getBaseProps
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Object<string, *>} - Base properties and values present on the entity
 */
export function getBaseProps(omcEntity: OmcEntity): {
    [x: string]: any;
};
export function relatedEdges(omcEntity: any): string[];
/**
 * If the entityType is a Context, return an array containing property keys that specific to that Context
 * @memberof module:omcEdges
 * @function getContextKeys
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {(Array<string> | null)} - An array of property names present on the entity, or null if not a Context
 */
export function getContextKeys(omcEntity: OmcEntity): (Array<string> | null);
/**
 * Return an array containing intrinsic property keys that are present on the entity
 * @memberof module:omcEdges
 * @function getIntrinsicKeys
 * @static
 * @param {OmcEntity} omcEntity
 * @returns {Array<string>} - An array of intrinsic property names present on the entity
 */
export function getIntrinsicKeys(omcEntity: OmcEntity): Array<string>;
/**
 * Recurses through an omcEntity and returns a flattened map of all the intrinsic properties
 * that have valid references
 *
 * intrinsic props that are singletons will be coerced into an array
 *
 * @memberof module:omcEdges
 * @function getIntrinsicProps
 * @static
 * @param {OmcEntity} omcEntity - The entity for which you want the intrinsic props
 * @returns {Object<string, *>}
 */
export function getIntrinsicProps(omcEntity: OmcEntity): {
    [x: string]: any;
};
export function getContextProps(omcEntity: any): {};
/**
 * Remove an identifier representing the edge to another entity from anywhere it is included in the entity
 *
 * @memberof module:omcEdges
 * @function removeEdge
 * @static
 * @param {OmcEntity} omcEntity - The entity from which the edge is to be removed
 * @param {OmcEntity | OmcIdentifier} identifier - The entity or the identifier of the edge to be removed
 * @returns {OmcEntity} The original entity with matching edges removed
 */
export function removeEdge(omcEntity: OmcEntity, identifier: OmcEntity | OmcIdentifier): OmcEntity;
/**
 * Returns an array of the entity types this entity can have an edge to as per the ontology
 * @function intrinsicAllowed
 * @static
 * @param {OmcEntityType} entityType - The entityType for which you wish to know the entities it can have an edge to.
 * @returns {Array<OmcEntityType>} An Array of the entity types this type may have an edge to
 */
/**
 * Returns an array of the entity types this entity can have an edge to as per the ontology
 * @function edgesAllowed
 * @static
 * @param {OmcEntityType} entityType - The entityType for which you wish to know the entities it can have an edge to.
 * @returns {Array<OmcEntityType>} An Array of the entity types this type may have an edge to
 */
/**
 * Tests if an edge between two entityTypes is valid as per OMC and returns that edge or null
 * @param {OmcEntity} fromEntity
 * @param {OmcEntity} toEntity
 * @param {'edges'|'intrinsic'} edgeType - Check against intrinsic or regular edges
 * @returns {Object | null}
 */
export function edgeValid(fromEntity: OmcEntity, toEntity: OmcEntity, edgeType?: "edges" | "intrinsic"): any | null;
/**
 * Creates a new edge from one entity to another, based on the allowed edges for the entity
 * - Setting the 'inverse' property will also create the inverse edge in the toEntity if applicable
 * - Some entities have multiple properties where the same toEntity is allowed, using the intrinsicEdge property allows a specific property to be targeted
 *
 * @function edgeCreate
 * @static
 * @param {Object} params
 * @param {OmcEntity} params.fromEntity - The entity on which to create the new edge
 * @param {OmcEntity} params.toEntity - The entity to which the edge should be created
 * @param {OmcEntity} params.forEntity - Use when setting edges in a Context, this is the entity for which the Context is For.
 * @param {Object} params.intrinsicEdge - Specify a specific edge, for entities that have multiple valid edge patterns, this denotes the specific one to use
 * @param {boolean} params.inverse - Whether the inverse edge should also be set if there is one
 * @param {'edges'|'intrinsic'} params.edgeType - Which edge table to use, intrinsic or regular edges.
 */
export function edgeCreate({ fromEntity, toEntity, forEntity, intrinsicEdge, inverse, edgeType, }: {
    fromEntity: OmcEntity;
    toEntity: OmcEntity;
    forEntity: OmcEntity;
    intrinsicEdge: any;
    inverse: boolean;
    edgeType: "edges" | "intrinsic";
}): any;
export function edgeInverse(omcContext: any): any[];
//# sourceMappingURL=omcEdges.d.ts.map