/**
 * Template details for Context
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Context';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
    template: {
        ...baseEntity.template,
        contextType: {
            $type: 'string',
        },
        contextName: basicName.template,
        contextCategory: {
            $type: 'string',
        },
        contextProperties: {
            $type: 'object',
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            contextType: null,
            contextName: basicName.graphQl.properties,
            contextCategory: null,
            contextProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            contextType: ['string'],
            contextName: basicName.graphQl.filter,
            contextCategory: ['string'],
        },
        inlineFragment: null,
    },
};
