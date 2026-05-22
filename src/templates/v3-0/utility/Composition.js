/**
 * Template details for Composition
 */
import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName, software } from './utility.js';

const entityType = 'Composition';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        compositionType: { $type: 'string' },
        compositionName: basicName.template,
        compositionProperties: { $type: 'object' },
        software: { ...software.template },
        includes: {
            Asset: {
                $type: 'array',
            },
            AssetSC: {
                $type: 'array',
            },
            Composition: {
                $type: 'array',
            },
        },
        StartHere: {
            $type: 'array',
        },
        Product: {
            $type: 'array',
        },
        // version: null,
        // provenance: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            compositionType: null,
            compositionName: basicName.graphQl.properties,
            compositionProperties: null,
            includes: {
                Asset: null,
            },
            software: software.graphQl.properties,
            StartHere: {
                Asset: null,
                AssetSC: null,
            },
            Product: {
                Asset: null,
            },
            // version: null,
            // provenance: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            compositionName: basicName.graphQl.filter,
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
