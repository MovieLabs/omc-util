/**
 * Template details for SpecialAction
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'SpecialAction';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        specialActionType: {
            $type: 'string',
        },
        specialActionName: basicName.template,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            specialActionType: null,
            specialActionName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            specialActionType: 'string',
            specialActionName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
