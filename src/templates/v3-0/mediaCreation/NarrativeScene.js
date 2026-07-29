/**
 * Template details for NarrativeScene
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName, note } from '../utility/utility.js';

const entityType = 'NarrativeScene';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeSceneType: null,
            narrativeSceneProperties: null,
            narrativeSceneName: scriptName.graphQl.properties,
            sceneNumber: null,
            slugline: note.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeSceneName: scriptName.graphQl.filter,
            sceneNumber: ['string'], // accepts multiple scene numbers, matching ProductionScene
        },
        inlineFragment: null,
    },
};
