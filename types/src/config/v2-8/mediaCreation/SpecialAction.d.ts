declare namespace _default {
    let properties: {
        specialActionType: any;
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
            specialActionType: string;
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
