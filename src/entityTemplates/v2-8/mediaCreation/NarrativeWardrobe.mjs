/**
 * Template details for NarrativeWardrobe
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: null,
        Context: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'nwrd',
};
