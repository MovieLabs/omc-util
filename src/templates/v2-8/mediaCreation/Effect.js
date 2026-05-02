/**
 * Template details for Effect
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Effect';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        effectType: { $type: 'string' },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
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
        neededBy: {
            Character: {
                $type: 'string',
                $edge: {
                    $allowed: ['Character'],
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            effectType: null,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
};
