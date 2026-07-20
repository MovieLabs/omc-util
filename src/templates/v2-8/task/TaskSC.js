/**
 * Template details for TaskSC
 */
import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'TaskSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    intrinsic: {},
    edges: {},
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            structuralType: null,
            structuralProperties: null,
            customData: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'tsksc',
};
