/**
 * Template details for NarrativeScene
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName, note } from '../utility/utility.js';

const entityType = 'NarrativeScene';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeSceneType: { $type: 'string', $default: 'narrativeScene' },
        narrativeSceneProperties: { $type: 'object' },
        narrativeSceneName: scriptName.template,
        sceneNumber: { $type: 'string' },
        slugline: {
            $type: 'array',
            $items: {
                author: { $type: 'string' },
                title: { $type: 'string' },
                text: { $type: 'string' },
            },
        },
    },
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
            sceneNumber: 'string',
        },
        inlineFragment: null,
    },
};
