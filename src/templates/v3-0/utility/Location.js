/**
 * Template details for Location
 */

import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName } from './utility.js';

const entityType = 'Location';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        compositionName: basicName.template,
        address: null,
        coordinates: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            compositionName: basicName.graphQl.properties,
            address: null,
            coordinates: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            compositionName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
