/**
 * Template details for TaskSC
 */
import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'TaskSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: null,
        taskSCName: basicName.template,
        structuralProperties: null,
        customData: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            taskSCName: basicName.graphQl.properties,
            structuralType: null,
            structuralProperties: null,
            customData: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            taskSCName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'tsksc',
};
