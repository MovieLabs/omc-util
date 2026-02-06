/**
 * Template details for Asset
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        AssetSC: null,
        assetFC: {
            functionalProperties: null,
            functionalType: null,
            // functionalProperties: null,
            // customData: null,
        },
        Asset: null,
        Context: null,
        Depiction: null,
        // version: null,
        // provenance: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            assetFC: {
                functionalType: ['string'],
            },
        },
        inlineFragment: null,
    },
    idPrefix: 'ast',
};
