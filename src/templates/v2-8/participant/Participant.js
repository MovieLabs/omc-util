/**
 * Template details for Participant
 */

import { baseEntity } from '../utility/utility.js';

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
    intrinsic: {
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
            biDirectional: true,
        },
        ParticipantSC: {
            type: 'object',
            allowed: ['Organization', 'Department', 'Person', 'Service'],
        },
        Depiction: {
            type: 'array',
            allowed: ['Depiction'],
            biDirectional: true,
            inverse: 'Depictor',
        },
        assetFC: {
            Role: {
                type: 'array',
                allowed: ['Role'],
            },
        },
    },
    edges: {
        for: {
            allowed: ['Asset', 'Slate'],
        },
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
};
