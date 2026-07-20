/**
 * Template details for ProductionLocation
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'ProductionLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    cxtEdges: {
        usedIn: {
            $type: 'array',
            $edge: {
                $allowed: ['ProductionScene'],
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
