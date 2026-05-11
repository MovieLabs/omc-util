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
        collectionType: { $type: 'string' },
        collectionName: basicName.template,
        collectionProperties: { $type: 'object' },
        software: software.template,
        includes: {
            Asset: {
                $type: 'array',
                $edge: {
                    $allowed: ['Asset'],
                },
            },
            AssetSC: {
                $type: 'array',
                $edge: {
                    $allowed: ['AssetSC'],
                },
            },
            Character: {
                $type: 'array',
                $edge: {
                    $allowed: ['Character'],
                },
            },
            CreativeWork: {
                $type: 'array',
                $edge: {
                    $allowed: ['CreativeWork'],
                },
            },
            Depiction: {
                $type: 'array',
                $edge: {
                    $allowed: ['Depiction'],
                },
            },
            Effect: {
                $type: 'array',
                $edge: {
                    $allowed: ['Effect'],
                },
            },
            NarrativeAudio: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeAudio'],
                },
            },
            NarrativeLocation: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeLocation'],
                },
            },
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                },
            },
            NarrativeObject: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeObject'],
                },
            },
            NarrativeStyling: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeStyling'],
                },
            },
            NarrativeWardrobe: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeWardrobe'],
                },
            },
            ProductionScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionScene'],
                },
            },
            ProductionLocation: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionLocation'],
                },
            },
            Slate: {
                $type: 'array',
                $edge: {
                    $allowed: ['Slate'],
                },
            },
            Infrastructure: {
                $type: 'array',
                $edge: {
                    $allowed: ['Infrastructure'],
                },
            },
            SpecialAction: {
                $type: 'array',
                $edge: {
                    $allowed: ['SpecialAction'],
                },
            },
            Collection: {
                $type: 'array',
                $edge: {
                    $allowed: ['Collection'],
                },
            },
            Composition: {
                $type: 'array',
                $edge: {
                    $allowed: ['Composition'],
                },
            },
            Location: {
                $type: 'array',
                $edge: {
                    $allowed: ['Location'],
                },
            },
            Participant: {
                $type: 'array',
                $edge: {
                    $allowed: ['Participant'],
                },
            },
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $omcPredicate: 'isInContext',
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
