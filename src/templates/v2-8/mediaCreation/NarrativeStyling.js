/**
 * Template details for NarrativeStyling
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'NarrativeStyling';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
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
            $type: 'array',
            $edge: {
                $allowed: ['NarrativeScene'],
            },
        },
        neededBy: {
            Character: {
                $type: 'array',
                $edge: {
                    $allowed: ['Character'],
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: null,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
};
