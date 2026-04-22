declare namespace _default {
    let properties: {
        locationType: any;
        Context: any;
        Location: any;
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
        namespace Location {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
        }
    }
    namespace edges {
        namespace usedIn {
            let allowed_2: string[];
            export { allowed_2 as allowed };
        }
    }
    namespace graphQl {
        let filter: {
            locationType: string;
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
//# sourceMappingURL=ProductionLocation.d.ts.map