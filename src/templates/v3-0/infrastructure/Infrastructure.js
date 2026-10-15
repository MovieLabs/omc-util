/**
 * Template details for Infrastructure
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Infrastructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            infrastructureName: basicName.graphQl.properties,
            infrastructureType: null,
            Member: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            infrastructureName: basicName.graphQl.filter,
            infrastructureType: ['string'],
        },
        inlineFragment: {},
    },
    idPrefix: 'inf',
};
