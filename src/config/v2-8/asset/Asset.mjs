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
            // customData: null,
        },
        Asset: null,
        Context: null,
        Depiction: null,
        // version: null,
        // provenance: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: 'ForEntity',
        },
        Asset: {
            type: 'array',
            allowed: ['Asset'],
            biDirectional: true,
        },
        AssetSC: {
            type: 'object',
            allowed: ['AssetSC'],
            biDirectional: true,
        },
        Depiction: {
            type: 'array',
            allowed: ['Depiction'],
            biDirectional: true,
        },
    },
    edges: {
        for: {
            allowed: ['NarrativeScene', 'Composition'],
        },
        has: {
            allowed: ['NarrativeScene', 'Participant', 'Slate'],
        },
        usedIn: {
            allowed: ['ProductionLocation', 'ProductionScene'],
        },
        productOf: {
            allowed: ['Composition'],
        },
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
};
