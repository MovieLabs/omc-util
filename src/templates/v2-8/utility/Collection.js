/**
 * Template details for Collection
 */
import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';

import { baseEntity, software } from './utility.js';

const entityType = 'Collection';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            collectionType: null,
            collectionProperties: null,
            software: software.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'col',
};
