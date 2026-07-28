/**
 * Template details for NarrativeWardrobe
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'NarrativeWardrobe';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeWardrobeType: null,
            narrativeWardrobeProperties: null,
            narrativeWardrobeName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeWardrobeName: basicName.graphQl.filter,
            narrativeWardrobeType: 'string',
        },
        inlineFragment: null,
    },
};
