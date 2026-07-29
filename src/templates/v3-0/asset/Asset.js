/**
 * Template details for Asset
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Asset';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            assetName: basicName.graphQl.properties,
            AssetStructure: null,
            assetFunction: {
                assetFunctionType: null,
                category: null,
                assetFunctionProperties: null,
            },
            Member: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            assetName: basicName.graphQl.filter,
            assetFunction: {
                assetFunctionType: ['string'],
                category: ['string'],
            },
        },
        inlineFragment: {
            ...baseEntity.graphQl.inlineFragment,
        },
    },
};
