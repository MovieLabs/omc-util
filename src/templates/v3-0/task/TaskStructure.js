/**
 * Template details for TaskSC
 */
import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'TaskStructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        taskStructureType: null,
        taskStructureName: basicName.template,
        taskStructureProperties: null,
        customData: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            taskStructureName: basicName.graphQl.properties,
            taskStructureType: null,
            taskStructureProperties: null,
            customData: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            taskStructureName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'tsks',
};
