/**
 * Template details for SpecialAction
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        specialActionType: null,
        Context: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            specialActionType: 'string',
        },
        inlineFragment: null,
    },
    idPrefix: 'sact',
};
