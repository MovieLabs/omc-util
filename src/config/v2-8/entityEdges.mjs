/**
 * Entity configuration definitions containing metadata and relationships for different entity types.
 * Each entity defines its group, ID prefix, intrinsic properties, and edge relationships.
 * @type {Object.<string, EntityDetail>}
 */

/**
 * @typedef {Object} EntityDetail
 * @memberOf OmcUtil
 * @property {string} group - A logical grouping from the ontology this entity belongs to
 * @property {string} idPrefix - A common prefix that can be used when generating IDs for this entity type
 * @property {Object.<string, intrinsicProps>} intrinsicProps - Intrinsic properties for this entity
 * @property {Object.<string, string[]>} edges - Allowed edge types for this entity (domain and range in RDF)
 */

/**
 * @typedef {Object} intrinsicProps
 * @memberOf OmcUtil
 * @property {'array'|'object'} type - The data type of the property
 * @property {string} path - The path to access this property
 * @property {string[]} allowed - List of allowed entity types for this property
 */

/**
 * @typedef {Object} edges - A list of allowed edges to other entity types
 * @memberOf OmcUtil
 * @property {string[]} * - The predicate and set of allowed entities for that predicate
 */

export const entityEdges = {
    Asset: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Asset: {
                type: 'array',
                path: 'Asset',
                allowed: ['Asset'],
            },
            AssetSC: {
                type: 'object',
                path: 'AssetSC',
                allowed: ['AssetSC'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
        },
        edges: {
            for: ['NarrativeScene', 'Composition'],
            has: ['NarrativeScene', 'Participant', 'Slate'],
            usedIn: ['ProductionLocation', 'ProductionScene'],
        },
    },
    AssetSC: {
        intrinsicProps: {},
        edges: {},
    },
    Character: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
        },
        edges: {
            featuresIn: ['NarrativeScene'],
            needs: ['Effect', 'NarrativeAudio', 'NarrativeObject', 'NarrativeStyling', 'NarrativeWardrobe', 'SpecialAction'],
        },
    },
    CreativeWork: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {
            has: ['Asset', 'NarrativeScene'],
        },
    },
    Context: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            ForEntity: {
                type: 'array',
                path: 'ForEntity',
                allowed: cxtEntities,
            },
        },
        edges: {},
    },
    Depiction: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depicts: {
                type: 'array',
                path: 'Depicts',
                allowed: ['Character', 'NarrativeObject', 'NarrativeWardrobe', 'NarrativeLocation', 'NarrativeAudio', 'NarrativeStyling'],
            },
            Depictor: {
                type: 'array',
                path: 'Depictor',
                allowed: ['Asset', 'Participant'],
            },
        },
        edges: {
            usedIn: ['ProductionScene'],
        },
    },
    Effect: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {
            featuresIn: ['NarrativeScene'],
            neededBy: ['Character'],
        },
    },
    NarrativeAudio: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
        },
        edges: {
            featuresIn: ['NarrativeScene'],
            neededBy: ['Character'],
        },
    },
    NarrativeLocation: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
            Location: {
                type: 'array',
                path: 'Location',
                allowed: ['Location'],
            },
        },
        edges: {
            features: ['NarrativeScene'],
        },
    },
    NarrativeObject: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
        },
        edges: {
            featuresIn: ['NarrativeScene'],
            neededBy: ['Character'],
        },
    },
    NarrativeScene: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
        },
        edges: {
            features: ['Character', 'Effect', 'NarrativeAudio', 'NarrativeLocation', 'NarrativeObject', 'NarrativeWardrobe', 'SpecialAction'],
            for: ['CreativeWork'],
            has: ['Asset', 'ProductionScene'],
        },
    },
    NarrativeStyling: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
        },
        edges: {
            featuresIn: ['NarrativeScene'],
            neededBy: ['Character'],
        },
    },
    NarrativeWardrobe: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Depiction: {
                type: 'array',
                path: 'Depiction',
                allowed: ['Depiction'],
            },
        },
        edges: {
            featuresIn: ['NarrativeScene'],
            neededBy: ['Character'],
        },
    },
    ProductionScene: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {
            for: ['NarrativeScene'],
            has: ['Slate'],
            related: ['ProductionScene'],
            uses: ['Asset', 'Depiction', 'ProductionLocation'],
        },
    },
    ProductionLocation: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {
            usedIn: ['ProductionScene'],
        },
    },
    Slate: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {
            has: ['Infrastructure', 'Participant'],
            for: ['Asset', 'ProductionScene'],
        },
    },
    SpecialAction: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {
            featuresIn: ['NarrativeScene'],
            neededBy: ['Character'],
        },
    },
    Participant: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            ParticipantSC: {
                type: 'object',
                path: 'ParticipantSC',
                allowed: ['Organization', 'Department', 'Person', 'Service'],
            },
            Role: {
                type: 'array',
                path: 'assetFC.Role',
                allowed: ['Role'],
            },
        },
        edges: {
            for: ['Asset', 'Slate'],
        },
    },
    Person: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {},
    },
    Organization: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {},
    },
    Department: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {},
    },
    Service: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {},
    },
    Role: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {},
    },

    Infrastructure: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {
            has: ['SpecialAction'],
        },
    },
    Task: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {},
    },
    Composition: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
            Asset: {
                type: 'array',
                path: 'Asset',
                allowed: ['Asset'],
            },
            AssetSC: {
                type: 'array',
                path: 'AssetSC',
                allowed: ['AssetSC'],
            },
            Composition: {
                type: 'array',
                path: 'Composition',
                allowed: ['Composition'],
            },
            StartHere: {
                type: 'object',
                path: 'StartHere',
                allowed: ['Asset', 'AssetSC'],
            },
        },
        edges: {},
    },
    Location: {
        intrinsicProps: {
            Context: {
                type: 'array',
                path: 'Context',
                allowed: ['Context'],
            },
        },
        edges: {},
    },
};
