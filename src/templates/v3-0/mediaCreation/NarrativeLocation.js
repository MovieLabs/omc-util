/**
 * Template details for NarrativeLocation
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeLocationName: scriptName.template,
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
        Location: {
            $type: 'array',
            $edge: {
                allowed: ['Location'],
            },
        },
        edges: {
            featuresIn: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeType: null,
            narrativeLocationName: scriptName.graphQl.properties,
            Context: null,
            Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
            narrativeLocationName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
