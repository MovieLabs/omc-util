/**
 * Template details for NarrativeStyling
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: null,
        Context: null,
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
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'nsty',
};
