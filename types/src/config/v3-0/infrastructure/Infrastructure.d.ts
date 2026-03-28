declare namespace _default {
    let properties: {
        InfrastructureSC: any;
        infrastructureFC: {
            functionalType: any;
            functionalProperties: any;
        };
        Infrastructure: any;
        Context: any;
        schemaVersion: any;
        identifier: {
            identifierScope: string;
            identifierValue: string;
        };
        entityType: any;
        name: string;
        description: any;
        annotation: {
            author: any;
            title: any;
            text: any;
        };
        tag: {
            domain: any;
            value: any;
        };
        customData: any;
    };
    namespace intrinsic {
        namespace Context {
            let type: string;
            let allowed: string[];
            let inverse: string;
            let biDirectional: boolean;
        }
        namespace Infrastructure {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
            let biDirectional_1: boolean;
            export { biDirectional_1 as biDirectional };
        }
        namespace InfrastructureSC {
            let type_2: string;
            export { type_2 as type };
            let allowed_2: string[];
            export { allowed_2 as allowed };
            let biDirectional_2: boolean;
            export { biDirectional_2 as biDirectional };
        }
    }
    namespace edges {
        namespace has {
            let allowed_3: string[];
            export { allowed_3 as allowed };
        }
    }
    namespace graphQl {
        let filter: {
            identifier: {
                identifierScope: string;
                identifierValue: string;
            };
            name: string;
        };
        let inlineFragment: {};
    }
    let idPrefix: string;
}
export default _default;
