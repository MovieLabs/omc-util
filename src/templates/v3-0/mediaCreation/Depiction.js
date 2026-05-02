/**
 * Template details for Depiction
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Depiction';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        depictionType: { $type: 'string' },
        edges: {
            usedIn: {
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                    },
                },
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                // $inverse: 'ForEntity',
            },
        },
        Depicts: {
            $type: 'object',
            $edge: {
                $allowed: ['Character', 'NarrativeObject', 'NarrativeWardrobe', 'NarrativeLocation', 'NarrativeAudio', 'NarrativeStyling'],
                $inverse: 'Depiction',
            },
        },
        Depictor: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset', 'Participant'],
                $inverse: 'Depiction',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            depictionType: null,
            Depicts: {
                Character: null,
                NarrativeLocation: null,
                NarrativeObject: null,
                NarrativeStyling: null,
                NarrativeWardrobe: null,
            },
            Depicter: {
                Participant: null,
                Asset: null,
            },
            Context: null,
        },
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
};
