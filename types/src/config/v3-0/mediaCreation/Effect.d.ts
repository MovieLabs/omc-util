declare namespace _default {
    let properties: {
        effectType: any;
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
            let biDirectional: boolean;
            let inverse: string;
        }
    }
    namespace edges {
        namespace featuresIn {
            let allowed_1: string[];
            export { allowed_1 as allowed };
        }
        namespace neededBy {
            let allowed_2: string[];
            export { allowed_2 as allowed };
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
        let inlineFragment: any;
    }
    let idPrefix: string;
}
export default _default;
