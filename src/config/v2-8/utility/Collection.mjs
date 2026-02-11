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
    intrinsicProps: {
        Asset: {
            type: 'array',
            path: 'includes.Asset',
            allowed: ['Asset'],
        },
        AssetSC: {
            type: 'array',
            path: 'includes.AssetSC',
            allowed: ['AssetSC'],
        },
        Character: {
            type: 'array',
            path: 'includes.Character',
            allowed: ['Character'],
        },
        CreativeWork: {
            type: 'array',
            path: 'includes.CreativeWork',
            allowed: ['CreativeWork'],
        },
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
        },
        Depiction: {
            type: 'array',
            path: 'includes.Depiction',
            allowed: ['Depiction'],
        },
        Effect: {
            type: 'array',
            path: 'includes.Effect',
            allowed: ['Effect'],
        },
        NarrativeAudio: {
            type: 'array',
            path: 'includes.NarrativeAudio',
            allowed: ['NarrativeAudio'],
        },
        NarrativeLocation: {
            type: 'array',
            path: 'includes.NarrativeLocation.mjs',
            allowed: ['NarrativeLocation'],
        },
        NarrativeScene: {
            type: 'array',
            path: 'includes.NarrativeScene',
            allowed: ['NarrativeScene'],
        },
        NarrativeObject: {
            type: 'array',
            path: 'includes.NarrativeObject',
            allowed: ['NarrativeObject'],
        },
        NarrativeStyling: {
            type: 'array',
            path: 'includes.NarrativeStyling',
            allowed: ['NarrativeStyling'],
        },
        NarrativeWardrobe: {
            type: 'array',
            path: 'includes.NarrativeWardrobe',
            allowed: ['NarrativeWardrobe'],
        },
        ProductionScene: {
            type: 'array',
            path: 'includes.ProductionScene',
            allowed: ['ProductionScene'],
        },
        ProductionLocation: {
            type: 'array',
            path: 'includes.Location',
            allowed: ['ProductionLocation'],
        },
        Slate: {
            type: 'array',
            path: 'includes.Slate',
            allowed: ['Slate'],
        },
        Infrastructure: {
            type: 'array',
            path: 'includes.Infrastructure',
            allowed: ['Infrastructure'],
        },
        SpecialAction: {
            type: 'array',
            path: 'includes.SpecialAction',
            allowed: ['SpecialAction'],
        },
        Collection: {
            type: 'array',
            path: 'includes.Collection',
            allowed: ['Collection'],
        },
        Composition: {
            type: 'array',
            path: 'includes.Composition',
            allowed: ['Composition'],
        },
        Location: {
            type: 'array',
            path: 'includes.Location',
            allowed: ['Location'],
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
