/**
 * Template details for ProductionLocation
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'ProductionLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        productionLocationType: { $type: 'string', $default: 'productionLocation' },
        productionLocationProperties: { $type: 'string' },
        productionLocationName: basicName.template,
        Location: { $type: 'array' },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            productionLocationType: null,
            productionLocationProperties: null,
            productionLocationName: basicName.graphQl.properties,
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
