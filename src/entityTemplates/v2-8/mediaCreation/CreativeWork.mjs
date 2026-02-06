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
    graphQl: {
        filter: {
            ...baseEntity.graphQl.filter,
        },
        inlineFragment: null,
    },
    idPrefix: 'cw',
};
