/**
 * Template details for Slate
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Slate';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            slateName: basicName.graphQl.properties,
            cameraLabel: null,
            cameraUnit: null,
            cameraRoll: null,
            soundRoll: null,
            shootDate: null,
            shootDay: null,
            recordingFPS: null,
            CreativeWork: null,
            Director: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            slateName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
