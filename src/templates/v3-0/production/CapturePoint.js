/**
 * Template details for CapturePoint
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'CapturePoint';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            capturePointName: basicName.graphQl.properties,
            CaptureDevice: null,
            ProductionScene: null,
            CaptureEvent: null,
            Capture: null,
        },
        filter: {
            ...baseEntity.graphQl.properties,
            capturePointName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
