/**
 * Template details for CreativeWork
 */

import { generalConfig } from '../generalConfig.js';
import { inverseEdges } from '../inverseEdges.js';
import { baseEntity } from '../utility/utility.js';

const entityType = 'CreativeWork';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        creativeWorkType: {
            $type: 'string',
        },
        creativeWorkCategory: {
            $type: 'string',
        },
        seasonNumber: {
            $type: 'string',
        },
        episodeSequence: {
            houseSequence: {
                $type: 'string',
            },
            distributionNumber: {
                value: {
                    $type: 'string',
                },
                domain: {
                    $type: 'string',
                },
            },
        },
        title: {
            titleName: {
                $type: 'string',
            },
            titleType: {
                $type: 'string',
            },
            titleLanguage: {
                $type: 'string',
            },
        },
        approximateLength: {
            $type: 'string',
        },
        originalLanguage: {
            $type: 'string',
        },
        countryOfOrigin: {
            $type: 'string',
        },
        edges: {
            has: {
                Asset: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Asset'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'omcT:aCreativeWorkHas.Script',
                    },
                },
                NarrativeScene: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['NarrativeScene'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'omcT:aCreativeWorkHas.NarrativeScene',
                    },
                },
                Context: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['Context'],
                        $inverse: `edges.isFor.${entityType}`,
                        $predicate: 'has',
                        $omcPredicate: 'N/A',
                    },
                },
            },
            related: {
                CreativeWork: {
                    $type: 'array',
                    $edge: {
                        $allowed: ['CreativeWork'],
                        $inverse: `edges.${inverseEdges.has}.${entityType}`,
                        $predicate: 'related',
                        $omcPredicate: 'omcT:aCreativeWorkRelated.CreativeWork',
                    },
                },
            },
        },
        ProductionCompany: {
            type: 'array',
            $edge: {
                $allowed: ['Participant'],
                $inverse: `edges.for.${entityType}`,
                $predicate: 'ProductionCompany',
                $omcPredicate: 'omcT:aCreativeWorkHas.ProductionCompany',
            },
        },
        Series: {
            type: 'array',
            $edge: {
                $allowed: ['CreativeWork'],
                $inverse: `edges.related.${entityType}`,
                $predicate: 'Series',
                $omcPredicate: 'N/A',
            },
        },
        Episode: {
            type: 'array',
            $edge: {
                $allowed: ['CreativeWork'],
                $inverse: `edges.related.${entityType}`,
                $predicate: 'Episode',
                $omcPredicate: 'N/A',
            },
        },
    },
    cxtEdges: {
        has: {
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
            Asset: {
                $type: 'array',
                $edge: {
                    $allowed: ['Asset'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'has',
                    $omcPredicate: 'hasContext',
                },
            },
            NarrativeScene: {
                $type: 'array',
                $edge: {
                    $allowed: ['NarrativeScene'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'has',
                    $omcPredicate: 'hasContextComponent',
                },
            },
            Context: {
                type: 'array',
                $edge: {
                    $allowed: ['Context'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'Context',
                    $omcPredicate: 'hasContext',
                },
            },
        },
        related: {
            CreativeWork: {
                $type: 'array',
                $edge: {
                    $allowed: ['CreativeWork'],
                    $inverse: `edges.isIn.${entityType}`,
                    $predicate: 'isIn',
                    $omcPredicate: 'isContextComponent',
                },
            },
        },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            creativeWorkType: null,
            creativeWorkCategory: null,
            seasonNumber: null,
            episodeSequence: {
                houseSequence: null,
                distributionNumber:
                    {
                        value: null,
                        domain:
                            null,
                    },
            },
            title: {
                titleName: null,
                titleType: null,
                titleLanguage: null,
            },
            approximateLength: null,
            originalLanguage: null,
            countryOfOrigin: null,
            Series: null,
            Episode: null,
            ProductionCompany: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
};
