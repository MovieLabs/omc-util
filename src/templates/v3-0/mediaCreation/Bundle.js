/**
 * Template details for Bundle
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Bundle';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            bundleType: null,
            bundleName: basicName.graphQl.properties,
            bundleCategory: null,
            bundleProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            bundleType: ['string'],
            bundleName: basicName.graphQl.filter,
            bundleCategory: ['string'],
        },
        inlineFragment: null,
    },
};
