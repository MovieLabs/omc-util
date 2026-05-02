/**
 * Template details for NarrativeScene
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName, note } from '../utility/utility.js';
import { inverseEdges } from '../inverseEdges.js';

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
        Depiction: {
            $type: 'array',
            $edge: {
                $allowed: ['Depiction'],
                $inverse: 'Depicts',
            },
        },
        edges: {
            features: {
                Character: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Character'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                    },
                },
                Effect: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Effect'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                    },
                },
                NarrativeAudio: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeAudio'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                    },
                },
                NarrativeLocation: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeLocation'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                    },
                },
                NarrativeObject: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeObject'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                    },
                },
                NarrativeWardrobe: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeWardrobe'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                    },
                },
                SpecialAction: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['SpecialAction'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                    },
                },
            },
            for: {
                CreativeWork: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['CreativeWork'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                    },
                },
            },
            has: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                    },
                },
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                    },
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
