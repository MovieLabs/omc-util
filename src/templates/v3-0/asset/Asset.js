/**
 * Template details for Asset
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

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
            // customData: null,
        },
        assetName: basicName.template,
        edges: {
            for: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                    },
                },
                Composition: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Composition'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                    },
                },
            },
            has: {
                // NarrativeScene: {
                //     $type: 'array',
                //     $edge: {
                //         $allowed: ['NarrativeScene'],
                //         $inverse: `edges.${inverseEdges.has}.${entityType}`,
                //     },
                // },
                Participant: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Participant'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                    },
                },
                Slate: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Slate'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $omcPredicate: 'anAssetHas',
                    },
                },
            },
            usedIn: {
                ProductionLocation: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionLocation'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                    },
                },
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                    },
                },
            },
        },
        Member: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset'],
                $inverse: `edges.memberOf.${entityType}`,
                $omcPredicate: 'isMemberOf',
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
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            assetName: basicName.graphQl.properties,
            AssetSC: null,
            assetFC: {
                functionalProperties: null,
                functionalType: null,
                // customData: null,
            },
            Member: null,
            Context: null,
            Depiction: null,
            // version: null,
            // provenance: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            assetName: basicName.graphQl.filter,
            assetFC: {
                functionalType: ['string'],
            },
        },
        inlineFragment: {
            ...baseEntity.graphQl.inlineFragment,
        },
    },
};
