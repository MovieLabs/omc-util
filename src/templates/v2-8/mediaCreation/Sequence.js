/**
 * Template details for Sequence
 */
import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Sequence';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            sequenceType: null,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
};
