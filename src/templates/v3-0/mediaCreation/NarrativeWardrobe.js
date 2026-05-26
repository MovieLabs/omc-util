/**
 * Template details for NarrativeWardrobe
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'NarrativeWardrobe';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeWardrobeName: basicName.template,
        // Depiction: {
        //     $type: 'array',
        // },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: null,
            narrativeWardrobeName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeWardrobeName: basicName.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
};
