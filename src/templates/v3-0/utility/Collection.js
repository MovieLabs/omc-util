/**
 * Template details for Collection
 */
import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName, software } from './utility.js';

const entityType = 'Collection';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            collectionName: basicName.graphQl.properties,
            collectionType: null,
            collectionProperties: null,
            includes: {
                Asset: null,
                AssetStructure: null,
                CaptureDevice: null,
                CaptureEvent: null,
                CapturePoint: null,
                Character: null,
                Collection: null,
                Composition: null,
                CreativeWork: null,
                Effect: null,
                Infrastructure: null,
                Location: null,
                NarrativeAudio: null,
                NarrativeLocation: null,
                NarrativeObject: null,
                NarrativeScene: null,
                NarrativeStyling: null,
                NarrativeWardrobe: null,
                Participant: null,
                ParticipantStructure: null,
                ProductionLocation: null,
                ProductionScene: null,
                Provenance: null,
                Realization: null,
                Role: null,
                Slate: null,
                SpecialAction: null,
                Task: null,
                TaskStructure: null,
            },
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
