/**
 * Template details for NarrativeObject
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        narrativeType: 'string',
        quantity: null,
        size: null,
        Context: null,
        Depiction: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'nobj',
};
