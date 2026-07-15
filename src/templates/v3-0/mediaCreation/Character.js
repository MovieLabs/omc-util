/**
 * Template for Character
 */

import { assertAllCaps } from '../../../mlHelpers/util.js';
import { generalConfig } from '../generalConfig.js';
import { baseEntity, completeName } from '../utility/utility.js';

const entityType = 'Character';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        characterType: {
            $type: 'string',
            $default: 'character',
        },
        characterName: {
            ...completeName.template,
            scriptName: {
                $type: 'string',
                $mergeKey: true,
                $validate: assertAllCaps,
            },
        },
        characterProperties: {
            physicalCharacteristics: {
                species: { $type: 'string' },
                hairColor: { $type: 'string' },
                hairLength: { $type: 'string' },
                eyeColor: { $type: 'string' },
                weight: { $type: 'string' },
                height: { $type: 'string' },
            },
            quantity: { $type: 'number' },
            gender: {
                gender: { $type: 'string' },
                genderPronoun: { $type: 'string' },
            },
            background: {
                $type: 'array',
                $items: {
                    author: { $type: 'string' },
                    title: { $type: 'string' },
                    text: { $type: 'string' },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            characterType: null,
            characterName: completeName.graphQl.properties,
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
