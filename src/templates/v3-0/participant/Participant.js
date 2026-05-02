/**
 * Template details for Participant
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Participant';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        ParticipantSC: {
            $type: 'object',
            $edge: {
                $allowed: ['Organization', 'Department', 'Person', 'Service'],
            },
        },
        participantFC: {
            functionalType: { $type: 'string' },
            jobTitle: { $type: 'string' },
            Role: {
                $type: 'array',
                $edge: {
                    $allowed: ['Role'],
                    $omcPredicate: 'has',
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
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depictor',
                $omcPredicate: 'hasDepiction',
            },
        },
        edges: {
            for: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                    },
                },
                Slate: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Slate'],
                        $inverse: 'Director',
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            ParticipantSC: null,
            participantFC: {
                functionalType: null,
                jobTitle: null,
                Role: null,
                // customData: null,
            },
            Context: null,
            Depiction: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: {
            ParticipantSC: {
                Organization: '...on',
                Department: '...on',
                Person: '...on',
                Service: '...on',
            },
        },
    },
};
