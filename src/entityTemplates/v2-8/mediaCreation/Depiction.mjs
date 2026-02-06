/**
 * Template details for Depiction
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        depictionType: null,
        Depicts: null,
        Depicter: null,
        Context: null,
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
            depictionType: 'string',
        },
        inlineFragment: {
            Depicts: {
                Character: '...on',
                NarrativeLocation: '...on',
                NarrativeObject: '...on',
                NarrativeStyling: '...on',
                NarrativeWardrobe: '...on',
            },
            Depicter: {
                Participant: '...on',
                Asset: '...on',
            },
        },
    },
    idPrefix: 'dpc',
};
