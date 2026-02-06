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
