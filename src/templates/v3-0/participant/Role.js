/**
 * Template details for Role
 */

import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Role';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        roleType: { $type: 'string' },
    },
    intrinsic: {},
    edges: {},
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            roleType: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'rol',
};
