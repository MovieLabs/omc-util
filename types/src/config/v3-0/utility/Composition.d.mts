declare namespace _default {
    let properties: {
        compositionType: any;
        compositionProperties: any;
        includes: {
            Asset: any;
        };
        software: {
            softwareName: any;
            softwareVersion: any;
            apiVersion: any;
            parameters: any;
            ConfigurationFile: any;
        };
        StartHere: {
            Asset: any;
            AssetSC: any;
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
        namespace includes {
            namespace Asset {
                let type: string;
                let allowed: string[];
            }
            namespace AssetSC {
                let type_1: string;
                export { type_1 as type };
                let allowed_1: string[];
                export { allowed_1 as allowed };
            }
            namespace Composition {
                let type_2: string;
                export { type_2 as type };
                let allowed_2: string[];
                export { allowed_2 as allowed };
            }
        }
        namespace Context {
            let type_3: string;
            export { type_3 as type };
            let allowed_3: string[];
            export { allowed_3 as allowed };
            export let inverse: string;
        }
        namespace StartHere {
            let type_4: string;
            export { type_4 as type };
            let allowed_4: string[];
            export { allowed_4 as allowed };
        }
    }
    namespace edges {
        namespace produces {
            let allowed_5: string[];
            export { allowed_5 as allowed };
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
        namespace inlineFragment {
            export namespace StartHere_1 {
                let Asset_1: string;
                export { Asset_1 as Asset };
                let AssetSC_1: string;
                export { AssetSC_1 as AssetSC };
            }
            export { StartHere_1 as StartHere };
        }
    }
    let idPrefix: string;
}
export default _default;
