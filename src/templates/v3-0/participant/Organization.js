/**
 * Template details for Organization
 */

import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Organization';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        organizationName: {
            fullName: { $type: 'string' },
        },
        Location: {
            $type: 'array',
            $edge: {
                $allowed: ['Location'],
            },
        },
    },
    intrinsic: {},
    edges: {},
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            organizationName: {
                fullName: null,
            },
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'org',
};
