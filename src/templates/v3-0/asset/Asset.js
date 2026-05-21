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
                $predicate: 'AssetSC',
                $omcPredicate: 'omc:hasAssetStructuralCharacteristic',
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
                Participant: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Participant'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'N/A',
                    },
                },
                Slate: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Slate'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'omcT:anAssetHas.Slate',
                    },
                },
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isIn.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'N/A',
                    },
                },
            },
            usedIn: {
                ProductionLocation: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionLocation'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                        $predicate: 'usedIn',
                        $omcPredicate: 'N/A',

                    },
                },
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                        $predicate: 'usedIn',
                        $omcPredicate: 'N/A',
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
                        $omcPredicate: 'omc-legacy:isProducedBy.Composition',
                    },
                },
            },
        },
        Member: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset'],
                $inverse: `edges.memberOf.${entityType}`,
                $omcPredicate: 'omcT:anAssetIsMemberOf.AssetGroup',
            },
        },
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depictor',
                $omcPredicate: 'omc:hasDepiction',
            },
        },
        Provenance: {
            $type: 'array',
            $edge: {
                $allowed: ['Provenance'],
                $inverse: `edges.for.${entityType}`,
                $omcPredicate: 'omcT:anAssetHas.Provenance',
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
