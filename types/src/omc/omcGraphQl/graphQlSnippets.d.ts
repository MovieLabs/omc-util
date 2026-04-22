export namespace graphqlSnippets {
    export namespace idFields {
        export let text: string;
        export { identifierFragment as fragment };
    }
    export namespace baseEntity {
        let text_1: string;
        export { text_1 as text };
        export { baseEntityFragment as fragment };
    }
    export { entityQuery };
}
/**
 * Constants and definitions used for creating the graphQl query
 *
 * @ignore
 */
declare const identifierFragment: "\n    fragment idFields on Identifier {\n        identifierScope\n        identifierValue\n        url\n    }\n";
declare const baseEntityFragment: "\n    fragment baseEntity on baseEntity {\n        schemaVersion\n        entityType\n        identifier {\n            identifierScope\n            identifierValue\n            url\n        }\n        name\n        description\n        annotation {\n            author\n            title\n            text\n        }\n        tag {\n            domain\n            value\n        }\n        customData\n    }\n";
declare const entityQuery: "\n    query ($project: String) {\n    _get_(project: $project) {\n    _query_\n    }\n    }\n";
export {};
//# sourceMappingURL=graphQlSnippets.d.ts.map