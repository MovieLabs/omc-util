declare namespace _default {
    let properties: {
        slateUID: any;
        cameraLabel: any;
        cameraUnit: any;
        cameraRoll: any;
        soundRoll: any;
        shootDate: any;
        shootDay: any;
        recordingFPS: any;
        Context: any;
        CreativeWork: any;
        Director: any;
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
        namespace Director {
            let type_1: string;
            export { type_1 as type };
            let allowed_1: string[];
            export { allowed_1 as allowed };
        }
    }
    namespace edges {
        export namespace has {
            let allowed_2: string[];
            export { allowed_2 as allowed };
        }
        export namespace _for {
            let allowed_3: string[];
            export { allowed_3 as allowed };
        }
        export { _for as for };
    }
    namespace graphQl {
        let filter: {
            slateUID: string[];
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
//# sourceMappingURL=Slate.d.ts.map