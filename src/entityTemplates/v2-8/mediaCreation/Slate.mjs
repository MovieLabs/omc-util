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
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            slateUID: ['String'],
        },
        inlineFragment: null,
    },
    idPrefix: 'slt',
};
