/**
 * @module entityModel
 */

/**
 * A set of methods for conducting operations on a single OMC entity
 *
 * @typedef EntityModel
 * @memberOf module:entityModel
 */

/**
 * @typedef {Object} EntityModelMethods
 * @property {function(): Array<string>} getBaseKeys {@link module:omcEdges.getBaseKeys}
 * @property {function(): Object<string, *>} getBaseProps {@link module:omcEdges.getBaseProps}
 * @property {function(): Array<string>} getIntrinsicKeys {@link module:omcEdges.getIntrinsicKeys}
 * @property {function(): Object<string, *>} getIntrinsicProps {@link module:omcEdges.getIntrinsicProps}
 * @property {function(): Array<string>} getContextKeys {@link module:omcEdges.getContextKeys}
 * @property {function(): Object<string, *>} getContextProps {@link module:omcEdges.getContextProps}
 * @property {string} color - Entity color from generalConfig
 * @property {string} label - Entity label from generalConfig
 * @property {string} labelSuffix - Entity label with suffix from generalConfig
 */

import { generalConfig } from '../config/index.mjs';
import {
    getBaseKeys,
    getBaseProps,
    getIntrinsicKeys,
    getIntrinsicProps,
    getContextKeys,
    getContextProps,
} from '../omc/omcEdges.mjs';

const entityModelProto = {
    /**
     * Uses {@link module:omcEdges.getBaseKeys} internally
     * @returns {Array<string>}
     */
    getBaseKeys() {
        return getBaseKeys(this);
    },
    /**
     * Uses {@link module:omcEdges.getBaseProps} internally
     * @returns {Object<string, *>}
     */
    getBaseProps() {
        return getBaseProps(this);
    },
    /**
     * Uses {@link module:omcEdges.getIntrinsicKeys} internally
     * @returns {Array<string>}
     */
    getIntrinsicKeys() {
        return getIntrinsicKeys(this);
    },
    /**
     * Uses {@link module:omcEdges.getIntrinsicProps} internally
     * @returns {Object<string, *>}
     */
    getIntrinsicProps() {
        return getIntrinsicProps(this);
    },
    /**
     * Uses {@link module:omcEdges.getContextKeys} internally
     * @returns {Array<string>}
     */
    getContextKeys() {
        return getContextKeys(this);
    },
    /**
     * Uses {@link module:omcEdges.getContextProps} internally
     * @returns {Object<string, *>}
     */
    getContextProps() {
        return getContextProps(this);
    },
    get color() {
        return generalConfig[this.entityType].presentation.entityColor;
    },
    get label() {
        return generalConfig[this.entityType].presentation.entityLabel;
    },
    get labelSuffix() {
        const label = generalConfig[this.entityType].presentation.entityLabel;
        return generalConfig[this.entityType].presentation?.entityLabelSuffix
            ? `${label}${generalConfig[this.entityType].presentation?.entityLabelSuffix(this)}`
            : label;
    },
};

/**
 * @function entityModel
 * @param {OmcEntity} omcEntity
 * @returns {EntityModel}
 */
export default function entityModel(omcEntity = {}) {
    const model = Object.create(entityModelProto);
    const t = Object.assign(model, omcEntity);
    // console.log(Object.keys(t));
    return t;
}
