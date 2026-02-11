/**
 * Template details for InfrastructureSC
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        structuralType: null,
        structuralProperties: null,
    },
    intrinsicProps: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'infsc',
};
