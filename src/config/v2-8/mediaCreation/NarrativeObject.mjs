/**
 * Template details for NarrativeObject
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: 'string',
        quantity: null,
        size: null,
        Context: null,
        Depiction: null,
    },
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
        Depiction: {
            type: 'array',
            path: 'Depiction',
            allowed: ['Depiction'],
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
        },
        inlineFragment: null,
    },
    idPrefix: 'nobj',
};
