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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
    },
    edges: {
        for: ['NarrativeScene'],
        has: ['Slate'],
        related: ['ProductionScene'],
        uses: ['Asset', 'Depiction', 'ProductionLocation'],
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
