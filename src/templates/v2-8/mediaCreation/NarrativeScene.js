/**
 * Template details for NarrativeScene
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName, note } from '../utility/utility.js';

const entityType = 'NarrativeScene';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        sceneName: {
            ...basicName.template,
            scriptName: {
                $type: 'string',
            },
        },
        sceneNumber: {
            $type: 'string',
        },
        slugline: note.template,
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
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
        properties: {
            ...baseEntity.graphQl.properties,
            sceneName: basicName.graphQl.properties,
            sceneNumber: null,
            slugline: note.graphQl.properties,
            Context: null,
        },
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
};
