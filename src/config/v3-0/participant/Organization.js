/**
 * Template details for Organization
 */

import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        organizationName: {
            fullName: null,
        },
    },
    intrinsic: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'org',
};
