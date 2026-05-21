/**
 * Template details for NarrativeObject
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, scriptName } from '../utility/utility.js';

const entityType = 'NarrativeObject';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeType: {
            $type: 'string',
        },
        narrativeObjectName: scriptName.template,
        quantity: {
            $type: 'string',
        },
        size: {
            $type: 'string',
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
            neededBy: {
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.${inverseEdges.neededBy}.${entityType}`,
                        $predicate: 'neededBy',
                        $omcPredicate: 'neededBy-test',
                    },
                },
            },
        },
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depicts',
                $omcPredicate: 'omc:isDepictedThingOf',
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
                    $inverse: `edges.has.${entityType}`,
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
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
        neededBy: {
            Character: {
                $type: 'array',
                $edge: {
                    $allowed: ['Character'],
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
            narrativeType: 'string',
            narrativeObjectName: scriptName.graphQl.filter,
            quantity: null,
            size: null,
            Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeObjectName: scriptName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
