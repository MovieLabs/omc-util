export namespace identifier {
    namespace identifier {
        let identifierScope: string;
        let identifierValue: string;
    }
}
export namespace software {
    let softwareName: any;
    let softwareVersion: any;
    let apiVersion: any;
    let parameters: any;
    let ConfigurationFile: any;
}
export namespace tag {
    let domain: any;
    let value: any;
}
export namespace annotation {
    let author: any;
    let title: any;
    let text: any;
}
export namespace note {
    let title_1: any;
    export { title_1 as title };
    let text_1: any;
    export { text_1 as text };
}
export namespace baseEntity {
    namespace properties {
        export let schemaVersion: any;
        export namespace identifier_1 {
            let identifierScope_1: string;
            export { identifierScope_1 as identifierScope };
            let identifierValue_1: string;
            export { identifierValue_1 as identifierValue };
        }
        export { identifier_1 as identifier };
        export let entityType: any;
        export let name: string;
        export let description: any;
        export { annotation };
        export { tag };
        export let customData: any;
    }
    namespace graphQl {
        namespace filter {
            export namespace identifier_2 {
                let identifierScope_2: string;
                export { identifierScope_2 as identifierScope };
                let identifierValue_2: string;
                export { identifierValue_2 as identifierValue };
            }
            export { identifier_2 as identifier };
            let name_1: string;
            export { name_1 as name };
        }
        let inlineFragment: {};
    }
}
export namespace basicName {
    let fullName: string[];
    let altName: string[];
}
export namespace completeName {
    export let firstGivenName: string[];
    export let familyName: string[];
    let fullName_1: string[];
    export { fullName_1 as fullName };
    let altName_1: string[];
    export { altName_1 as altName };
}
