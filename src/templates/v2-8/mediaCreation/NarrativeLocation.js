/**
 * Template details for NarrativeLocation
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'NarrativeLocation';
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
        Location: {
            $type: 'array',
            $edge: {
                $allowed: ['Location'],
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
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: null,
            Context: null,
            Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
};
