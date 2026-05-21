/**
 * Template details for NarrativeScene
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity, scriptName, note } from '../utility/utility.js';

const entityType = 'NarrativeScene';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        narrativeSceneName: scriptName.template,
        sceneNumber: {
            $type: 'string',
        },
        slugline: note.template,
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
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
                Effect: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Effect'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
                NarrativeAudio: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeAudio'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
                NarrativeLocation: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeLocation'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
                NarrativeObject: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeObject'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
                NarrativeStyling: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeStyling'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
                NarrativeWardrobe: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeWardrobe'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
                SpecialAction: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['SpecialAction'],
                        $inverse: `edges.${inverseEdges.features}.${entityType}`,
                        $predicate: 'features',
                        $omcPredicate: 'features',
                    },
                },
            },
            for: {
                CreativeWork: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['CreativeWork'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                        $predicate: 'for',
                        $omcPredicate: 'aNarrativeSceneFor',
                    },
                },
            },
            has: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'aNarrativeSceneFor',
                    },
                },
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'aNarrativeSceneHas',
                    },
                },
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isFor.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'hasContext',
                    },
                },
            },
        },
    },
    cxtEdges: {
        features: {
            Character: {
                $type: 'array',
                $edge: {
                    $allowed: ['Character'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
            Effect: {
                $type: 'array',
                $edge: {
                    $allowed: ['Effect'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
            NarrativeAudio: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeAudio'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
            NarrativeLocation: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeLocation'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
            NarrativeObject: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeObject'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
            NarrativeStyling: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeStyling'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
            NarrativeWardrobe: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeWardrobe'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
            SpecialAction: {
                $type: 'array',
                $edge: {
                    $allowed: ['SpecialAction'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'features',
                    $omcPredicate: 'features',
                },
            },
        },
        for: {
            CreativeWork: {
                $type: 'array',
                $edge: {
                    $allowed: ['CreativeWork'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'for',
                    $omcPredicate: 'aNarrativeSceneFor',
                },
            },
        },
        isIn: {
            Context: {
                $type: 'array',
                $edge: {
                    $allowed: ['Context'],
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            narrativeSceneName: scriptName.graphQl.properties,
            sceneNumber: null,
            slugline: note.graphQl.properties,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            narrativeSceneName: scriptName.graphQl.filter,
            sceneNumber: 'string',
        },
        inlineFragment: null,
    },
};
