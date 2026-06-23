/**
 * Template details for Depiction
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Realization';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        realizationType: { $type: 'string' },
        realizationName: basicName.template,
        realizationProperties: {
            RealizationOf: {
                $type: 'array',
            },
            RealizationBy: {
                $type: 'array',
            },
        },
    },
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
