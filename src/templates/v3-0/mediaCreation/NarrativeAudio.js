/**
 * Template details for NarrativeAudio
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeAudio';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeAudioName: scriptName.template,
        // Depiction: {
        //     $type: 'array',
        // },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: 'string',
            narrativeAudioName: scriptName.graphQl.properties,
            // Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
            narrativeAudioName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
