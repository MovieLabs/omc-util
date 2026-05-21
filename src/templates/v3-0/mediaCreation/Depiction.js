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
            has: {
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isFor.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'N/A',
                    },
                },
            },
            usedIn: {
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.usedIn}.${entityType}`,
                        $predicate: 'usedIn',
                        $omcPredicate: 'omcT:aDepictionUsedIn.ProductionScene',
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
                        $omcPredicate: 'N/A',
                    },
                },
            },
        },
        Depicts: {
            $type: 'object',
            $edge: {
                $allowed: ['Character', 'NarrativeObject', 'NarrativeWardrobe', 'NarrativeLocation', 'NarrativeAudio', 'NarrativeStyling'],
                $inverse: 'Depiction',
                $predicate: 'Depicts',
                $omcPredicate: 'omcT:aDepictionDepicts.NarrativeObject',
            },
        },
        Depicter: {
            $type: 'array',
            $edge: {
                $allowed: ['Asset', 'Participant', 'Composition'],
                $inverse: 'Depiction',
                $predicate: 'Depicter',
                $omcPredicate: 'omcT:aDepictionDepicter.ProductionObject',
            },
        },
    },
    cxtEdges: {
        isIn: {
            Context: {
                $type: 'array',
                $edge: {
                    $allowed: ['Context'],
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
        usedIn: {
            ProductionScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionScene'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
        uses: {
            Asset: {
                $type: 'array',
                $edge: {
                    $allowed: ['Asset'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
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
