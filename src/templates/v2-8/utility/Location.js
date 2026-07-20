/**
 * Template details for Location
 */

import { generalConfig } from '../generalConfig.js';

import { baseEntity } from './utility.js';

const entityType = 'Location';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    intrinsic: {},
    edges: {},
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            address: null,
            coordinates: null,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
};
