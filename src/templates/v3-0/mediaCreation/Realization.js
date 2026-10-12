/**
 * Template details for Realization
 *
 * Realization is v3.0's successor to v2.8's Depiction (see the v2-8 -> v3-0 migration, which maps
 * Depiction -> Realization, Depicts -> RealizationOf and Depicter -> RealizedBy).
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Realization';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            realizationType: null,
            realizationName: basicName.graphQl.properties,
            realizationProperties: null,
            RealizationOf: {
                Character: null,
                Effect: null,
                NarrativeAudio: null,
                NarrativeLocation: null,
                NarrativeObject: null,
                NarrativeScene: null,
                NarrativeStyling: null,
                NarrativeWardrobe: null,
                SpecialAction: null,
            },
            RealizedBy: {
                Asset: null,
                Composition: null,
                Participant: null,
                Task: null,
            },
        },
        filter: {
            ...baseEntity.graphQl.filter,
            realizationType: 'string',
            realizationName: basicName.graphQl.filter,
        },
        inlineFragment: {
            RealizationOf: {
                Character: '...on',
                Effect: '...on',
                NarrativeAudio: '...on',
                NarrativeLocation: '...on',
                NarrativeObject: '...on',
                NarrativeScene: '...on',
                NarrativeStyling: '...on',
                NarrativeWardrobe: '...on',
                SpecialAction: '...on',
            },
            RealizedBy: {
                Asset: '...on',
                Composition: '...on',
                Participant: '...on',
                Task: '...on',
            },
        },
    },
};
