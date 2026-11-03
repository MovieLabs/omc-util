/**
 * Template for Character
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, personName } from '../utility/utility.js';

const entityType = 'Character';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            characterType: null,
            characterName: personName.graphQl.properties,
            characterProperties: null,
        },
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
};
