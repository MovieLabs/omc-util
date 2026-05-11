/**
 * Template details for ProductionLocation
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'ProductionLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        locationType: {
            $type: 'string',
        },
        productionLocationName: basicName.template,
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
                $allowed: ['Location'],
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
            productionLocationName: basicName.graphQl.properties,
            Context: null,
            Location: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            locationType: 'string',
            productionLocationName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
