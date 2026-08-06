/**
 * Template details for Composition
 */
import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName, software } from './utility.js';

const entityType = 'Composition';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            compositionType: null,
            compositionName: basicName.graphQl.properties,
            compositionProperties: null,
            includes: {
                Asset: null,
                AssetStructure: null,
                Composition: null,
            },
            software: software.graphQl.properties,
            StartHere: {
                Asset: null,
                AssetStructure: null,
            },
            Product: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            compositionName: basicName.graphQl.filter,
        },
        inlineFragment: {
            StartHere: {
                Asset: '...on',
                AssetStructure: '...on',
            },
        },
    },
    idPrefix: 'cmp',
};
