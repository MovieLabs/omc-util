/**
 * Template details for Context
 */

import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        contextType: null,
        contextCategory: null,
        contextProperties: null,
        ForEntity: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: 'ForEntity',
        },
        ForEntity: {
            type: 'array',
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
    edges2: {
        for: {
            NarrativeScene: {},
        },
        featuresIn: {
            NarrativeScene: {
                allowed: ['NarrativeScene'],
            },
        },
        has: {
            NarrativeScene: {},
            Participant: {},
            Slate: {},
        },
        needs: {
            Effect: {
                allowed: ['Effect'],
            },
            NarrativeAudio: {
                allowed: ['NarrativeAudio'],
            },
            NarrativeObject: {
                allowed: ['NarrativeObject'],
            },
            NarrativeStyling: {
                allowed: ['NarrativeStyling'],
            },
            NarrativeWardrobe: {
                allowed: ['NarrativeWardrobe'],
            },
            SpecialAction: {
                allowed: ['SpecialAction'],
            },
        },
        usedIn: {
            ProductionLocation: {},
            productOf: {},
        },
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
