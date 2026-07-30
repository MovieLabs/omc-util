/**
 * Template details for Participant
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'Participant';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            ParticipantStructure: null,
            participantFunction: {
                participantFunctionType: null,
                participantFunctionProperties: null,
                jobTitle: null,
                Role: null,
            },
        },
        filter: {
            ...baseEntity.graphQl.filter,
            participantFunction: {
                participantFunctionType: ['string'],
            },
        },
        inlineFragment: {
            ...baseEntity.graphQl.inlineFragment,
        },
    },
};
