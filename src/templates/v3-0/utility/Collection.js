/**
 * Template details for Collection
 */
import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName, software } from './utility.js';

const entityType = 'Collection';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        collectionType: { $type: 'string', $default: 'collection' },
        collectionName: basicName.template,
        collectionProperties: { $type: 'object' },
        software: software.template,
        includes: {
            Asset: {
                $type: 'array',
            },
            AssetStructure: {
                $type: 'array',
            },
            Character: {
                $type: 'array',
            },
            CreativeWork: {
                $type: 'array',
            },
            Realization: {
                $type: 'array',
            },
            Effect: {
                $type: 'array',
            },
            NarrativeAudio: {
                $type: 'array',
            },
            NarrativeLocation: {
                $type: 'array',
            },
            NarrativeScene: {
                $type: 'array',
            },
            NarrativeObject: {
                $type: 'array',
            },
            NarrativeStyling: {
                $type: 'array',
            },
            NarrativeWardrobe: {
                $type: 'array',
            },
            ProductionScene: {
                $type: 'array',
            },
            ProductionLocation: {
                $type: 'array',
            },
            Slate: {
                $type: 'array',
            },
            Infrastructure: {
                $type: 'array',
            },
            InfrastructureStructure: {
                $type: 'array',
            },
            SpecialAction: {
                $type: 'array',
            },
            Collection: {
                $type: 'array',
            },
            Composition: {
                $type: 'array',
            },
            Location: {
                $type: 'array',
            },
            Participant: {
                $type: 'array',
            },
            ParticipantStructure: {
                $type: 'array',
            },
        },

    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            collectionName: basicName.graphQl.properties,
            collectionType: null,
            collectionProperties: null,
            software: software.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            collectionName: basicName.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'col',
};
