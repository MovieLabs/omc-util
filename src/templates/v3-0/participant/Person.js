/**
 * Template details for Person
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, gender, contact } from '../utility/utility.js';

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
        gender: gender.template,
        contact: contact.template,
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
            personName: {
                fullName: null,
            },
            jobTitle: null,
            gender: gender.graphQl.properties,
            contact: contact.graphQl.properties,
            Location: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'psn',
};
