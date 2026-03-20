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
            inverse: 'Depicts',
            biDirectional: true,
        },
    },
    edges: {
        features: {
            allowed: ['Character', 'Effect', 'NarrativeAudio', 'NarrativeLocation', 'NarrativeObject', 'NarrativeWardrobe', 'SpecialAction'],
        },
        for: {
            allowed: ['CreativeWork'],
        },
        has: {
            allowed: ['Asset', 'ProductionScene'],
        },
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
