/**
 * Template details for Location
 */

import { baseEntity } from './utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        address: null,
        coordinates: null,
        Context: null,
    },
    intrinsic: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
};
