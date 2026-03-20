/**
 * Template details for SpecialAction
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        specialActionType: null,
        Context: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
    },
    edges: {
        featuresIn: {
            allowed: ['NarrativeScene'],
        },
        neededBy: {
            allowed: ['Character'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            specialActionType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'sact',
};
