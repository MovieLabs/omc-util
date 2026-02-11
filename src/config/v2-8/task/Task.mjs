/**
 * Template details for Task
 */
import { baseEntity } from '../utility/utility.mjs';

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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
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
