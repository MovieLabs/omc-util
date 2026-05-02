/**
 * Template details for Context
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Context';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
    template: {
        ...baseEntity.template,
        contextType: {
            $type: 'string',
        },
        contextCategory: {
            $type: 'string',
        },
        contextProperties: {
            $type: 'object',
        },
        edges: {
            for: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.for}`,
                    },
                },
            },
            featuresIn: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.featuresIn}`,
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
            isFor: {
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                    },
                },
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            contextType: null,
            contextCategory: null,
            contextProperties: null,
            ForEntity: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            contextType: ['string'],
            contextCategory: ['string'],
        },
        inlineFragment: null,
    },
};
