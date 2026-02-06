import { baseEntity } from '../utility/utility.mjs';

/**
 * Template details for Service
 */
export default {
    properties: {
        ...baseEntity.properties,
        structuralType: null,
        serviceName: {
            fullName: null,
        },
        contact: null,
        Location: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'srvc',
};
