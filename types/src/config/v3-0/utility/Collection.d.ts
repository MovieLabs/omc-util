declare namespace _default {
    let properties: {
        collectionType: any;
        collectionProperties: any;
        software: {
            softwareName: any;
            softwareVersion: any;
            apiVersion: any;
            parameters: any;
            ConfigurationFile: any;
        };
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
            namespace Character {
                let type_2: string;
                export { type_2 as type };
                let allowed_2: string[];
                export { allowed_2 as allowed };
            }
            namespace CreativeWork {
                let type_3: string;
                export { type_3 as type };
                let allowed_3: string[];
                export { allowed_3 as allowed };
            }
            namespace Depiction {
                let type_4: string;
                export { type_4 as type };
                let allowed_4: string[];
                export { allowed_4 as allowed };
            }
            namespace Effect {
                let type_5: string;
                export { type_5 as type };
                let allowed_5: string[];
                export { allowed_5 as allowed };
            }
            namespace NarrativeAudio {
                let type_6: string;
                export { type_6 as type };
                let allowed_6: string[];
                export { allowed_6 as allowed };
            }
            namespace NarrativeLocation {
                let type_7: string;
                export { type_7 as type };
                let allowed_7: string[];
                export { allowed_7 as allowed };
            }
            namespace NarrativeScene {
                let type_8: string;
                export { type_8 as type };
                let allowed_8: string[];
                export { allowed_8 as allowed };
            }
            namespace NarrativeObject {
                let type_9: string;
                export { type_9 as type };
                let allowed_9: string[];
                export { allowed_9 as allowed };
            }
            namespace NarrativeStyling {
                let type_10: string;
                export { type_10 as type };
                let allowed_10: string[];
                export { allowed_10 as allowed };
            }
            namespace NarrativeWardrobe {
                let type_11: string;
                export { type_11 as type };
                let allowed_11: string[];
                export { allowed_11 as allowed };
            }
            namespace ProductionScene {
                let type_12: string;
                export { type_12 as type };
                let allowed_12: string[];
                export { allowed_12 as allowed };
            }
            namespace ProductionLocation {
                let type_13: string;
                export { type_13 as type };
                let allowed_13: string[];
                export { allowed_13 as allowed };
            }
            namespace Slate {
                let type_14: string;
                export { type_14 as type };
                let allowed_14: string[];
                export { allowed_14 as allowed };
            }
            namespace Infrastructure {
                let type_15: string;
                export { type_15 as type };
                let allowed_15: string[];
                export { allowed_15 as allowed };
            }
            namespace SpecialAction {
                let type_16: string;
                export { type_16 as type };
                let allowed_16: string[];
                export { allowed_16 as allowed };
            }
            namespace Collection {
                let type_17: string;
                export { type_17 as type };
                let allowed_17: string[];
                export { allowed_17 as allowed };
            }
            namespace Composition {
                let type_18: string;
                export { type_18 as type };
                let allowed_18: string[];
                export { allowed_18 as allowed };
            }
            namespace Location {
                let type_19: string;
                export { type_19 as type };
                let allowed_19: string[];
                export { allowed_19 as allowed };
            }
            namespace Participant {
                let type_20: string;
                export { type_20 as type };
                let allowed_20: string[];
                export { allowed_20 as allowed };
            }
        }
        namespace Context {
            let type_21: string;
            export { type_21 as type };
            let allowed_21: string[];
            export { allowed_21 as allowed };
            export let inverse: string;
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
    }
    let idPrefix: string;
}
export default _default;
//# sourceMappingURL=Collection.d.ts.map