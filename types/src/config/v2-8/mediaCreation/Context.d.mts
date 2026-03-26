declare namespace _default {
    let properties: {
        contextType: any;
        contextCategory: any;
        contextProperties: any;
        ForEntity: any;
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
        namespace ForEntity {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
        }
    }
    let edges: {};
    namespace edges2 {
        export namespace _for {
            let NarrativeScene: {};
        }
        export { _for as for };
        export namespace featuresIn {
            export namespace NarrativeScene_1 {
                let allowed_2: string[];
                export { allowed_2 as allowed };
            }
            export { NarrativeScene_1 as NarrativeScene };
        }
        export namespace has {
            let NarrativeScene_2: {};
            export { NarrativeScene_2 as NarrativeScene };
            export let Participant: {};
            export let Slate: {};
        }
        export namespace needs {
            namespace Effect {
                let allowed_3: string[];
                export { allowed_3 as allowed };
            }
            namespace NarrativeAudio {
                let allowed_4: string[];
                export { allowed_4 as allowed };
            }
            namespace NarrativeObject {
                let allowed_5: string[];
                export { allowed_5 as allowed };
            }
            namespace NarrativeStyling {
                let allowed_6: string[];
                export { allowed_6 as allowed };
            }
            namespace NarrativeWardrobe {
                let allowed_7: string[];
                export { allowed_7 as allowed };
            }
            namespace SpecialAction {
                let allowed_8: string[];
                export { allowed_8 as allowed };
            }
        }
        export namespace usedIn {
            let ProductionLocation: {};
            let productOf: {};
        }
    }
    namespace graphQl {
        let filter: {
            contextType: string[];
            contextCategory: string[];
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
