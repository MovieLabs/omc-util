/**
 * Template details for Infrastructure
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Infrastructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        infrastructureName: basicName.template,
        infrastructureFC: {
            functionalType: { $type: 'string' },
            functionalProperties: { $type: 'string' },
            // customData: null,
        },
        InfrastructureSC: {
            $type: 'array',
        },
        Member: {
            $type: 'array',
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            infrastructureName: basicName.graphQl.properties,
            InfrastructureSC: null,
            infrastructureFC: {
                functionalType: null,
                functionalProperties: null,
                // customData: null,
            },
            Member: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            infrastructureName: basicName.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'inf',
};
