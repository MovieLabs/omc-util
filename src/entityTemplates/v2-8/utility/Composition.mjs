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
