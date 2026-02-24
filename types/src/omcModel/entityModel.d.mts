/**
 * @function entityModel
 * @param {OmcEntity} omcEntity
 * @returns {EntityModel}
 */
export default function entityModel(omcEntity?: OmcEntity): EntityModel;
/**
 * A set of methods for conducting operations on a single OMC entity
 */
export type EntityModel = OmcEntity & EntityModelMethods;
export type EntityModelMethods = {
    /**
     * {@link module :omcEdges.getBaseKeys}
     */
    getBaseKeys: () => Array<string>;
    /**
     * {@link module :omcEdges.getBaseProps}
     */
    getBaseProps: () => {
        [x: string]: any;
    };
    /**
     * {@link module :omcEdges.getIntrinsicKeys}
     */
    getIntrinsicKeys: () => Array<string>;
    /**
     * {@link module :omcEdges.getIntrinsicProps}
     */
    getIntrinsicProps: () => {
        [x: string]: any;
    };
    /**
     * {@link module :omcEdges.getContextKeys}
     */
    getContextKeys: () => Array<string>;
    /**
     * {@link module :omcEdges.getContextProps}
     */
    getContextProps: () => {
        [x: string]: any;
    };
    /**
     * - Entity color from generalConfig
     */
    color: string;
    /**
     * - Entity label from generalConfig
     */
    label: string;
    /**
     * - Entity label with suffix from generalConfig
     */
    labelSuffix: string;
};
