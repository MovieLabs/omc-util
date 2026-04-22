/**
 * Template details for Character
 */

import { baseEntity, completeName } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        characterType: null,
        characterName: completeName,
        Context: null,
        Depiction: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: 'ForEntity',
        },
        Depiction: {
            type: 'array',
            allowed: ['Depiction'],
            biDirectional: true,
            inverse: 'Depicts',
            predicate: 'hasDepiction',
        },
    },
    edges: {
        featuresIn: {
            allowed: ['NarrativeScene'],
        },
        needs: {
            allowed: ['Effect', 'NarrativeAudio', 'NarrativeObject', 'NarrativeStyling', 'NarrativeWardrobe', 'SpecialAction'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            characterName: {
                firstGivenName: ['string'],
                familyName: ['string'],
                fullName: ['string'],
                altName: ['string'],
            },
        },
        inlineFragment: null,
    },
    idPrefix: 'chr',
};
