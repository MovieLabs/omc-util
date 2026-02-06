/**
 * Template details for Participant
 */

import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
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
    graphQl: {
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
    idPrefix: 'prt',
};
