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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
        ForEntity: {
            type: 'array',
            path: 'ForEntity',
            allowed: [
                'Asset',
                'Character',
                'CreativeWork',
                'Context',
                'Depiction',
                'Effect',
                'Collection',
                'Composition',
                'Location',
                'NarrativeAudio',
                'NarrativeScene',
                'NarrativeLocation',
                'NarrativeObject',
                'NarrativeStyling',
                'NarrativeWardrobe',
                'Participant',
                'ProductionLocation',
                'ProductionScene',
                'Slate',
                'SpecialAction',
            ],
        },
    },
    edges: {},
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
