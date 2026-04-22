declare namespace _default {
    let properties: {
        AssetSC: any;
        assetFC: {
            functionalProperties: any;
            functionalType: any;
        };
        Asset: any;
        Context: any;
        Depiction: any;
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
        namespace Asset {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
            let biDirectional_1: boolean;
            export { biDirectional_1 as biDirectional };
        }
        namespace AssetSC {
            let type_2: string;
            export { type_2 as type };
            let allowed_2: string[];
            export { allowed_2 as allowed };
            let biDirectional_2: boolean;
            export { biDirectional_2 as biDirectional };
        }
        namespace Depiction {
            let type_3: string;
            export { type_3 as type };
            let allowed_3: string[];
            export { allowed_3 as allowed };
            let biDirectional_3: boolean;
            export { biDirectional_3 as biDirectional };
        }
    }
    namespace edges {
        export namespace _for {
            let allowed_4: string[];
            export { allowed_4 as allowed };
        }
        export { _for as for };
        export namespace has {
            let allowed_5: string[];
            export { allowed_5 as allowed };
        }
        export namespace usedIn {
            let allowed_6: string[];
            export { allowed_6 as allowed };
        }
        export namespace productOf {
            let allowed_7: string[];
            export { allowed_7 as allowed };
        }
    }
    namespace graphQl {
        let filter: {
            assetFC: {
                functionalType: string[];
            };
            identifier: {
                identifierScope: string;
                identifierValue: string;
            };
            name: string;
        };
        let inlineFragment: any;
    }
}
export default _default;
//# sourceMappingURL=Asset.d.ts.map