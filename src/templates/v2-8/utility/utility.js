/**
 * Template details for Utility properties
 * @ignore
 */

export const software = {
    template: {
        softwareName: { $type: 'string' },
        softwareVersion: { $type: 'string' },
        apiVersion: { $type: 'string' },
        // plugin: null,
        // operatingSystem: null,
        parameters: { $type: 'string' },
        ConfigurationFile: {
            $type: 'string',
            $edge: {
                $allowed: ['Asset'],
            },
        },
    },
    graphQl: {
        properties: {
            softwareName: null,
            softwareVersion: null,
            apiVersion: null,
            // plugin: null,
            // operatingSystem: null,
            parameters: null,
            ConfigurationFile: null,
        },
        filter: null,
        inlineFragment: null,
    },
};

export const completeName = {
    template: {
        firstGivenName: { $type: 'string' },
        familyName: { $type: 'string' },
        fullName: { $type: 'string' },
        altName: { $type: 'string' },
    },
    graphQl: {
        properties: {
            firstGivenName: 'string',
            familyName: 'string',
            fullName: 'string',
            altName: 'string',
        },
        filter: null,
        inlineFragment: null,
    },
};

export const basicName = {
    template: {
        fullName: { $type: 'string' },
        altName: { $type: 'string' },
    },
    graphQl: {
        properties: {
            fullName: 'string',
            altName: 'string',
        },
        filter: null,
        inlineFragment: null,
    },
};

export const note = {
    template: {
        title: { $type: 'string' },
        text: { $type: 'string' },
    },
    graphQl: {
        properties: {
            title: null,
            text: null,
        },
        filter: null,
        inlineFragment: null,
    },
};

export const baseEntity = {
    template: {
        schemaVersion: { $type: 'string' },
        identifier: {
            identifierScope: { $type: 'string' },
            identifierValue: { $type: 'string' },
        },
        entityType: { $type: 'string' },
        name: { $type: 'string' },
        description: { $type: 'string' },
        annotation: {
            author: { $type: 'string' },
            title: { $type: 'string' },
            text: { $type: 'string' },
        },
        tag: {
            domain: { $type: 'string' },
            value: { $type: 'string' },
        },
        customData: { $type: 'array' },
    },
    graphQl: {
        properties: {
            schemaVersion: null,
            identifier: {
                identifierScope: 'string',
                identifierValue: 'string',
            },
            entityType: null,
            name: 'string',
            description: null,
            annotation: {
                author: null,
                title: null,
                text: null,
            },
            tag: {
                domain: null,
                value: null,
            },
            customData: null,
        },
        filter: {
            identifier: {
                identifierScope: 'string',
                identifierValue: 'string',
            },
            name: 'string',
        },
        inlineFragment: null,
    },
};
