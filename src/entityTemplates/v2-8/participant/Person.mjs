/**
 * Template details for Person
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        structuralType: null,
        personName: {
            fullName: null,
        },
        jobTitle: null,
        gender: null,
        contact: null,
        Location: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'psn',
};
