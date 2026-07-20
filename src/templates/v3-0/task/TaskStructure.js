/**
 * Template details for TaskSC
 */
import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'TaskStructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            taskStructureName: basicName.graphQl.properties,
            taskStructureType: null,
            taskStructureProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            taskStructureName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
