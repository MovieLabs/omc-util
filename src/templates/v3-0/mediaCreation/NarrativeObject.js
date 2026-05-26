/**
 * Template details for NarrativeObject
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeObject';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeObjectName: scriptName.template,
        quantity: {
            $type: 'string',
        },
        size: {
            $type: 'string',
        },
        // Depiction: {
        //     $type: 'array',
        // },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: 'string',
            narrativeObjectName: scriptName.graphQl.filter,
            quantity: null,
            size: null,
            // Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeObjectName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
