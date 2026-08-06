/**
 * Template details for Location
 */

import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName } from './utility.js';

const entityType = 'Location';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            locationName: basicName.graphQl.properties,
            address: {
                street: null,
                locality: null,
                region: null,
                postalCode: null,
                country: null,
            },
            coordinates: {
                latitude: null,
                longitude: null,
                elevation: null,
            },
        },
        filter: {
            ...baseEntity.graphQl.filter,
            locationName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
