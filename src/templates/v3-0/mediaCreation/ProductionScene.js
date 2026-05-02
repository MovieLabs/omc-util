/**
 * Template details for ProductionScene
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';
import { inverseEdges } from '../inverseEdges.js';

const entityType = 'ProductionScene';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        sceneName: basicName.template,
        sceneHeader: {
            $type: 'string',
        },
        sceneDescriptor: {
            $type: 'string',
        },
        sceneNumber: {
            $type: 'string',
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
        edges: {
            for: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                    },
                },
            },
            has: {
                Slate: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Slate'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                    },
                },
            },
            related: {
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.related}.${entityType}`,
                    },
                },
            },
            uses: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                        $inverse: `edges.${inverseEdges.uses}.${entityType}`,
                    },
                },
                Depiction: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Depiction'],
                        $inverse: `edges.${inverseEdges.uses}.${entityType}`,
                    },
                },
                ProductionLocation: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionLocation'],
                        $inverse: `edges.${inverseEdges.uses}.${entityType}`,
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            sceneName: basicName.graphQl.properties,
            sceneHeader: null,
            sceneDescriptor: null,
            sceneNumber: null,
        },
        filter: {
            ...baseEntity.graphQl.properties,
            sceneName: {
                fullName: ['string'],
                altName: ['string'],
            },
        },
        inlineFragment: null,
    },
};
