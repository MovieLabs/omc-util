/**
 *
 */

export const identifier = {
    identifier: {
        identifierScope: 'string',
        identifierValue: 'string',
    },
};

export const software = {
    softwareName: null,
    softwareVersion: null,
    apiVersion: null,
    plugin: null,
    operatingSystem: null,
    parameters: null,
    ConfigurationFile: null,
};

export const tag = {
    domain: null,
    value: null,
};

export const annotation = {
    author: null,
    title: null,
    text: null,
};

export const note = {
    title: null,
    text: null,
};

export const baseEntity = {
    properties: {
        schemaVersion: null,
        identifier: {
            identifierScope: 'string',
            identifierValue: 'string',
        },
        entityType: null,
        name: 'string',
        description: null,
        annotation,
        tag,
        customData: null,
    },
};

export const basicName = {
    fullName: ['string'],
    altName: ['string'],
};

export const completeName = {
    firstGivenName: ['string'],
    familyName: ['string'],
    fullName: ['string'],
    altName: ['string'],
};

export const Collection = {
    properties: {
        collectionType: null,
        software,
    },
};

export const Composition = {
    properties: {
        compositionType: null,
        compositionProperties: null,
        includes: null,
        software,
        StartHere: null,
        Context: null,
        // version: null,
        // provenance: null,
    },
    inlineFragment: {
        StartHere: '...on',
    },
};

export const Location = {
    properties: {
        address: null,
        coordinates: null,
        Context: null,
    },
};
