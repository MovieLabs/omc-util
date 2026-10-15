/**
 * Template details for AssetSC
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'AssetStructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            assetStructureType: null,
            assetStructureName: basicName.graphQl.properties,
            assetStructureProperties: null,
            versionInfo: {
                versionNumber: null,
                Revision: null,
                RevisionOf: null,
                Derivation: null,
                DerivationOf: null,
                Representation: null,
                RepresentationOf: null,
            },
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
