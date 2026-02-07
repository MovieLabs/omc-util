/**
 * @module entityModel
 */

/**
 * @typedef {import('../../types.mjs').OmcEntity} OmcEntity
 */

/**
 * As set of methods for conducting operations on a single OMC entity
 *
 * @typedef {Object} EntityModel
 * @memberOf module:entityModel
 * @extends OmcEntity
 * @property {function(): Array<string>} getBaseKeys {@link module:omcEdges.getBaseKeys}
 * @property {function(): Object<string, *>} getBaseProps {@link module:omcEdges.getBaseProps}
 * @property {function(): Array<string>} getIntrinsicKeys {@link module:omcEdges.getIntrinsicKeys}
 * @property {function(): Object<string, *>} getIntrinsicProps {@link module:omcEdges.getIntrinsicProps}
 * @property {function(): Array<string>} getContextKeys {@link module:omcEdges.getContextKeys}
 * @property {function(): Object<string, *>} getContextProps {@link module:omcEdges.getContextProps}
 */

import {
    getBaseKeys,
    getBaseProps,
    getIntrinsicKeys,
    getIntrinsicProps,
    getContextKeys,
    getContextProps,
} from '../omc/edges.mjs';

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
};

/**
 * @function entityModel
 * @param {OmcEntity} omcEntity
 * @returns {EntityModel}
 */
export default function entityModel(omcEntity) {
    const model = Object.create(entityModelProto);
    return Object.assign(model, omcEntity);
}
