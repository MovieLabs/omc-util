/**
 * Template details for Slate
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Slate';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        slateName: basicName.template,
        cameraLabel: { $type: 'string' },
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
        CreativeWork: {
            $type: 'array',
        },
        Director: {
            $type: 'array',
        },
    },
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
