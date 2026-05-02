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
    template: {
        ...baseEntity.template,
        contextType: {
            $type: 'string',
        },
        contextCategory: {
            $type: 'string',
        },
        contextProperties: {
            $type: 'object',
        },
        ForEntity: {
            $type: 'array',
            $edge: {
                $allowed: [
                    'Asset',
                    'Character',
                    'CreativeWork',
                    'Context',
                    'Depiction',
                    'Effect',
                    'Collection',
                    'Composition',
                    'Location',
                    'NarrativeAudio',
                    'NarrativeScene',
                    'NarrativeLocation',
                    'NarrativeObject',
                    'NarrativeStyling',
                    'NarrativeWardrobe',
                    'Participant',
                    'ProductionLocation',
                    'ProductionScene',
                    'Slate',
                    'SpecialAction',
                ],
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
    },
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
