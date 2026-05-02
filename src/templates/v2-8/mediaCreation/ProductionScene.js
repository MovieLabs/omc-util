/**
 * Template details for ProductionScene
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';
import { inverseEdges } from '../../v3-0/index.js';

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
    },
    cxtEdges: {
        for: {
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                },
            },
        },
        has: {
            Slate: {
                $type: 'array',
                $edge: {
                    $allowed: ['Slate'],
                },
            },
        },
        related: {
            ProductionScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionScene'],
                },
            },
        },
        uses: {
            Asset: {
                $type: 'array',
                $edge: {
                    $allowed: ['Asset'],
                },
            },
            Depiction: {
                $type: 'array',
                $edge: {
                    $allowed: ['Depiction'],
                },
            },
            ProductionLocation: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionLocation'],
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
