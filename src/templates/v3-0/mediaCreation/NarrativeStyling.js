/**
 * Template details for NarrativeStyling
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'NarrativeStyling';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeStylingName: basicName.template,
        // Depiction: {
        //     $type: 'array',
        // },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: null,
            narrativeStylingName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
            narrativeStyling: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
