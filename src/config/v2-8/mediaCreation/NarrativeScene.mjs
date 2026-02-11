/**
 * Template details for NarrativeScene
 */

import { baseEntity, basicName, note } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        sceneName: basicName,
        sceneNumber: null,
        slugline: note,
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
        features: ['Character', 'Effect', 'NarrativeAudio', 'NarrativeLocation', 'NarrativeObject', 'NarrativeWardrobe', 'SpecialAction'],
        for: ['CreativeWork'],
        has: ['Asset', 'ProductionScene'],
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            sceneName: {
                fullName: ['string'],
                altName: ['string'],
            },
            sceneNumber: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'nscn',
};
