/**
 * Template details for NarrativeAudio
 */
import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: 'string',
        Context: null,
        Depiction: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: 'ForEntity',
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
    idPrefix: 'naud',
};
