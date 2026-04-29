/**
 * Template details for Person
 */

import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Person';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: { $type: 'string' },
        personName: {
            fullName: { $type: 'string' },
        },
        jobTitle: { $type: 'string' },
        gender: null,
        contact: null,
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
            structuralType: null,
            personName: {
                fullName: null,
            },
            jobTitle: null,
            gender: null,
            contact: null,
            Location: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'psn',
};
