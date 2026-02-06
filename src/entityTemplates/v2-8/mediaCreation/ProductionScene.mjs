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
