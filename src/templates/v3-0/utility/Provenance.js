/**
 * Template details for Provenance
 */

import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName } from './utility.js';

const entityType = 'Provenance';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        provenanceName: basicName.template,
        CreatedBy: {
            $type: 'array',
        },
        createdOn: null,
        Role: {
            $type: 'array',
        },
        Origin: {
            $type: 'array',
        },
        reason: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            provenanceName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            provenanceName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
