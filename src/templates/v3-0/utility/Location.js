/**
 * Template details for Location
 */

import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName } from './utility.js';

const entityType = 'Location';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        compositionName: basicName.template,
        address: null,
        coordinates: null,
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $omcPredicate: 'isInContext',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            compositionName: basicName.graphQl.properties,
            address: null,
            coordinates: null,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            compositionName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
