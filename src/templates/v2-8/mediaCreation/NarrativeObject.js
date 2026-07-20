/**
 * Template details for NarrativeObject
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'NarrativeObject';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
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
            narrativeType: 'string',
            quantity: null,
            size: null,
            Context: null,
            Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
};
