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
        // edges: {
        //     for: {
        //         NarrativeScene: {
        //             $type: 'array',
        //             $edge: {
        //                 $allowed: ['NarrativeScene'],
        //                 $inverse: `edges.${inverseEdges.for}.${entityType}`,
        //             },
        //         },
        //         Composition: {
        //             $type: 'array',
        //             $edge: {
        //                 $allowed: ['Composition'],
        //                 $inverse: `edges.${inverseEdges.for}.${entityType}`,
        //             },
        //         },
        //     },
        //     has: {
        //         NarrativeScene: {
        //             $type: 'array',
        //             $edge: {
        //                 $allowed: ['NarrativeScene'],
        //                 $inverse: `edges.${inverseEdges.has}.${entityType}`,
        //             },
        //         },
        //         Participant: {
        //             $type: 'array',
        //             $edge: {
        //                 $allowed: ['Participant'],
        //                 $inverse: `edges.${inverseEdges.has}.${entityType}`,
        //             },
        //         },
        //         Slate: {
        //             $type: 'array',
        //             $edge: {
        //                 $allowed: ['Slate'],
        //                 $inverse: `edges.${inverseEdges.has}.${entityType}`,
        //             },
        //         },
        //     },
        //     usedIn: {
        //         ProductionLocation: {
        //             $type: 'array',
        //             $edge: {
        //                 $allowed: ['ProductionLocation'],
        //                 $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
        //             },
        //         },
        //         ProductionScene: {
        //             $type: 'array',
        //             $edge: {
        //                 $allowed: ['ProductionScene'],
        //                 $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
        //             },
        //         },
        //     },
        // },
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
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            biDirectional: true,
            inverse: 'ForEntity',
            predicate: '',
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
