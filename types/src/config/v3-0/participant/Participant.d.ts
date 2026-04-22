declare namespace _default {
    let properties: {
        ParticipantSC: any;
        participantFC: {
            functionalType: any;
            jobTitle: any;
            Role: any;
        };
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
            let inverse: string;
            let biDirectional: boolean;
        }
        namespace ParticipantSC {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
        }
        namespace Depiction {
            let type_2: string;
            export { type_2 as type };
            let allowed_2: string[];
            export { allowed_2 as allowed };
            let biDirectional_1: boolean;
            export { biDirectional_1 as biDirectional };
            let inverse_1: string;
            export { inverse_1 as inverse };
        }
        namespace assetFC {
            namespace Role {
                let type_3: string;
                export { type_3 as type };
                let allowed_3: string[];
                export { allowed_3 as allowed };
                export let predicate: string;
            }
        }
    }
    namespace edges {
        export namespace _for {
            let allowed_4: string[];
            export { allowed_4 as allowed };
        }
        export { _for as for };
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
            export namespace ParticipantSC_1 {
                let Organization: string;
                let Department: string;
                let Person: string;
                let Service: string;
            }
            export { ParticipantSC_1 as ParticipantSC };
        }
    }
}
export default _default;
//# sourceMappingURL=Participant.d.ts.map