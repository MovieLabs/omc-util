/**
 * Template details for Slate
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';
import { inverseEdges } from '../../v3-0/index.js';

const entityType = 'Slate';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        slateUID: {
            $type: 'string',
        },
        cameraLabel: {
            $type: 'string',
        },
        cameraUnit: {
            $type: 'string',
        },
        cameraRoll: {
            $type: 'string',
        },
        soundRoll: {
            $type: 'string',
        },
        shootDate: {
            $type: 'string',
        },
        shootDay: {
            $type: 'string',
        },
        recordingFPS: {
            $type: 'string',
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
        // CreativeWork: null,
        Director: {
            $type: 'array',
            $edge: {
                $allowed: ['Participant'],
            },
        },
    },
    cxtEdges: {
        has: {
            Infrastructure: {
                $type: 'array',
                $edge: {
                    $allowed: ['Infrastructure'],
                },
            },
            Participant: {
                $type: 'array',
                $edge: {
                    $allowed: ['Participant'],
                },
            },
        },
        for: {
            Asset: {
                $type: 'array',
                $edge: {
                    $allowed: ['Asset'],
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
            slateUID: null,
            cameraLabel: null,
            cameraUnit: null,
            cameraRoll: null,
            soundRoll: null,
            shootDate: null,
            shootDay: null,
            recordingFPS: null,
            Context: null,
            CreativeWork: null,
            Director: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            slateUID: ['String'],
        },
        inlineFragment: null,
    },
};
