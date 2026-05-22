/**
 * Template details for CreativeWork
 */

import { generalConfig } from '../generalConfig.js';
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
        ProductionCompany: {
            type: 'array',
        },
        Series: {
            type: 'array',
        },
        Episode: {
            type: 'array',
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
