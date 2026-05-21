/**
 * Template details for ProductionScene
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'ProductionScene';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        productionSceneName: basicName.template,
        sceneHeader: {
            $type: 'string',
        },
        sceneDescriptor: {
            $type: 'string',
        },
        sceneNumber: {
            $type: 'string',
        },
        edges: {
            for: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                        $predicate: 'for',
                        $omcPredicate: 'aProductionSceneFor',
                    },
                },
            },
            has: {
                Slate: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Slate'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'aProductionSceneHas',
                    },
                },
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isFor.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'hasContext',
                    },
                },
            },
            related: {
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.related}.${entityType}`,
                        $predicate: 'related',
                        $omcPredicate: 'aProductionSceneRelated',
                    },
                },
            },
            uses: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                        $inverse: `edges.${inverseEdges.uses}.${entityType}`,
                        $predicate: 'uses',
                        $omcPredicate: 'aProductionSceneUses',
                    },
                },
                Depiction: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Depiction'],
                        $inverse: `edges.${inverseEdges.uses}.${entityType}`,
                        $predicate: 'Depiction',
                        $omcPredicate: 'N/A',
                    },
                },
                ProductionLocation: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionLocation'],
                        $inverse: `edges.${inverseEdges.uses}.${entityType}`,
                        $predicate: 'ProductionLocation',
                        $omcPredicate: 'N/A',
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            productionSceneName: basicName.graphQl.properties,
            sceneHeader: null,
            sceneDescriptor: null,
            sceneNumber: null,
        },
        filter: {
            ...baseEntity.graphQl.properties,
            productionSceneName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
