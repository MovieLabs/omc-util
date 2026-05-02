/**
 * Template details for NarrativeScene
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName, note } from '../utility/utility.js';
import { inverseEdges } from '../../v3-0/index.js';

const entityType = 'NarrativeScene';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        sceneName: {
            ...basicName.template,
            scriptName: {
                $type: 'string',
            },
        },
        sceneNumber: {
            $type: 'string',
        },
        slugline: note.template,
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: 'ForEntity',
            },
        },
        // Depiction: {
        //     $type: 'array',
        //     $edge: {
        //         $allowed: ['Depiction'],
        //         $inverse: 'Depicts',
        //     },
        // },
    },
    cxtEdges: {
        features: {
            Character: {
                $type: 'array',
                $edge: {
                    $allowed: ['Character'],
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
            NarrativeObject: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeObject'],
                },
            },
            NarrativeWardrobe: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeWardrobe'],
                },
            },
            SpecialAction: {
                $type: 'array',
                $edge: {
                    $allowed: ['SpecialAction'],
                },
            },
        },
        for: {
            CreativeWork: {
                $type: 'array',
                $edge: {
                    $allowed: ['CreativeWork'],
                },
            },
        },
        has: {
            Asset: {
                $type: 'array',
                $edge: {
                    $allowed: ['Asset'],
                },
            },
            ProductionScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['ProductionScene'],
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            sceneName: basicName.graphQl.properties,
            sceneNumber: null,
            slugline: note.graphQl.properties,
            Context: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            sceneName: {
                fullName: ['string'],
                altName: ['string'],
            },
            sceneNumber: 'string',
        },
        inlineFragment: null,
    },
};
