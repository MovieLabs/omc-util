/**
 * Template details for NarrativeObject
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeObject';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeObjectType: null,
            narrativeObjectName: scriptName.graphQl.filter,
            quantity: null,
            size: null,
            narrativeObjectProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeObjectType: 'string',
            narrativeObjectName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
