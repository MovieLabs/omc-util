/**
 * Template details for AssetSC
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName, software } from '../utility/utility.js';

const entityType = 'AssetStructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        assetStructureType: { $type: 'string' },
        assetStructureName: basicName.template,
        assetStructureProperties: { $type: 'object' },
        isAnalog: { $type: 'boolean' },
        software: software.template,
        Carrier: null,
        Provenance: { $type: 'array' },
        // version: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            assetStructureType: null,
            assetStructureName: basicName.graphQl.properties,
            assetStructureProperties: null,
            isAnalog: null,
            software: software.graphQl.properties,
            Carrier: null,
            Provenance: null,
            // version: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            assetStructureType: ['string'],
            assetStructureName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'asts',
};
