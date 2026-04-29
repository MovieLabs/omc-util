/**
 * Template details for InfrastructureSC
 */

import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'InfrastructureSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: null,
        structuralProperties: null,
    },
    intrinsic: {},
    edges: {},
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            structuralType: null,
            structuralProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'infsc',
};
