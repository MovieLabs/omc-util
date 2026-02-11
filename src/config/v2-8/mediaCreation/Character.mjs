/**
 * Template details for Character
 */

import { baseEntity, completeName } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        characterType: null,
        characterName: completeName,
        Context: null,
        Depiction: null,
    },
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
        Depiction: {
            type: 'array',
            path: 'Depiction',
            allowed: ['Depiction'],
            biDirectional: true,
        },
    },
    edges: {
        featuresIn: ['NarrativeScene'],
        needs: ['Effect', 'NarrativeAudio', 'NarrativeObject', 'NarrativeStyling', 'NarrativeWardrobe', 'SpecialAction'],
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
