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
            $edge: {
                $allowed: ['TaskSC'],
            },
        },
        taskFC: {
            functionalType: { $type: 'string' },
            functionalProperties: { $type: 'string' },
            customData: null,
        },
        Member: {
            $type: 'array',
            $edge: {
                $allowed: ['Task'],
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $omcPredicate: 'isInContext',
            },
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
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            taskName: basicName.graphQl.filter,
        },
        inlineFragment: null,
        idPrefix: 'tsk',
    },
};
