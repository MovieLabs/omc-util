/**
 * Template details for ProductionLocation
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        locationType: null,
        Context: null,
        Location: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: 'ForEntity',
        },
        Location: {
            type: 'array',
            allowed: ['Location'],
        },
    },
    edges: {
        usedIn: {
            allowed: ['ProductionScene'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            locationType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'ploc',
};
