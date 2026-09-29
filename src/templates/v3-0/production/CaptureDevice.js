/**
 * Template details for CaptureDevice
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'CaptureDevice';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            captureDeviceName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.properties,
            captureDeviceName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
