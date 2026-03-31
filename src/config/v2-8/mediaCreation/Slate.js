/**
 * Template details for Slate
 */

import { baseEntity } from '../utility/utility.js';

export default {
    properties: {
        ...baseEntity.properties,
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
        filter: {
            ...baseEntity.graphQl.filter,
            slateUID: ['String'],
        },
        inlineFragment: null,
    },
    idPrefix: 'slt',
};
