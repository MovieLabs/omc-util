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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
    },
    edges: {
        usedIn: ['ProductionScene'],
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
