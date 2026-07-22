/**
 * @type OmcGeneralConfig
 */
export const generalConfig: OmcGeneralConfig;
export type OmcGeneralConfig = {
    /**
     * - A broad grouping for the entity as it is used in the Ontology
     */
    group: string;
    /**
     * - A shortened prefix that can be used with the identifierValue
     */
    idPrefix: string;
    /**
     * - Property path(s) whose value(s) can be treated as unique
     * within a project, so they can substitute for an identifier when combining data from multiple
     * sources into one canonical instance (matching an existing entity, or deterministically minting
     * an id). An ordered composite key; omit or leave empty when the entity type has no merge key.
     */
    mergeKey?: string[];
    /**
     * - Presentation configuration for UI's
     */
    presentation: any;
    /**
     * - A color for representing the entity in UI's and charts
     */
    color: string;
    /**
     * - A entityLabel when displaying the entity in UI's and charts
     */
    entityLabel: string;
    /**
     * - A function for displaying a suffix to the entityLabel based on an instance
     */
    entityLabelSuffix: Function;
};
//# sourceMappingURL=generalConfig.d.ts.map