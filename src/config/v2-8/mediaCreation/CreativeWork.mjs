/**
 * Template details for CreativeWork
 */
import { baseEntity } from '../utility/utility.mjs';

export default {
    properties: {
        ...baseEntity.properties,
        creativeWorkType: null,
        creativeWorkCategory: null,
        seasonNumber: null,
        episodeSequence: {
            houseSequence: null,
            distributionNumber: {
                value: null,
                domain: null,
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
        Context: null,
        Series: null,
        Episode: null,
        ProductionCompany: null,
    },
    intrinsicProps: {
        Context: {
            type: 'array',
            path: 'Context',
            allowed: ['Context'],
            biDirectional: true,
        },
    },
    edges: {
        has: ['Asset', 'NarrativeScene'],
    },
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'cw',
};
