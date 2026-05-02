/**
 * Template details for SpecialAction
 */

import { generalConfig } from '../generalConfig.js';
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
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
    },
    cxtEdges: {
        featuresIn: {
            $type: 'array',
            $edge: {
                $allowed: ['NarrativeScene'],
            },
        },
        neededBy: {
            Character: {
                $type: 'array',
                $edge: {
                    $allowed: ['Character'],
                },
            },
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
