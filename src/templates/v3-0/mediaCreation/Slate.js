/**
 * Template details for Slate
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity } from '../utility/utility.js';
import { inverseEdges } from '../inverseEdges.js';

const entityType = 'Slate';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        slateUID: {
            $type: 'string',
        },
        cameraLabel: {
            $type: 'string',
        },
        cameraUnit: {
            $type: 'string',
        },
        cameraRoll: {
            $type: 'string',
        },
        soundRoll: {
            $type: 'string',
        },
        shootDate: {
            $type: 'string',
        },
        shootDay: {
            $type: 'string',
        },
        recordingFPS: {
            $type: 'string',
        },
        Context: {
            $type: 'array',
            $edge: {
                $allowed: ['Context'],
                $inverse: `edges.isIn.${entityType}`,
                $omcPredicate: 'isInContext',
            },
        },
        CreativeWork: {
            $type: 'object',
            $edge: {
                $allowed: ['CreativeWork'],
                $inverse: `edges.has.${entityType}`,
            },
        },
        Director: {
            $type: 'array',
            $edge: {
                $allowed: ['Participant'],
                $inverse: `edges.for.${entityType}`,
            },
        },
        edges: {
            has: {
                Infrastructure: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Infrastructure'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                    },
                },
                Participant: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Participant'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                    },
                },
            },
            for: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                    },
                },
                ProductionScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['ProductionScene'],
                        $inverse: `edges.${inverseEdges.for}.${entityType}`,
                    },
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            slateUID: null,
            cameraLabel: null,
            cameraUnit: null,
            cameraRoll: null,
            soundRoll: null,
            shootDate: null,
            shootDay: null,
            recordingFPS: null,
            Context: null,
            CreativeWork: null,
            Director: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            slateUID: ['String'],
        },
        inlineFragment: null,
    },
};
