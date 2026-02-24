/**
 * Template details for NarrativeLocation
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: null,
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
            biDirectional: true,
            inverse: 'Depicts',
        },
        Location: {
            type: 'array',
            path: 'Location',
            allowed: ['Location'],
        },
    },
    edges: {
        features: {
            allowed: ['NarrativeScene'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'nloc',
};
