/**
 * Template details for Composition
 */
import { baseEntity, software } from './utility.mjs';

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
        Context: null,
        // version: null,
        // provenance: null,
    },
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
        },
        Asset: {
            type: 'array',
            path: 'Asset',
            allowed: ['Asset'],
        },
        AssetSC: {
            type: 'array',
            path: 'AssetSC',
            allowed: ['AssetSC'],
        },
        Composition: {
            type: 'array',
            path: 'Composition',
            allowed: ['Composition'],
        },
        StartHere: {
            type: 'object',
            path: 'StartHere',
            allowed: ['Asset', 'AssetSC'],
        },
    },
    edges: {},
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
