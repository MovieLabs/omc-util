declare namespace _default {
    let properties: {
        Task: any;
        TaskSC: any;
        taskFC: {
            functionalType: any;
            functionalProperties: any;
            customData: any;
        };
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
    let edges: {};
    namespace graphQl {
        let filter: {
            identifier: {
                identifierScope: string;
                identifierValue: string;
            };
            name: string;
        };
        let inlineFragment: any;
        let idPrefix: string;
    }
}
export default _default;
