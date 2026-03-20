/**
 * Template details for Collection
 */
import { baseEntity, software } from './utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        collectionType: null,
        collectionProperties: null,
        software,
    },
    intrinsic: {
        includes: {
            Asset: {
                type: 'array',
                allowed: ['Asset'],
            },
            AssetSC: {
                type: 'array',
                allowed: ['AssetSC'],
            },
            Character: {
                type: 'array',
                allowed: ['Character'],
            },
            CreativeWork: {
                type: 'array',
                allowed: ['CreativeWork'],
            },
            Depiction: {
                type: 'array',
                allowed: ['Depiction'],
            },
            Effect: {
                type: 'array',
                allowed: ['Effect'],
            },
            NarrativeAudio: {
                type: 'array',
                allowed: ['NarrativeAudio'],
            },
            NarrativeLocation: {
                type: 'array',
                allowed: ['NarrativeLocation'],
            },
            NarrativeScene: {
                type: 'array',
                allowed: ['NarrativeScene'],
            },
            NarrativeObject: {
                type: 'array',
                allowed: ['NarrativeObject'],
            },
            NarrativeStyling: {
                type: 'array',
                allowed: ['NarrativeStyling'],
            },
            NarrativeWardrobe: {
                type: 'array',
                allowed: ['NarrativeWardrobe'],
            },
            ProductionScene: {
                type: 'array',
                allowed: ['ProductionScene'],
            },
            ProductionLocation: {
                type: 'array',
                allowed: ['ProductionLocation'],
            },
            Slate: {
                type: 'array',
                allowed: ['Slate'],
            },
            Infrastructure: {
                type: 'array',
                allowed: ['Infrastructure'],
            },
            SpecialAction: {
                type: 'array',
                allowed: ['SpecialAction'],
            },
            Collection: {
                type: 'array',
                allowed: ['Collection'],
            },
            Composition: {
                type: 'array',
                allowed: ['Composition'],
            },
            Location: {
                type: 'array',
                allowed: ['Location'],
            },
            Participant: {
                type: 'array',
                allowed: ['Participant'],
            },
        },
        Context: {
            type: 'array',
            allowed: ['Context'],
            inverse: 'ForEntity',
        },
    },
    edges: {},
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'col',
};
