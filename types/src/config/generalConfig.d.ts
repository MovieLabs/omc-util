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
