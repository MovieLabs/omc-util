/**
 * Template details for Effect
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'Effect';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        effectType: { $type: 'string' },
        effectName: scriptName.template,
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
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                    },
                },
            },
            neededBy: {
                Character: {
                    $type: 'string',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.${inverseEdges.neededBy}.${entityType}`,
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            effectName: scriptName.graphQl.properties,
            effectType: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            effectName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
