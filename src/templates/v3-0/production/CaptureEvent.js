/**
 * Template details for CaptureEvent
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'CaptureEvent';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            captureEventName: basicName.graphQl.properties,
            CapturePoint: null,
            ProductionScene: null,
            startDate: null,
            endDate: null,
        },
        filter: {
            ...baseEntity.graphQl.properties,
            captureEventName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
