/**
 * Template details for Task
 */
import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Task';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
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
