/**
 * Template details for NarrativeStyling
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'NarrativeStyling';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeStylingName: basicName.template,
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
                        $omcPredicate: 'featuresIn',
                    },
                },
            },
            neededBy: {
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.${inverseEdges.neededBy}.${entityType}`,
                        $predicate: 'neededBy',
                        $omcPredicate: 'neededBy',
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
                $omcPredicate: 'hasDepiction',
            },
        },
    },
    cxtEdges: {
        isIn: {
            Context: {
                $type: 'array',
                $edge: {
                    $allowed: ['Context'],
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
        has: {
            Context: {
                $type: 'array',
                $edge: {
                    $allowed: ['Context'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
        featuresIn: {
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
        neededBy: {
            Character: {
                $type: 'array',
                $edge: {
                    $allowed: ['Character'],
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
            narrativeType: null,
            narrativeStylingName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
            narrativeStyling: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
