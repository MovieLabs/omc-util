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
        narrativeAudioType: { $type: 'string', $default: 'narrativeAudio' },
        narrativeAudioName: scriptName.template,
        narrativeAudioProperties: {
            $type: 'object',
        },
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
            narrativeAudioProperties: null,
        },
        inlineFragment: null,
    },
};
