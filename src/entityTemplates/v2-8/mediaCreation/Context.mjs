/**
 * Template details for Context
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        contextType: null,
        contextCategory: null,
        contextProperties: null,
        ForEntity: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            contextType: ['string'],
            contextCategory: ['string'],
        },
        inlineFragment: null,
    },
    idPrefix: 'cxt',
};
