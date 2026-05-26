/**
 * Template details for AssetSC
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName, software } from '../utility/utility.js';

const entityType = 'AssetSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        structuralType: { $type: 'string' },
        assetSCName: basicName.template,
        structuralProperties: { $type: 'object' },
        isAnalog: { $type: 'boolean' },
        software: software.template,
        Carrier: null,
        Provenance: { $type: 'array' },
        // version: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            structuralType: null,
            assetSCName: basicName.graphQl.properties,
            structuralProperties: null,
            isAnalog: null,
            software: software.graphQl.properties,
            Carrier: null,
            Provenance: null,
            // version: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            structuralType: ['string'],
            assetSCName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'astsc',
};
