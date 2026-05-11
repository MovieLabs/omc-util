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
                $edge: {
                    $allowed: ['Asset'],
                },
            },
            AssetSC: {
                $type: 'array',
                $edge: {
                    $allowed: ['AssetSC'],
                },
            },
            Composition: {
                $type: 'array',
                $edge: {
                    $allowed: ['Composition'],
                },
            },
        },
        StartHere: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset', 'AssetSC'],
            },
        },
        Product: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset'],
                $inverse: `edges.productOf.${entityType}`,
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $omcPredicate: 'isInContext',
            },
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
            Context: null,
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
