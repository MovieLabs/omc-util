declare namespace _default {
    let properties: {
        depictionType: any;
        Depicts: any;
        Depicter: any;
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
            let inverse: string[];
        }
        namespace Depicts {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
            let biDirectional_1: boolean;
            export { biDirectional_1 as biDirectional };
            let inverse_1: string;
            export { inverse_1 as inverse };
        }
        namespace Depictor {
            let type_2: string;
            export { type_2 as type };
            let allowed_2: string[];
            export { allowed_2 as allowed };
            let biDirectional_2: boolean;
            export { biDirectional_2 as biDirectional };
            let inverse_2: string;
            export { inverse_2 as inverse };
        }
    }
    namespace edges {
        namespace usedIn {
            let allowed_3: string[];
            export { allowed_3 as allowed };
        }
    }
    namespace graphQl {
        let filter: {
            depictionType: string;
            identifier: {
                identifierScope: string;
                identifierValue: string;
            };
            name: string;
        };
        namespace inlineFragment {
            export namespace Depicts_1 {
                let Character: string;
                let NarrativeLocation: string;
                let NarrativeObject: string;
                let NarrativeStyling: string;
                let NarrativeWardrobe: string;
            }
            export { Depicts_1 as Depicts };
            export namespace Depicter {
                let Participant: string;
                let Asset: string;
            }
        }
    }
    let idPrefix: string;
}
export default _default;
