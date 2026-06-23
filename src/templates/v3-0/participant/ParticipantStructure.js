/**
 * Template details for Person
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, gender, contact } from '../utility/utility.js';

const entityType = 'ParticipantStructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        participantStructureType: { $type: 'string' },
        participantStructureName: {
            fullName: { $type: 'string' },
        },
        participantStructureProperties: {
            jobTitle: { $type: 'string' },
            gender: gender.template,
            contact: contact.template,
            Location: {
                $type: 'array',
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            participantStructureType: null,
            participantStructureName: {
                fullName: null,
            },
            participantStructureProperties: {
                jobTitle: null,
                gender: gender.graphQl.properties,
                contact: contact.graphQl.properties,
                Location: null,
            },
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'psn',
};
