/**
 * Template details for NarrativeWardrobe
 */
import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: null,
        Context: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
        Depiction: {
            type: 'array',
            allowed: ['Depiction'],
            inverse: 'Depicts',
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
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'nwrd',
};
