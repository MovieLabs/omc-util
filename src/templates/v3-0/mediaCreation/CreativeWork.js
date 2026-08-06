/**
 * Template details for CreativeWork
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'CreativeWork';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            creativeWorkType: null,
            creativeWorkName: basicName.graphQl.properties,
            creativeWorkProperties: null,
            creativeWorkCategory: null,
            creativeWorkTitle: {
                titleName: null,
                titleType: null,
                titleLanguage: null,
            },
            approximateLength: null,
            originalLanguage: null,
            countryOfOrigin: null,
            ProductionCompany: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
};
