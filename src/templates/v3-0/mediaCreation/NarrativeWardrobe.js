/**
 * Template details for NarrativeWardrobe
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'NarrativeWardrobe';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeWardrobeName: basicName.template,
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
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depicts',
                $omcPredicate: 'hasDepiction',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: null,
            narrativeWardrobeName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeWardrobeName: basicName.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
};
