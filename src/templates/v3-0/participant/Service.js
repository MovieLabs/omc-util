import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Service';
const entityGeneral = generalConfig[entityType];

/**
 * Template details for Service
 */
export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: { $type: 'string' },
        serviceName: {
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
            serviceName: {
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
    idPrefix: 'srvc',
};
