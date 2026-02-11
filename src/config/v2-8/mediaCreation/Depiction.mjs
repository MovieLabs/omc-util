/**
 * Template details for Depiction
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        depictionType: null,
        Depicts: null,
        Depicter: null,
        Context: null,
    },
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
        Depicts: {
            type: 'array',
            path: 'Depicts',
            allowed: ['Character', 'NarrativeObject', 'NarrativeWardrobe', 'NarrativeLocation', 'NarrativeAudio', 'NarrativeStyling'],
            biDirectional: true,
        },
        Depictor: {
            type: 'array',
            path: 'Depictor',
            allowed: ['Asset', 'Participant'],
            biDirectional: true,
        },
    },
    edges: {
        usedIn: ['ProductionScene'],
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            depictionType: 'string',
        },
        inlineFragment: {
            Depicts: {
                Character: '...on',
                NarrativeLocation: '...on',
                NarrativeObject: '...on',
                NarrativeStyling: '...on',
                NarrativeWardrobe: '...on',
            },
            Depicter: {
                Participant: '...on',
                Asset: '...on',
            },
        },
    },
    idPrefix: 'dpc',
};
