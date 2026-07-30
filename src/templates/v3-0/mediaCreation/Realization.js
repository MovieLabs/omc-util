/**
 * Template details for Realization
 *
 * Realization is v3.0's successor to v2.8's Depiction (see the v2-8 -> v3-0 migration, which maps
 * Depiction -> Realization, Depicts -> RealizationOf and Depicter -> RealizationBy).
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
            realizationProperties: {
                RealizationOf: {
                    Character: null,
                    NarrativeLocation: null,
                    NarrativeObject: null,
                    NarrativeStyling: null,
                    NarrativeWardrobe: null,
                },
                RealizationBy: {
                    Participant: null,
                    Asset: null,
                },
            },
        },
        filter: {
            ...baseEntity.graphQl.filter,
            realizationType: 'string',
            realizationName: basicName.graphQl.filter,
        },
        inlineFragment: {
            realizationProperties: {
                RealizationOf: {
                    Character: '...on',
                    NarrativeLocation: '...on',
                    NarrativeObject: '...on',
                    NarrativeStyling: '...on',
                    NarrativeWardrobe: '...on',
                },
                RealizationBy: {
                    Participant: '...on',
                    Asset: '...on',
                    Composition: '...on',
                },
            },
        },
    },
};
