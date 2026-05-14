/**
 * Template details for Depiction
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Depiction';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        depictionType: { $type: 'string' },
        depictionName: basicName.template,
        edges: {
            usedIn: {
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                        $predicate: 'usedIn',
                        $omcPredicate: 'usedIn',
                    },
                },
            },
            uses: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                        $predicate: 'uses',
                        $omcPredicate: 'usesProduction...',
                    },
                },
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $predicate: 'Context',
                $omcPredicate: 'isInContext',
            },
        },
        Depicts: {
            $type: 'object',
            $edge: {
                $allowed: ['Character', 'NarrativeObject', 'NarrativeWardrobe', 'NarrativeLocation', 'NarrativeAudio', 'NarrativeStyling'],
                $inverse: 'Depiction',
                $predicate: 'Depicts',
                $omcPredicate: 'depicts',
            },
        },
        Depicter: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset', 'Participant', 'Composition'],
                $inverse: 'Depiction',
                $predicate: 'Depicter',
                $omcPredicate: 'isDepictedBy',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            depictionType: null,
            depictionName: basicName.graphQl.properties,
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
            depictionName: basicName.graphQl.filter,
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
