/**
 * Template details for Effect
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'Effect';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            effectName: scriptName.graphQl.properties,
            effectType: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            effectName: scriptName.graphQl.filter,
            effectProperties: null,
        },
        inlineFragment: null,
    },
};
