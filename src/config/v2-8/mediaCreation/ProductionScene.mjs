/**
 * Template details for ProductionScene
 */

import { baseEntity, basicName } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        sceneName: basicName,
        sceneHeader: null,
        sceneDescriptor: null,
        sceneNumber: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
    },
    edges: {
        for: {
            allowed: ['NarrativeScene'],
        },
        has: {
            allowed: ['Slate'],
        },
        related: {
            allowed: ['ProductionScene'],
        },
        uses: {
            allowed: ['Asset', 'Depiction', 'ProductionLocation'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            sceneName: {
                fullName: ['string'],
                altName: ['string'],
            },
        },
        inlineFragment: null,
    },
    idPrefix: 'pscn',
};
