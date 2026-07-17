export type EntityTemplate = any;
export type PropertyTemplate = any;
export type EdgeTemplate = any;
export type GraphQlTemplate = any;
/**
 * Parameters passed in to request template details
 */
export type TemplateQuery = any;
/**
 * The details for all edges on a given entityType
 */
export type EdgeTable = any;
/**
 * Properties to be used when rendering the header section for an entity
 */
export type PresentationHeader = any;
/**
 * Provides a set of suggested properties to display when rendering a node
 * Either the string indicating the property key, or a function that will return a string
 */
export type PresentationProps = Array<string, Function>;
/**
 * A set of consistent values and methods useful when presenting an entity in a UI
 */
export type Presentation = any;
/**
 * - Schema groups with all the entities that belong in that group
 */
export type SchemaGroups = {
    [x: string]: string[];
};
export type OmcTemplate = any;
/**
 * Methods returning templated values based on the schema version
 * @type {OmcTemplate}
 * @memberOf namespace:OmcUtil
 */
export const omcTemplate: OmcTemplate;
//# sourceMappingURL=index.d.ts.map