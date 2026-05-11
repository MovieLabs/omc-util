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
            featuresIn: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                    $inverse: `edges.${inverseEdges.featuresIn}.${entityType}`,
                },
            },
            neededBy: {
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.${inverseEdges.neededBy}.${entityType}`,
                    },
                },
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $omcPredicate: 'isInContext',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            specialActionType: null,
            specialActionName: basicName.graphQl.properties,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            specialActionType: 'string',
            specialActionName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
};
