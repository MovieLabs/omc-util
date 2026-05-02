/**
 * Template details for Infrastructure
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Infrastructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        InfrastructureSC: {
            $type: 'object',
            $edge: {
                $allowed: ['InfrastructureSC'],
            },
        },
        infrastructureFC: {
            functionalType: null,
            functionalProperties: null,
            // customData: null,
        },
        Infrastructure: {
            $type: 'array',
            $edge: {
                $allowed: ['Infrastructure'],
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            InfrastructureSC: null,
            infrastructureFC: {
                functionalType: null,
                functionalProperties: null,
                // customData: null,
            },
            Infrastructure: null,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'inf',
};
