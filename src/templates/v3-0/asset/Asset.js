/**
 * Template details for Asset
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'Asset';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        AssetStructure: { $type: 'array' },
        assetFunction: {
            assetFunctionType: { $type: 'string', $default: 'assetFunction' },
            assetFunctionProperties: {
                audioChannelName: {
                    $type: 'array',
                    $items: { $type: 'string' },
                },
                audioContent: {
                    $type: 'array',
                    $items: {
                        mcaContent: { $type: 'string' },
                        mcaContentSubtype: { $type: 'string' },
                        language: { $type: 'string' },
                    },
                },
                audioMixType: { $type: 'string' },
                audioProcessingAction: { $type: 'string' },
                audioTrackName: { $type: 'string' },
                cameraMetadata: {
                    activeSensorPhysicalDimensions: { $type: 'string' },
                    cameraLabel: { $type: 'string' },
                    cameraMake: { $type: 'string' },
                    cameraModel: { $type: 'string' },
                    cameraUID: { $type: 'string' },
                    cameraSerialNumber: { $type: 'string' },
                    cameraFirmwareVersion: { $type: 'string' },
                    captureRate: { $type: 'string' },
                    circleTake: { $type: 'string' },
                    exposureIndex: { $type: 'string' },
                    fdlLink: { $type: 'string' },
                    flipX: { $type: 'string' },
                    flipY: { $type: 'string' },
                    frameHeight: { $type: 'string' },
                    frameWidth: { $type: 'string' },
                    isoSpeed: { $type: 'string' },
                    lutUID: { $type: 'string' },
                    pixelAspectRatio: { $type: 'string' },
                    playbackRate: { $type: 'string' },
                    roll: { $type: 'string' },
                    shutterAngle: { $type: 'string' },
                    tilt: { $type: 'string' },
                    timecode: { $type: 'string' },
                    timecodeEnd: { $type: 'string' },
                    timecodeStart: { $type: 'string' },
                    tint: { $type: 'string' },
                    whiteBalance: { $type: 'string' },
                    reelName: { $type: 'string' },
                    cameraRoll: { $type: 'string' },
                },
                cgVolumePurpose: { $type: 'string' },
                isSelfContained: { $type: 'boolean' },
                lensMetadata: {
                    tStop: { $type: 'string' },
                    fStop: { $type: 'string' },
                    entrancePupilPosition: { $type: 'string' },
                    focusPosition: { $type: 'string' },
                    focalLength: { $type: 'string' },
                    lensMake: { $type: 'string' },
                    lensModel: { $type: 'string' },
                    anamorphicSqueeze: { $type: 'string' },
                    lensSerialNumber: { $type: 'string' },
                    lensFirmwareVersion: { $type: 'string' },
                },
                mapFormat: { $type: 'string' },
                mapType: { $type: 'string' },
                recorderMetadata: {
                    recorderFirmwareVersion: { $type: 'string' },
                    recorderMake: { $type: 'string' },
                    recorderModel: { $type: 'string' },
                    recorderSerialNumber: { $type: 'string' },
                    storageMediaUID: { $type: 'string' },
                },
                soundfield: { $type: 'string' },
                timing: {
                    sourceStart: { $type: 'string' },
                    sourceEnd: { $type: 'string' },
                    recordStart: { $type: 'string' },
                    recordEnd: { $type: 'string' },
                    duration: { $type: 'string' },
                },
                udimTileNumber: { $type: 'number' },
            },
        },
        assetName: basicName.template,
        Member: { $type: 'array' },
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            assetName: basicName.graphQl.properties,
            AssetStructure: null,
            assetFunction: {
                assetFunctionType: null,
                assetFunctionProperties: null,
            },
            Member: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            assetName: basicName.graphQl.filter,
            assetFunction: {
                assetFunctionType: ['string'],
            },
        },
        inlineFragment: {
            ...baseEntity.graphQl.inlineFragment,
        },
    },
};
