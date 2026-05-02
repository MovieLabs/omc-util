/**
 * Template details for TaskSC
 */
import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'TaskSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: null,
        structuralProperties: null,
        customData: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            structuralType: null,
            structuralProperties: null,
            customData: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'tsksc',
};
