/**
 * Template details for Task
 */
import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Task';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
    template: {
        ...baseEntity.template,
        // Task: null,
        // TaskSC: null,
        taskFC: {
            functionalType: { $type: 'string' },
            functionalProperties: { $type: 'string' },
            customData: null,
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
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
        properties: {
            ...baseEntity.graphQl.properties,
            Task: null,
            TaskSC: null,
            taskFC: {
                functionalType: null,
                functionalProperties: null,
                customData: null,
            },
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
        idPrefix: 'tsk',
    },
};
