/**
 * Template details for SpecialAction
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'SpecialAction';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        specialActionType: {
            $type: 'string',
        },
        specialActionName: basicName.template,
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
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                    $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                    $predicate: 'featuresIn',
                    $omcPredicate: 'aXFeaturesIn',
                },
            },
            neededBy: {
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.${inverseEdges.neededBy}.${entityType}`,
                        $predicate: 'neededBy',
                        $omcPredicate: 'aXNeededBy',
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            specialActionType: null,
            specialActionName: basicName.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            specialActionType: 'string',
            specialActionName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
