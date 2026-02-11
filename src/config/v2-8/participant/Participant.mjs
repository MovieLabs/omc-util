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
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
        ParticipantSC: {
            type: 'object',
            path: 'ParticipantSC',
            allowed: ['Organization', 'Department', 'Person', 'Service'],
        },
        Role: {
            type: 'array',
            path: 'assetFC.Role',
            allowed: ['Role'],
        },
    },
    edges: {
        for: ['Asset', 'Slate'],
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
