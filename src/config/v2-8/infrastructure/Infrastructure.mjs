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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
    },
    edges: {
        has: ['SpecialAction'],
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'inf',
};
