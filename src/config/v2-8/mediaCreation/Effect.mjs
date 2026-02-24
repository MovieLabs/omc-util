/**
 * Template details for Effect
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        effectType: null,
        Context: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: 'ForEntity',
        },
    },
    edges: {
        featuresIn: {
            allowed: ['NarrativeScene'],
        },
        neededBy: {
            allowed: ['Character'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'eff',
};
