/**
 * Template details for ProductionScene
 */

import { generalConfig } from '../../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

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
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
    },
    edges: {
        for: {
            allowed: ['NarrativeScene'],
        },
        has: {
            allowed: ['Slate'],
        },
        related: {
            allowed: ['ProductionScene'],
        },
        uses: {
            allowed: ['Asset', 'Depiction', 'ProductionLocation'],
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
