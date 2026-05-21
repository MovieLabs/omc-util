/**
 * Template details for NarrativeLocation
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeLocation';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeLocationName: scriptName.template,
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depicts',
                $predicate: 'Depiction',
                $omcPredicate: 'omc:isDepictedThingOf',
            },
        },
        Location: {
            $type: 'array',
            $edge: {
                allowed: ['Location'],
                $predicate: 'Location',
                $omcPredicate: 'aNarrativeLocationHas',
            },
        },
        edges: {
            has: {
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isFor.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'hasContext',
                    },
                },
            },
            featuresIn: {
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                        $predicate: 'featuresIn',
                        $omcPredicate: 'featuresIn',
                    },
                },
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
        has: {
            Context: {
                $type: 'array',
                $edge: {
                    $allowed: ['Context'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
        featuresIn: {
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
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
            narrativeType: null,
            narrativeLocationName: scriptName.graphQl.properties,
            Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeType: 'string',
            narrativeLocationName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
