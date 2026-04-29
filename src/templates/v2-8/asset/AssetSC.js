/**
 * Template details for AssetSC
 */

import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'AssetSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: { $type: 'string' },
        structuralProperties: { $type: 'object' },
        isAnalog: { $type: 'boolean' },
        // software: utility.software,
        // Carrier: null,
        // version: null,
        // provenance: null,
    },
    intrinsic: {},
    edges: {},
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            structuralType: null,
            structuralProperties: null,
            isAnalog: null,
            // software: utility.software,
            Carrier: null,
            // version: null,
            // provenance: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            structuralType: ['string'],
        },
        inlineFragment: null,
    },
    idPrefix: 'astsc',
};
