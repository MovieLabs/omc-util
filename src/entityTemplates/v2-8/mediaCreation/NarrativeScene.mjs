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
