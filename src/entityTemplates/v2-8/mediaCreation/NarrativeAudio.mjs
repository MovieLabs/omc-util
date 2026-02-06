/**
 * Template details for NarrativeAudio
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: 'string',
        Context: null,
        Depiction: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'naud',
};
