/**
 * Template details for NarrativeLocation
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeLocationName: scriptName.template,
        // Depiction: {
        //     $type: 'array',
        // },
        Location: {
            $type: 'array',
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: null,
            narrativeLocationName: scriptName.graphQl.properties,
            // Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
            narrativeLocationName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
