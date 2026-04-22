/**
 * Template details for Composition
 */
import { baseEntity, software } from './utility.js';

export default {
    properties: {
        ...baseEntity.properties,
        compositionType: null,
        compositionProperties: null,
        includes: {
            Asset: null,
        },
        software,
        StartHere: {
            Asset: null,
            AssetSC: null,
        },
        Product: {
            Asset: null,
        },
        Context: null,
        // version: null,
        // provenance: null,
    },
    intrinsic: {
        includes: {
            Asset: {
                type: 'array',
                allowed: ['Asset'],
            },
            AssetSC: {
                type: 'array',
                allowed: ['AssetSC'],
            },
            Composition: {
                type: 'array',
                allowed: ['Composition'],
            },
        },
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
        },
        StartHere: {
            type: 'object',
            allowed: ['Asset', 'AssetSC'],
        },
        Product: {
            type: 'array',
            allowed: ['Asset'],
        },
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: {
            StartHere: {
                Asset: '...on',
                AssetSC: '...on',
            },
        },
    },
    idPrefix: 'cmp',
};
