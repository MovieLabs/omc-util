/**
 * Template details for Person
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, gender, contact } from '../utility/utility.js';

const entityType = 'ParticipantStructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            participantStructureType: null,
            participantStructureName: {
                fullName: null,
            },
            participantStructureProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            participantStructureType: ['string'],
        },
        inlineFragment: null,
    },
    idPrefix: 'psn',
};
