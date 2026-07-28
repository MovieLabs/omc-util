export namespace software {
    namespace graphQl {
        namespace properties {
            let softwareName: any;
            let softwareVersion: any;
            let apiVersion: any;
            let parameters: any;
            let ConfigurationFile: any;
        }
        let filter: any;
        let inlineFragment: any;
    }
}
export namespace completeName {
    export namespace graphQl_1 {
        export namespace properties_1 {
            let firstGivenName: string;
            let familyName: string;
            let fullName: string;
            let altName: string;
        }
        export { properties_1 as properties };
        let filter_1: any;
        export { filter_1 as filter };
        let inlineFragment_1: any;
        export { inlineFragment_1 as inlineFragment };
    }
    export { graphQl_1 as graphQl };
}
export namespace basicName {
    export namespace graphQl_2 {
        export namespace properties_2 {
            let fullName_1: string;
            export { fullName_1 as fullName };
            let altName_1: string;
            export { altName_1 as altName };
        }
        export { properties_2 as properties };
        let filter_2: any;
        export { filter_2 as filter };
        let inlineFragment_2: any;
        export { inlineFragment_2 as inlineFragment };
    }
    export { graphQl_2 as graphQl };
}
export namespace note {
    export namespace graphQl_3 {
        export namespace properties_3 {
            let title: any;
            let text: any;
        }
        export { properties_3 as properties };
        let filter_3: any;
        export { filter_3 as filter };
        let inlineFragment_3: any;
        export { inlineFragment_3 as inlineFragment };
    }
    export { graphQl_3 as graphQl };
}
export namespace gender {
    export namespace graphQl_4 {
        export namespace properties_4 {
            let gender: any;
            let genderPronoun: any;
        }
        export { properties_4 as properties };
        let filter_4: any;
        export { filter_4 as filter };
        let inlineFragment_4: any;
        export { inlineFragment_4 as inlineFragment };
    }
    export { graphQl_4 as graphQl };
}
export namespace contact {
    export namespace graphQl_5 {
        export namespace properties_5 {
            namespace email {
                let business: any;
                let personal: any;
            }
            namespace telephone {
                let business_1: any;
                export { business_1 as business };
                let personal_1: any;
                export { personal_1 as personal };
            }
        }
        export { properties_5 as properties };
        let filter_5: any;
        export { filter_5 as filter };
        let inlineFragment_5: any;
        export { inlineFragment_5 as inlineFragment };
    }
    export { graphQl_5 as graphQl };
}
export namespace baseEntity {
    export namespace graphQl_6 {
        export namespace properties_6 {
            let schemaVersion: any;
            namespace identifier {
                let identifierScope: string;
                let identifierValue: string;
            }
            let entityType: any;
            let name: string;
            let description: any;
            namespace annotation {
                export let author: any;
                let title_1: any;
                export { title_1 as title };
                let text_1: any;
                export { text_1 as text };
            }
            namespace tag {
                let domain: any;
                let value: any;
            }
            let customData: any;
        }
        export { properties_6 as properties };
        export namespace filter_6 {
            export namespace identifier_1 {
                let identifierScope_1: string;
                export { identifierScope_1 as identifierScope };
                let identifierValue_1: string;
                export { identifierValue_1 as identifierValue };
            }
            export { identifier_1 as identifier };
            let name_1: string;
            export { name_1 as name };
        }
        export { filter_6 as filter };
        let inlineFragment_6: any;
        export { inlineFragment_6 as inlineFragment };
    }
    export { graphQl_6 as graphQl };
}
//# sourceMappingURL=utility.d.ts.map