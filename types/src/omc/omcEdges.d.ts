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
 * Tests if an edge between two entityTypes is valid as per OMC and returns that edge or null
 * @function edgeValid
 * @param {Object} params
 * @param {OmcEntity} params.fromEntity - The entity from which the edge is from
 * @param {OmcEntity} params.toEntity - The entity from which the edge is to
 * @param {OmcEntity} params.forEntity - If toEntity is a Context, this is the entity which the Context is related to
 * @returns {Object | null} - An array of the valid entityTypes the fromEntity may connect to
 */
export function edgeValid({ fromEntity, toEntity, forEntity, }: {
    fromEntity: OmcEntity;
    toEntity: OmcEntity;
    forEntity: OmcEntity;
}): any | null;
/**
 * Why `edgeCreate` would refuse to write this edge, or null where it would write it.
 *
 * Ask this when there is someone to tell. `edgeCreate` returns falsy on a refusal and writes
 * nothing, which is the whole of what a caller with nowhere to put a message needs; this says which
 * side was full, how full, and whether the reference is one already there — the difference between
 * "only one is allowed" and "these two are already related", which read as different problems to
 * whoever pressed the button.
 *
 * The cap is checked on both sides because both are written. `Realization.RealizationOf` admits one
 * reference, so a second NarrativeObject connected to the same Realization is refused by the
 * reverse even though the forward slot on the NarrativeObject has room.
 *
 * @function edgeRefusal
 * @param {Object} params - The same parameters `edgeCreate` takes
 * @returns {EdgeRefusal|null}
 */
export function edgeRefusal(params: any): EdgeRefusal | null;
/**
 * Creates a new edge from one entity to another, based on the allowed edges for the entity
 * - Setting the 'inverse' property will also create the inverse edge in the toEntity if applicable
 * - Some entities have multiple properties where the same toEntity is allowed, using the intrinsicEdge property allows a specific property to be targeted
 *
 * @function edgeCreate
 * @param {Object} params
 * @param {OmcEntity} params.fromEntity - The entity on which to create the new edge
 * @param {OmcEntity} params.toEntity - The entity to which the edge should be created
 * @param {OmcEntity} params.forEntity - The entity which a Context is for, when the fromEntity is a Context
 * @param {Object} params.intrinsicEdge - Specify a specific edge, for entities that have multiple valid edge patterns, this denotes the specific one to use
 * @param {boolean} params.inverse - Whether the inverse edge should also be set if there is one
 */
export function edgeCreate(params: {
    fromEntity: OmcEntity;
    toEntity: OmcEntity;
    forEntity: OmcEntity;
    intrinsicEdge: any;
    inverse: boolean;
}): {
    fromEntity: any;
    toEntity: any;
    fromEdgePath: any;
    toEdgePath: any;
} | {
    fromEntity: any;
    toEntity: OmcEntity;
    fromEdgePath: any;
    toEdgePath?: undefined;
};
/**
 * Why an edge was not written.
 */
export type EdgeRefusal = {
    /**
     * - The schema does not admit the edge at all, or the slot it
     * goes in is already at its cap
     */
    reason: "notAllowed" | "full";
    /**
     * - Which entity the full slot is on. `target` means the reverse
     * edge had nowhere to go, which refuses the forward edge with it: nothing is written on either.
     */
    side: "source" | "target";
    /**
     * - The type carrying the full slot
     */
    entityType: OmcEntityType;
    /**
     * - The slot's storage path on that entity
     */
    path?: string;
    /**
     * - What the schema admits there
     */
    maxItems?: number;
    /**
     * - What it already holds
     */
    held?: number;
    /**
     * - Whether one of those is the entity being connected, which
     * makes this an existing relationship rather than a cap that has been reached
     */
    holdsTarget?: boolean;
};
//# sourceMappingURL=omcEdges.d.ts.map