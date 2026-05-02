/**
 * Template details for Department
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Department';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: { $type: 'string' },
        departmentName: {
            fullName: { $type: 'string' },
        },
        contact: null,
        Location: {
            $type: 'array',
            $edge: {
                $allowed: ['Location'],
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            structuralType: null,
            departmentName: {
                fullName: null,
            },
            contact: null,
            Location: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'dpt',
};
