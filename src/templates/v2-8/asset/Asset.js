/**
 * Template details for Asset
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Asset';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        AssetSC: {
            $type: 'object',
            $edge: {
                $allowed: ['AssetSC'],
            },
        },
        assetFC: {
            functionalType: { $type: 'string' },
            functionalProperties: { $type: 'object' },
        },
        Asset: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset'],
                // $inverse: '',
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depictor',
                $omcPredicate: 'hasDepiction',
            },
        },
        // version: null,
        // provenance: null,
    },
    cxtEdges: {
        for: {
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                },
            },
            Composition: {
                $type: 'array',
                $edge: {
                    $allowed: ['Composition'],
                },
            },
        },
        has: {
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                },
            },
            Participant: {
                $type: 'array',
                $edge: {
                    $allowed: ['Participant'],
                },
            },
            Slate: {
                $type: 'array',
                $edge: {
                    $allowed: ['Slate'],
                },
            },
        },
        usedIn: {
            ProductionLocation: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionLocation'],
                },
            },
            ProductionScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionScene'],
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            AssetSC: null,
            assetFC: {
                functionalProperties: null,
                functionalType: null,
                // customData: null,
            },
            Asset: null,
            Context: {
                type: 'array',
                intrinsic: {
                    allowed: ['Context'],
                    biDirectional: true,
                    inverse: 'ForEntity',
                },
            },
            Depiction: {
                type: 'array',
                intrinsic: {
                    allowed: ['Depiction'],
                    biDirectional: true,
                    inverse: 'Depictor',
                    omcPredicate: 'hasDepiction',
                },
            },
            // version: null,
            // provenance: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            assetFC: {
                functionalType: ['string'],
            },
        },
        inlineFragment: null,
    },
};
