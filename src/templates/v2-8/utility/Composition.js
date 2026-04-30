/**
 * Template details for Composition
 */
import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';

import { baseEntity, software } from './utility.js';

const entityType = 'Composition';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        compositionType: { $type: 'string' },
        compositionProperties: { $type: 'object' },
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
        software: software.template,
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
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
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
            // path: 'StartHere',
            allowed: ['Asset', 'AssetSC'],
        },
        Product: {
            type: 'array',
            // path: 'Product',
            allowed: ['Asset'],
            inverse: 'productOf',
        },
    },
    edges: {
        // produces: {
        //     allowed: ['Asset'],
        // },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            compositionType: null,
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
