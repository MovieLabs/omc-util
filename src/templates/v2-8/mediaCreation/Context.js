/**
 * Template details for Context
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Context';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral,
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            contextType: null,
            contextCategory: null,
            contextProperties: null,
            ForEntity: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            contextType: ['string'],
            contextCategory: ['string'],
        },
        inlineFragment: null,
    },
};
