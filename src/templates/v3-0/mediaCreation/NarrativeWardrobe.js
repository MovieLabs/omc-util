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
                $inverse: `edges.isIn.${entityType}`,
                $omcPredicate: 'isInContext',
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
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeWardrobeName: basicName.graphQl.filter,
            narrativeType: 'string',
        },
        inlineFragment: null,
    },
};
