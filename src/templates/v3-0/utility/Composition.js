/**
 * Template details for Composition
 */
import { generalConfig } from '../generalConfig.js';

import { baseEntity, basicName, software } from './utility.js';

const entityType = 'Composition';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        compositionType: { $type: 'string', $default: 'composition' },
        compositionName: basicName.template,
        compositionProperties: {
            audioContent: {
                $type: 'array',
                $items: {
                    mcaContent: { $type: 'string' },
                    mcaContentSubtype: { $type: 'string' },
                    language: { $type: 'string' },
                },
            },
            boundingBox: {
                corner1: { x: { $type: 'number' }, y: { $type: 'number' }, z: { $type: 'number' } },
                corner2: { x: { $type: 'number' }, y: { $type: 'number' }, z: { $type: 'number' } },
            },
            coordinateOrientation: {
                handedness: { $type: 'string' },
                upAxis: { $type: 'string' },
            },
            levelOfDetail: { $type: 'number' },
            materialType: { $type: 'string' },
            purpose: { $type: 'string' },
            scale: { $type: 'string' },
            soundfield: { $type: 'string' },
        },
        software: { $type: 'array', $items: { ...software.template } },
        includes: {
            Asset: { $type: 'array' },
            AssetStructure: { $type: 'array' },
            Composition: { $type: 'array' },
        },
        StartHere: {
            Asset: { $type: 'array' },
            AssetStructure: { $type: 'array' },
        },
        Product: { $type: 'array' },
    },
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
            Product: {
                Asset: null,
            },
        },
        filter: {
            ...baseEntity.graphQl.filter,
            compositionName: basicName.graphQl.filter,
        },
        inlineFragment: {
            StartHere: {
                Asset: '...on',
                AssetSC: '...on',
            },
        },
    },
    idPrefix: 'cmp',
};
