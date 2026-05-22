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
        narrativeSceneName: scriptName.template,
        sceneNumber: {
            $type: 'string',
        },
        slugline: note.template,
        Depiction: {
            $type: 'array',
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
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
