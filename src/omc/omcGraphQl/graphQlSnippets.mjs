const identifierFragment = `
    fragment idFields on Identifier {
        identifierScope
        identifierValue
        url
    }
`;

const baseEntityFragment = `
    fragment baseEntity on baseEntity {
        schemaVersion
        entityType
        identifier {
            identifierScope
            identifierValue
            url
        }
        name
        description
        annotation {
            author
            title
            text
        }
        tag {
            domain
            value
        }
        customData
    }
`;

const entityQuery = `
    query ($project: String) {
    _get_(project: $project) {
    _query_
    }
    }
`;

export const graphqlSnippets = {
    idFields: {
        text: 'identifier {...idFields}',
        fragment: identifierFragment,
    },
    baseEntity: {
        text: '...baseEntity',
        fragment: baseEntityFragment,
    },
    entityQuery,
};
