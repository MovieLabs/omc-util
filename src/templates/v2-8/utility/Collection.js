/**
 * Template details for Collection
 */
import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';

import { baseEntity, software } from './utility.js';

const entityType = 'Collection';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        collectionType: { $type: 'string' },
        collectionProperties: { $type: 'object' },
        software: software.template,
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
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
        properties: {
            ...baseEntity.graphQl.properties,
            collectionType: null,
            collectionProperties: null,
            software: software.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'col',
};
