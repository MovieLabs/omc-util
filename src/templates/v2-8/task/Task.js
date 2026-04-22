/**
 * Template details for Task
 */
import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        Task: null,
        TaskSC: null,
        taskFC: {
            functionalType: null,
            functionalProperties: null,
            customData: null,
        },
        Context: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
    },
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
        idPrefix: 'tsk',
    },
};
