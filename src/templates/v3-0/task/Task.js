/**
 * Template details for Task
 */
import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Task';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
    template: {
        ...baseEntity.template,
        taskName: basicName.template,
        TaskSC: {
            $type: 'array',
        },
        taskFC: {
            functionalType: { $type: 'string' },
            functionalProperties: { $type: 'string' },
            customData: null,
        },
        Member: {
            $type: 'array',
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            taskName: basicName.graphQl.properties,
            Task: null,
            TaskSC: null,
            taskFC: {
                functionalType: null,
                functionalProperties: null,
                customData: null,
            },
            Member: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            taskName: basicName.graphQl.filter,
        },
        inlineFragment: null,
        idPrefix: 'tsk',
    },
};
