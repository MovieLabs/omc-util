/**
 * Template details for Slate
 */

import { baseEntity } from '../utility/utility.mjs';

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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
    },
    edges: {
        has: ['Infrastructure', 'Participant'],
        for: ['Asset', 'ProductionScene'],
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
