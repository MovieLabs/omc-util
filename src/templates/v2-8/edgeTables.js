/**
 * v2.8 edge tables — frozen snapshot.
 *
 * v2.8 previously derived these by walking the inline `$edge` markers embedded in each
 * entity's hand-authored shape template. The shape is now derived from the JSON Schema,
 * so those templates were retired; this file preserves the exact edge output they produced.
 */

export const edgeTables = {
    Asset: {
        cxtEdges: {
            Composition: {
                allowed: [
                    'Composition',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'for.Composition',
                type: 'array',
            },
            NarrativeScene: {
                allowed: [
                    'NarrativeScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.NarrativeScene',
                type: 'array',
            },
            Participant: {
                allowed: [
                    'Participant',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.Participant',
                type: 'array',
            },
            ProductionLocation: {
                allowed: [
                    'ProductionLocation',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'usedIn.ProductionLocation',
                type: 'array',
            },
            ProductionScene: {
                allowed: [
                    'ProductionScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'usedIn.ProductionScene',
                type: 'array',
            },
            Slate: {
                allowed: [
                    'Slate',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.Slate',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Asset',
                type: 'array',
            },
            AssetSC: {
                allowed: [
                    'AssetSC',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'AssetSC',
                type: 'object',
            },
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depictor',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
        },
    },
    AssetSC: {
        cxtEdges: {},
        edges: {},
        intrinsic: {},
    },
    Character: {
        cxtEdges: {
            Effect: {
                allowed: [
                    'Effect',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'needs.Effect',
                type: 'array',
            },
            NarrativeAudio: {
                allowed: [
                    'NarrativeAudio',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'needs.NarrativeAudio',
                type: 'array',
            },
            NarrativeObject: {
                allowed: [
                    'NarrativeObject',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'needs.NarrativeObject',
                type: 'array',
            },
            NarrativeScene: {
                allowed: [
                    'NarrativeScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'featuresIn.NarrativeScene',
                type: 'array',
            },
            NarrativeStyling: {
                allowed: [
                    'NarrativeStyling',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'needs.NarrativeStyling',
                type: 'array',
            },
            NarrativeWardrobe: {
                allowed: [
                    'NarrativeWardrobe',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'needs.NarrativeWardrobe',
                type: 'array',
            },
            SpecialAction: {
                allowed: [
                    'SpecialAction',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'needs.SpecialAction',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depicts',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
        },
    },
    Collection: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Asset',
                type: 'array',
            },
            AssetSC: {
                allowed: [
                    'AssetSC',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.AssetSC',
                type: 'array',
            },
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Character',
                type: 'array',
            },
            Collection: {
                allowed: [
                    'Collection',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Collection',
                type: 'array',
            },
            Composition: {
                allowed: [
                    'Composition',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Composition',
                type: 'array',
            },
            ConfigurationFile: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'software.ConfigurationFile',
                type: 'object',
            },
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            CreativeWork: {
                allowed: [
                    'CreativeWork',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.CreativeWork',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Depiction',
                type: 'array',
            },
            Effect: {
                allowed: [
                    'Effect',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Effect',
                type: 'array',
            },
            Infrastructure: {
                allowed: [
                    'Infrastructure',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Infrastructure',
                type: 'array',
            },
            Location: {
                allowed: [
                    'Location',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Location',
                type: 'array',
            },
            NarrativeAudio: {
                allowed: [
                    'NarrativeAudio',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.NarrativeAudio',
                type: 'array',
            },
            NarrativeLocation: {
                allowed: [
                    'NarrativeLocation',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.NarrativeLocation',
                type: 'array',
            },
            NarrativeObject: {
                allowed: [
                    'NarrativeObject',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.NarrativeObject',
                type: 'array',
            },
            NarrativeScene: {
                allowed: [
                    'NarrativeScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.NarrativeScene',
                type: 'array',
            },
            NarrativeStyling: {
                allowed: [
                    'NarrativeStyling',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.NarrativeStyling',
                type: 'array',
            },
            NarrativeWardrobe: {
                allowed: [
                    'NarrativeWardrobe',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.NarrativeWardrobe',
                type: 'array',
            },
            Participant: {
                allowed: [
                    'Participant',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Participant',
                type: 'array',
            },
            ProductionLocation: {
                allowed: [
                    'ProductionLocation',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.ProductionLocation',
                type: 'array',
            },
            ProductionScene: {
                allowed: [
                    'ProductionScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.ProductionScene',
                type: 'array',
            },
            Slate: {
                allowed: [
                    'Slate',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Slate',
                type: 'array',
            },
            SpecialAction: {
                allowed: [
                    'SpecialAction',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.SpecialAction',
                type: 'array',
            },
        },
    },
    Composition: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Asset',
                type: 'array',
            },
            AssetSC: {
                allowed: [
                    'AssetSC',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.AssetSC',
                type: 'array',
            },
            Composition: {
                allowed: [
                    'Composition',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'includes.Composition',
                type: 'array',
            },
            ConfigurationFile: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'software.ConfigurationFile',
                type: 'object',
            },
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Product: {
                allowed: [
                    'Asset',
                ],
                inverse: 'edges.productOf.Composition',
                omcPredicate: null,
                path: 'Product',
                type: 'array',
            },
            StartHere: {
                allowed: [
                    'Asset',
                    'AssetSC',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'StartHere',
                type: 'array',
            },
        },
    },
    Context: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            ForEntity: {
                allowed: [
                    'Asset',
                    'Character',
                    'CreativeWork',
                    'Context',
                    'Depiction',
                    'Effect',
                    'Collection',
                    'Composition',
                    'Location',
                    'NarrativeAudio',
                    'NarrativeScene',
                    'NarrativeLocation',
                    'NarrativeObject',
                    'NarrativeStyling',
                    'NarrativeWardrobe',
                    'Participant',
                    'ProductionLocation',
                    'ProductionScene',
                    'Slate',
                    'SpecialAction',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'ForEntity',
                type: 'array',
            },
        },
    },
    CreativeWork: {
        cxtEdges: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.Asset',
                type: 'array',
            },
            NarrativeScene: {
                allowed: [
                    'NarrativeScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.NarrativeScene',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
            },
            ProductionCompany: {
                allowed: [
                    'Participant',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'ProductionCompany',
            },
        },
    },
    Department: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Location: {
                allowed: [
                    'Location',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Location',
                type: 'array',
            },
        },
    },
    Depiction: {
        cxtEdges: {
            ProductionScene: {
                allowed: [
                    'ProductionScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'usedIn.ProductionScene',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depicter: {
                allowed: [
                    'Asset',
                    'Participant',
                ],
                inverse: 'Depiction',
                omcPredicate: null,
                path: 'Depicter',
                type: 'array',
            },
            Depicts: {
                allowed: [
                    'Character',
                    'NarrativeObject',
                    'NarrativeWardrobe',
                    'NarrativeLocation',
                    'NarrativeAudio',
                    'NarrativeStyling',
                ],
                inverse: 'Depiction',
                omcPredicate: null,
                path: 'Depicts',
                type: 'object',
            },
        },
    },
    Effect: {
        cxtEdges: {
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'neededBy.Character',
                type: 'string',
            },
            NarrativeScene: {
                allowed: [
                    'NarrativeScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'featuresIn.NarrativeScene',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
        },
    },
    Infrastructure: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Infrastructure: {
                allowed: [
                    'Infrastructure',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Infrastructure',
                type: 'array',
            },
            InfrastructureSC: {
                allowed: [
                    'InfrastructureSC',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'InfrastructureSC',
                type: 'object',
            },
        },
    },
    InfrastructureSC: {
        cxtEdges: {},
        edges: {},
        intrinsic: {},
    },
    Location: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
        },
    },
    NarrativeAudio: {
        cxtEdges: {
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'neededBy.Character',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depicts',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
        },
    },
    NarrativeLocation: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depicts',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
            Location: {
                allowed: [
                    'Location',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Location',
                type: 'array',
            },
        },
    },
    NarrativeObject: {
        cxtEdges: {
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'neededBy.Character',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depicts',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
        },
    },
    NarrativeScene: {
        cxtEdges: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.Asset',
                type: 'array',
            },
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'features.Character',
                type: 'array',
            },
            CreativeWork: {
                allowed: [
                    'CreativeWork',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'for.CreativeWork',
                type: 'array',
            },
            Effect: {
                allowed: [
                    'Effect',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'features.Effect',
                type: 'array',
            },
            NarrativeAudio: {
                allowed: [
                    'NarrativeAudio',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'features.NarrativeAudio',
                type: 'array',
            },
            NarrativeLocation: {
                allowed: [
                    'NarrativeLocation',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'features.NarrativeLocation',
                type: 'array',
            },
            NarrativeObject: {
                allowed: [
                    'NarrativeObject',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'features.NarrativeObject',
                type: 'array',
            },
            NarrativeWardrobe: {
                allowed: [
                    'NarrativeWardrobe',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'features.NarrativeWardrobe',
                type: 'array',
            },
            ProductionScene: {
                allowed: [
                    'ProductionScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.ProductionScene',
                type: 'array',
            },
            SpecialAction: {
                allowed: [
                    'SpecialAction',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'features.SpecialAction',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
        },
    },
    NarrativeStyling: {
        cxtEdges: {
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'neededBy.Character',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depicts',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
        },
    },
    NarrativeWardrobe: {
        cxtEdges: {
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'neededBy.Character',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depicts',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
        },
    },
    Organization: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Location: {
                allowed: [
                    'Location',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Location',
                type: 'array',
            },
        },
    },
    Participant: {
        cxtEdges: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'for.Asset',
                type: 'array',
            },
            Slate: {
                allowed: [
                    'Slate',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'for.Slate',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depictor',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
            ParticipantSC: {
                allowed: [
                    'Organization',
                    'Department',
                    'Person',
                    'Service',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'ParticipantSC',
                type: 'object',
            },
            Role: {
                allowed: [
                    'Role',
                ],
                inverse: null,
                omcPredicate: 'has',
                path: 'participantFC.Role',
                type: 'array',
            },
        },
    },
    Person: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Location: {
                allowed: [
                    'Location',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Location',
                type: 'array',
            },
        },
    },
    ProductionLocation: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: 'Depicts',
                omcPredicate: 'hasDepiction',
                path: 'Depiction',
                type: 'array',
            },
            Location: {
                allowed: [
                    'Location',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Location',
                type: 'array',
            },
        },
    },
    ProductionScene: {
        cxtEdges: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'uses.Asset',
                type: 'array',
            },
            Depiction: {
                allowed: [
                    'Depiction',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'uses.Depiction',
                type: 'array',
            },
            NarrativeScene: {
                allowed: [
                    'NarrativeScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'for.NarrativeScene',
                type: 'array',
            },
            ProductionLocation: {
                allowed: [
                    'ProductionLocation',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'uses.ProductionLocation',
                type: 'array',
            },
            ProductionScene: {
                allowed: [
                    'ProductionScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'related.ProductionScene',
                type: 'array',
            },
            Slate: {
                allowed: [
                    'Slate',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.Slate',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
        },
    },
    Role: {
        cxtEdges: {},
        edges: {},
        intrinsic: {},
    },
    Service: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Location: {
                allowed: [
                    'Location',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Location',
                type: 'array',
            },
        },
    },
    Slate: {
        cxtEdges: {
            Asset: {
                allowed: [
                    'Asset',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'for.Asset',
                type: 'array',
            },
            Infrastructure: {
                allowed: [
                    'Infrastructure',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.Infrastructure',
                type: 'array',
            },
            Participant: {
                allowed: [
                    'Participant',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'has.Participant',
                type: 'array',
            },
            ProductionScene: {
                allowed: [
                    'ProductionScene',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'for.ProductionScene',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Director: {
                allowed: [
                    'Participant',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Director',
                type: 'array',
            },
        },
    },
    SpecialAction: {
        cxtEdges: {
            Character: {
                allowed: [
                    'Character',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'neededBy.Character',
                type: 'array',
            },
        },
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
        },
    },
    Task: {
        cxtEdges: {},
        edges: {},
        intrinsic: {
            Context: {
                allowed: [
                    'Context',
                ],
                inverse: 'ForEntity',
                omcPredicate: null,
                path: 'Context',
                type: 'array',
            },
            Task: {
                allowed: [
                    'Task',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'Task',
                type: 'array',
            },
            TaskSC: {
                allowed: [
                    'TaskSC',
                ],
                inverse: null,
                omcPredicate: null,
                path: 'TaskSC',
                type: 'object',
            },
        },
    },
    TaskSC: {
        cxtEdges: {},
        edges: {},
        intrinsic: {},
    },
};

export default { edgeTables };
