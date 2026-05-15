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
        // No edges for Task - isInputFor, isOutputFor (From)
        // No edges for Concept - isIdeaFor?
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
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isIn.${entityType}`,
                        $omcPredicate: 'isInContext',
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
            productOf: {
                Composition: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Composition'],
                        $inverse: 'Product',
                        $predicate: 'productOf',
                        $omcPredicate: 'isProducedBy',
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
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depictor',
                $omcPredicate: 'hasDepiction',
            },
        },
        Provenance: {
            $type: 'array',
            $edge: {
                $allowed: ['Provenance'],
                $inverse: `edges.for.${entityType}`,
                $omcPredicate: 'anAssetHas.Provenance',
            },
        },
        // version: null,
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
