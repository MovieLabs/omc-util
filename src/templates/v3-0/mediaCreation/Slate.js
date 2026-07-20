/**
 * Template details for Slate
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Slate';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            slateName: null,
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
            slateName: {
                fullName: ['string'],
                altName: ['string'],
            },
        },
        inlineFragment: null,
    },
};
