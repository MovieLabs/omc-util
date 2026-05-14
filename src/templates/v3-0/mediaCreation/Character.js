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
        edges: {
            featuresIn: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                        $predicate: 'featuresIn',
                        $omcPredicate: 'aCharacterFeaturesIn',
                    },
                },
            },
            needs: {
                Effect: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Effect'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'aCharacterNeeds',
                    },
                },
                NarrativeAudio: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeAudio'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'aCharacterNeeds',
                    },
                },
                NarrativeObject: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeObject'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'aCharacterNeeds',
                    },
                },
                NarrativeStyling: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeStyling'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'aCharacterNeeds',
                    },
                },
                NarrativeWardrobe: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeWardrobe'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'usesWardrobe',
                    },
                },
                SpecialAction: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['SpecialAction'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'aCharacterNeeds',
                    },
                },
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $predicate: 'Context',
                $omcPredicate: 'isInContext',
            },
        },
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depicts',
                $predicate: 'Depiction',
                $omcPredicate: 'aCharacterPortrayedIn',
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
