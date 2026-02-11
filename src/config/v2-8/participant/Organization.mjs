/**
 * Template details for Organization
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        organizationName: {
            fullName: null,
        },
    },
    intrinsicProps: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'org',
};
