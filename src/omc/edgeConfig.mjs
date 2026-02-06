// Entities that can have a Context
const cxtEntities = [
    'Asset',
    'Character',
    'CreativeWork',
    'Context',
    'Depiction',
    'Effect',
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
];

/**
 * Entity configuration definitions containing metadata and relationships for different entity types.
 * Each entity defines its group, ID prefix, intrinsic properties, and edge relationships.
 * @type {Object.<string, EntityConfig>}
 */

/**
 * @typedef {Object} EntityConfig
 * @property {string} group - The logical group this entity belongs to
 * @property {string} idPrefix - The prefix used for generating IDs for this entity type
 * @property {Object.<string, intrinsicProps>} intrinsicProps - Intrinsic properties configuration for this entity
 * @property {Object.<string, string[]>} edges - Edge relationships defining connections to other entities
 */

/**
 * @typedef {Object} intrinsicProps
 * @property {'array'|'object'} type - The data type of the property
 * @property {string} path - The path to access this property
 * @property {string[]} allowed - List of allowed entity types for this property
 */

/**
 * @typedef {Object} edges - A list of allowed edges to other entity types
 * @property {string[]} * - The predicate and set of allowed entities for that predicate
 */

const EntityConfig = {
    Asset: {
        group: 'Asset',
        idPrefix: 'ast',
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
        group: 'Asset',
        idPrefix: 'astsc',
        intrinsicProps: {},
        edges: {},
    },
    Character: {
        group: 'Media Creation Context',
        idPrefix: 'chr',
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
        group: 'Media Creation Context',
        idPrefix: 'cw',
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
        group: 'Media Creation Context',
        idPrefix: 'cxt',
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
        group: 'Media Creation Context',
        idPrefix: 'dep',
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
        group: 'Media Creation Context',
        idPrefix: 'eff',
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
        group: 'Media Creation Context',
        idPrefix: 'naud',
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
        group: 'Media Creation Context',
        idPrefix: 'nloc',
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
        group: 'Media Creation Context',
        idPrefix: 'nobj',
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
        group: 'Media Creation Context',
        idPrefix: 'nscn',
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
        group: 'Media Creation Context',
        idPrefix: 'nsty',
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
        group: 'Media Creation Context',
        idPrefix: 'nwar',
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
        group: 'Media Creation Context',
        idPrefix: 'pscn',
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
        group: 'Media Creation Context',
        idPrefix: 'ploc',
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
        group: 'Media Creation Context',
        idPrefix: 'slt',
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
        group: 'Media Creation Context',
        idPrefix: 'sact',
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
        group: 'Participant',
        idPrefix: 'prpt',
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
        group: 'Participant',
        idPrefix: 'per',
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
        group: 'Participant',
        idPrefix: 'org',
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
        group: 'Participant',
        idPrefix: 'dpt',
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
        group: 'Participant',
        idPrefix: 'srvc',
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
        group: 'Participant',
        idPrefix: 'rol',
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
        group: 'Infrastructure',
        idPrefix: 'inf',
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
        group: 'Task',
        idPrefix: 'tsk',
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
        group: 'Utility',
        idPrefix: 'cmp',
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
        group: 'Utility',
        idPrefix: 'loc',
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

const EdgeReversal = {
    contributor: 'contributesTo',
    contributesTo: 'contributor',
    featuresIn: 'features',
    features: 'featuresIn',
    neededBy: 'needs',
    needs: 'neededBy',
    has: 'for',
    for: 'has',
    represents: 'representedBy',
    representedBy: 'represents',
    usedIn: 'uses',
    uses: 'usedIn',
    related: 'related',
    idea: 'subject',
    subject: 'idea',
    hasProduct: 'productOf',
    productOf: 'hasProduct',
};

export default {
    EntityConfig,
    EdgeReversal,
};
