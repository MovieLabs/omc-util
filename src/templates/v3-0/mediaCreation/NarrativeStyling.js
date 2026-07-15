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
        narrativeStylingType: { $type: 'string', $default: 'narrativeStyling' },
        narrativeStylingProperties: { $type: 'string' },
        narrativeStylingName: basicName.template,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeStylingType: null,
            narrativeStylingProperties: null,
            narrativeStylingName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeStylingTypeType: 'string',
            narrativeStylingName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
