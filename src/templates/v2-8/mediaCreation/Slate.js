/**
 * Template details for Slate
 */

import { inverseEdges } from '../../v3-0/index.js';
import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Slate';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
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
