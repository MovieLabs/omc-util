/**
 * Template details for Depiction
 */

import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        depictionType: null,
        Depicts: null,
        Depicter: null,
        Context: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: ['ForEntity'],
        },
        Depicts: {
            type: 'array',
            allowed: ['Character', 'NarrativeObject', 'NarrativeWardrobe', 'NarrativeLocation', 'NarrativeAudio', 'NarrativeStyling'],
            biDirectional: true,
            inverse: 'Depiction',
        },
        Depictor: {
            type: 'array',
            allowed: ['Asset', 'Participant'],
            biDirectional: true,
            inverse: 'Depiction',
        },
    },
    edges: {
        usedIn: {
            allowed: ['ProductionScene'],
        },
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
