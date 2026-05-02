/**
 * Template details for NarrativeAudio
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'NarrativeAudio';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        edges: {
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
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: 'string',
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
