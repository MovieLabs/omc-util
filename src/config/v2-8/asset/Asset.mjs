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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
        Asset: {
            type: 'array',
            path: 'Asset',
            allowed: ['Asset'],
            biDirectional: true,
        },
        AssetSC: {
            type: 'object',
            path: 'AssetSC',
            allowed: ['AssetSC'],
            biDirectional: true,
        },
        Depiction: {
            type: 'array',
            path: 'Depiction',
            allowed: ['Depiction'],
            biDirectional: true,
        },
    },
    edges: {
        for: ['NarrativeScene', 'Composition'],
        has: ['NarrativeScene', 'Participant', 'Slate'],
        usedIn: ['ProductionLocation', 'ProductionScene'],
        productOf: ['Composition'],
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
