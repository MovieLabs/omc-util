/**
 * Template details for Collection
 */
import { baseEntity, software } from './utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        collectionType: null,
        collectionProperties: null,
        software,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'col',
};
