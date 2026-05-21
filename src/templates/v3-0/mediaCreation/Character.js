/**
 * Template for Character
 */

import { assertAllCaps } from '../../../mlHelpers/util.js';
import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, completeName } from '../utility/utility.js';

import {
    cxtFeaturesInNarrativeScene,
    cxtIsInContext,
    cxtNeedsEffect,
    cxtNeedsNarrativeAudio,
} from './edgeConstructs.js';

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
        // Missing interactsWithCharacter
        edges: {
            has: {
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isFor.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'hasContext',
                    },
                },
            },
            featuresIn: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                        $predicate: 'featuresIn',
                        $omcPredicate: 'omcT:aCharacterFeaturesIn.NarrativeScene',
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
                        $omcPredicate: 'omcT:aCharacterNeeds.xName',
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
                        $omcPredicate: 'omcT:aCharacterNeeds.xName',
                    },
                },
                NarrativeStyling: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeStyling'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'omcT:aCharacterNeeds.xName',
                    },
                },
                NarrativeWardrobe: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeWardrobe'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'omcT:aCharacterNeeds.NarrativeWardrobe', // usesWardrobe
                    },
                },
                SpecialAction: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['SpecialAction'],
                        $inverse: `edges.${inverseEdges.needs}.${entityType}`,
                        $predicate: 'needs',
                        $omcPredicate: 'omcT:aCharacterNeeds.xType',
                    },
                },
            },
        },
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depicts',
                $predicate: 'Depiction',
                $omcPredicate: 'omc:isDepictedThingOf', // Not possible: 'omcT:aCharacterPortrayedIn.Portrayal'
            },
        },
    },
    cxtEdges: {
        isIn: {
            Context: { ...cxtIsInContext },
        },
        featuresIn: {
            NarrativeScene: { ...cxtFeaturesInNarrativeScene },
        },
        needs: {
            Effect: { ...cxtNeedsEffect },
            NarrativeAudio: { ...cxtNeedsNarrativeAudio },
            NarrativeObject: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeObject'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
            NarrativeStyling: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeStyling'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
            NarrativeWardrobe: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeWardrobe'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
            SpecialAction: {
                $type: 'array',
                $edge: {
                    $allowed: ['SpecialAction'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            characterType: null,
            characterName: completeName.graphQl.properties,
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
