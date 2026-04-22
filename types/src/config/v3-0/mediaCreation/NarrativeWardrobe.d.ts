declare namespace _default {
    let properties: {
        narrativeType: any;
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
        namespace Depiction {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
            let inverse_1: string;
            export { inverse_1 as inverse };
            let biDirectional_1: boolean;
            export { biDirectional_1 as biDirectional };
        }
    }
    namespace edges {
        namespace featuresIn {
            let allowed_2: string[];
            export { allowed_2 as allowed };
        }
        namespace neededBy {
            let allowed_3: string[];
            export { allowed_3 as allowed };
        }
    }
    namespace graphQl {
        let filter: {
            narrativeType: string;
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
//# sourceMappingURL=NarrativeWardrobe.d.ts.map