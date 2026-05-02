/**
 * Template details for ProductionLocation
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';
import { inverseEdges } from '../inverseEdges.js';

const entityType = 'ProductionLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        locationType: {
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
            Location: {
                $type: 'array',
                $edge: {
                    $allowed: ['Location'],
                },
            },
        },
        edges: {
            usedIn: {
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            locationType: null,
            Context: null,
            Location: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            locationType: 'string',
        },
        inlineFragment: null,
    },
};
