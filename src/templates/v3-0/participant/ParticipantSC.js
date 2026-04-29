/**
 * Template details for ParticipantSC
 */
import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'ParticipantSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    intrinsic: {},
    edges: {},
};
