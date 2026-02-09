/**
 * Constants and definitions used for creating the graphQl query
 *
 * @ignore
 */

// Fragment prefixed to q query to shorten the identifier query
const identifierFragment = `
    fragment idFields on Identifier {
        identifierScope
        identifierValue
        url
    }
`;

// Fragment prefixed to a query to shorten a query that uses the entire base entity properties
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

// The template for an entity query
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
