/**
 * Template details for SpecialAction
 */

import { generalConfig } from '../../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'SpecialAction';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        specialActionType: {
            $type: 'string',
        },
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
                $inverse: 'ForEntity',
            },
        },
    },
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
    },
    edges: {
        featuresIn: {
            allowed: ['NarrativeScene'],
        },
        neededBy: {
            allowed: ['Character'],
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            specialActionType: null,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            specialActionType: 'string',
        },
        inlineFragment: null,
    },
};
