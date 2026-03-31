/**
 * Template details for TaskSC
 */
import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        structuralType: null,
        structuralProperties: null,
        customData: null,
    },
    intrinsic: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'tsksc',
};
