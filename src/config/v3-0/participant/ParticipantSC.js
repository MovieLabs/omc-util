/**
 * Template details for ParticipantSC
 */
import { baseEntity } from '../utility/utility.js';

export default {
    properties: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    intrinsic: {},
    edges: {},
};
