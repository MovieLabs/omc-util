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
        TaskStructure: { $type: 'array' },
        taskFunction: {
            taskFunctionType: { $type: 'string', $default: 'taskFunction' },
            taskFunctionProperties: { $type: 'string' },
        },
        Member: { $type: 'array' },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            taskName: basicName.graphQl.properties,
            TaskStructure: null,
            taskFunction: {
                taskFunctionType: null,
                taskFunctionProperties: null,
            },
            Member: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            taskName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
