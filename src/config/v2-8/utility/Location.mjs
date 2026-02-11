/**
 * Template details for Location
 */

import { baseEntity } from './utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        address: null,
        coordinates: null,
        Context: null,
    },
    intrinsicProps: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'loc',
};
