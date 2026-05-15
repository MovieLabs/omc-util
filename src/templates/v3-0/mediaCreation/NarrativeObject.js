/**
 * Template details for NarrativeObject
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeObject';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeObjectName: scriptName.template,
        quantity: {
            $type: 'string',
        },
        size: {
            $type: 'string',
        },
        edges: {
            has: {
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isIn.${entityType}`,
                        $omcPredicate: 'isInContext',
                    },
                },
            },
            featuresIn: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                    $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                },
            },
            neededBy: {
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.${inverseEdges.neededBy}.${entityType}`,
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
            narrativeType: 'string',
            narrativeObjectName: scriptName.graphQl.filter,
            quantity: null,
            size: null,
            Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeObjectName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
