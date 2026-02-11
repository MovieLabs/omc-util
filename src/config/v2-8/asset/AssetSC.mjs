/**
 * Template details for AssetSC
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        structuralType: null,
        structuralProperties: null,
        isAnalog: null,
        // software: utility.software,
        Carrier: null,
        // version: null,
        // provenance: null,
    },
    intrinsicProps: {},
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            structuralType: ['string'],
        },
        inlineFragment: null,
    },
    idPrefix: 'astsc',
};
