/**
 * Template for Character
 */

import { assertAllCaps } from '../../../mlHelpers/util.js';
import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, completeName } from '../utility/utility.js';

const entityType = 'Character';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        characterType: {
            $type: 'string',
        },
        characterName: {
            ...completeName.template,
            scriptName: {
                $type: 'string',
                $mergeKey: true,
                $validate: assertAllCaps,
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depicts',
                $omcPredicate: 'hasDepiction',
            },
        },
    },
    cxtEdges: {
        featuresIn: {
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                },
            },
        },
        needs: {
            Effect: {
                $type: 'array',
                $edge: {
                    $allowed: ['Effect'],
                },
            },
            NarrativeAudio: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeAudio'],
                },
            },
            NarrativeObject: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeObject'],
                },
            },
            NarrativeStyling: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeStyling'],
                },
            },
            NarrativeWardrobe: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeWardrobe'],
                },
            },
            SpecialAction: {
                $type: 'array',
                $edge: {
                    $allowed: ['SpecialAction'],
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            characterType: null,
            characterName: completeName.graphQl.properties,
            Context: null,
            Depiction: null,
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
