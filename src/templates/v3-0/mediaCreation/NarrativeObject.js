/**
 * Template details for NarrativeObject
 */
import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: 'string',
        quantity: null,
        size: null,
        Context: null,
        Depiction: null,
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
            biDirectional: true,
            inverse: 'Depicts',
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
        },
        inlineFragment: null,
    },
    idPrefix: 'nobj',
};
