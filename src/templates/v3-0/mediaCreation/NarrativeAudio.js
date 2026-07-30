/**
 * Template details for NarrativeAudio
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeAudio';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeAudioType: 'string',
            narrativeAudioName: scriptName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeAudioType: 'string',
            narrativeAudioName: scriptName.graphQl.filter,
            narrativeAudioProperties: null,
        },
        inlineFragment: null,
    },
};
