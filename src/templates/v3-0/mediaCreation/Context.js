/**
 * Template details for Context
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Context';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
    template: {
        ...baseEntity.template,
        contextType: {
            $type: 'string',
        },
        contextName: basicName.template,
        contextCategory: {
            $type: 'string',
        },
        contextProperties: {
            $type: 'object',
        },
        edges: {
            isFor: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.isIn.${entityType}`,
                        $predicate: 'isFor',
                        $omcPredicate: 'isContextFor',
                    },
                },
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.isIn.${entityType}`,
                        $predicate: 'isFor',
                        $omcPredicate: 'isContextFor',
                    },
                },
            },
            for: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.isIn.${entityType}`,
                        $predicate: 'for',
                        $omcPredicate: 'for',
                    },
                },
            },
            featuresIn: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        // $inverse: `edges.${inverseEdges.featuresIn}`,
                        $inverse: `edges.isIn.${entityType}`,
                    },
                },
            },
            has: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.has}`,
                    },
                },
                Participant: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Participant'],
                        $inverse: `edges.${inverseEdges.has}`,
                    },
                },
                Slate: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Slate'],
                        $inverse: `edges.${inverseEdges.has}`,
                    },
                },
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.has.${entityType}`,
                        $omcPredicate: 'hasContext',
                    },
                },
            },
            needs: {
                Effect: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Effect'],
                        $inverse: `edges.${inverseEdges.needs}`,
                    },
                },
                NarrativeAudio: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeAudio'],
                        $inverse: `edges.${inverseEdges.needs}`,
                    },
                },
                NarrativeObject: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeObject'],
                        $inverse: `edges.${inverseEdges.needs}`,
                    },
                },
                NarrativeStyling: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeStyling'],
                        $inverse: `edges.${inverseEdges.needs}`,
                    },
                },
                NarrativeWardrobe: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeWardrobe'],
                        $inverse: `edges.${inverseEdges.needs}`,
                    },
                },
                SpecialAction: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['SpecialAction'],
                        $inverse: `edges.${inverseEdges.needs}`,
                    },
                },
            },
            usedIn: {
                ProductionLocation: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionLocation'],
                        $inverse: `edges.${inverseEdges.usedIn}`,
                    },
                },
            },
            isIn: {
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.has.${entityType}`,
                        $predicate: 'isIn',
                        $omcPredicate: 'isInContext',
                    },
                },
            },
            // This would need to be for every entity

        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            contextType: null,
            contextName: basicName.graphQl.properties,
            contextCategory: null,
            contextProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            contextType: ['string'],
            contextName: basicName.graphQl.filter,
            contextCategory: ['string'],
        },
        inlineFragment: null,
    },
};
