/**
 * Template details for Task
 */
import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Task';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
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
