/**
 * Template details for Infrastructure
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        InfrastructureSC: null,
        infrastructureFC: {
            functionalType: null,
            functionalProperties: null,
            // customData: null,
        },
        Infrastructure: null,
        Context: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
        Infrastructure: {
            type: 'array',
            allowed: ['Infrastructure'],
            biDirectional: true,
        },
        InfrastructureSC: {
            type: 'object',
            allowed: ['InfrastructureSC'],
            biDirectional: true,
        },
    },
    edges: {
        has: {
            allowed: ['SpecialAction'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'inf',
};
