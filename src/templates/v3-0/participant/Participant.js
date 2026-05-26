/**
 * Template details for Participant
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Participant';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        ParticipantSC: {
            $type: 'array',
        },
        participantFC: {
            functionalType: { $type: 'string' },
            jobTitle: { $type: 'string' },
            Role: {
                $type: 'array',
            },
        },

        // Depiction: {
        //     $type: 'array',
        // },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            ParticipantSC: {
                Organization: null,
                Department: null,
                Person: null,
                Service: null,
            },
            participantFC: {
                functionalType: null,
                jobTitle: null,
                Role: null,
                // customData: null,
            },
            // Depiction: null,
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
