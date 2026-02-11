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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
    },
    edges: {
        featuresIn: ['NarrativeScene'],
        neededBy: ['Character'],
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
