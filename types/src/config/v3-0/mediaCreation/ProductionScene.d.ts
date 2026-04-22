declare namespace _default {
    let properties: {
        sceneName: {
            fullName: string[];
            altName: string[];
        };
        sceneHeader: any;
        sceneDescriptor: any;
        sceneNumber: any;
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
    namespace edges {
        export namespace _for {
            let allowed_1: string[];
            export { allowed_1 as allowed };
        }
        export { _for as for };
        export namespace has {
            let allowed_2: string[];
            export { allowed_2 as allowed };
        }
        export namespace related {
            let allowed_3: string[];
            export { allowed_3 as allowed };
        }
        export namespace uses {
            let allowed_4: string[];
            export { allowed_4 as allowed };
        }
    }
    namespace graphQl {
        let filter: {
            sceneName: {
                fullName: string[];
                altName: string[];
            };
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
//# sourceMappingURL=ProductionScene.d.ts.map