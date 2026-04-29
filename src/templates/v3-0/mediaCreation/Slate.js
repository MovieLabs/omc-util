/**
 * Template details for Slate
 */

import { generalConfig } from '../../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

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
        // Director: null,
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
        Director: {
            type: 'array',
            allowed: ['Participant'],
        },
    },
    edges: {
        has: {
            allowed: ['Infrastructure', 'Participant'],
        },
        for: {
            allowed: ['Asset', 'ProductionScene'],
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
