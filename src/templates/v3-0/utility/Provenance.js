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
        CreatedBy: null,
        createdOn: null,
        Role: null,
        Origin: null,
        reason: null,
        edges: {
            has: {
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isIn.${entityType}`,
                        $omcPredicate: 'isInContext',
                    },
                },
            },
        },
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
