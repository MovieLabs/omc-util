/**
 * Template details for TaskSC
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        structuralType: null,
        structuralProperties: null,
        customData: null,
    },
    intrinsicProps: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'tsksc',
};
