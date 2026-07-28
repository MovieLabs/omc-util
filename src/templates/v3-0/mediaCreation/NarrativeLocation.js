/**
 * Template details for NarrativeLocation
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeLocationType: null,
            narrativeLocationName: scriptName.graphQl.properties,
            narrativeLocationProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeLocationType: 'string',
            narrativeLocationName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
