/**
 * Template details for Utility properties
 * @ignore
 */

export const software = {
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
    graphQl: {
        properties: {
            title: null,
            text: null,
        },
        filter: null,
        inlineFragment: null,
    },
};

export const gender = {
    graphQl: {
        properties: {
            gender: null,
            genderPronoun: null,
        },
        filter: null,
        inlineFragment: null,
    },
};

export const contact = {
    graphQl: {
        properties: {
            email: {
                business: null,
                personal: null,
            },
            telephone: {
                business: null,
                personal: null,
            },
        },
        filter: null,
        inlineFragment: null,
    },
};

export const baseEntity = {
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
