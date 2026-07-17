export namespace software {
    namespace template {
        namespace softwareName {
            let $type: string;
        }
        namespace softwareVersion {
            let $type_1: string;
            export { $type_1 as $type };
        }
        namespace apiVersion {
            let $type_2: string;
            export { $type_2 as $type };
        }
        namespace parameters {
            let $type_3: string;
            export { $type_3 as $type };
        }
        namespace ConfigurationFile {
            let $type_4: string;
            export { $type_4 as $type };
            export namespace $edge {
                let $allowed: string[];
            }
        }
    }
    namespace graphQl {
        namespace properties {
            let softwareName_1: any;
            export { softwareName_1 as softwareName };
            let softwareVersion_1: any;
            export { softwareVersion_1 as softwareVersion };
            let apiVersion_1: any;
            export { apiVersion_1 as apiVersion };
            let parameters_1: any;
            export { parameters_1 as parameters };
            let ConfigurationFile_1: any;
            export { ConfigurationFile_1 as ConfigurationFile };
        }
        let filter: any;
        let inlineFragment: any;
    }
}
export namespace completeName {
    export namespace template_1 {
        namespace firstGivenName {
            let $type_5: string;
            export { $type_5 as $type };
        }
        namespace familyName {
            let $type_6: string;
            export { $type_6 as $type };
        }
        namespace fullName {
            let $type_7: string;
            export { $type_7 as $type };
        }
        namespace altName {
            let $type_8: string;
            export { $type_8 as $type };
        }
    }
    export { template_1 as template };
    export namespace graphQl_1 {
        export namespace properties_1 {
            let firstGivenName_1: string;
            export { firstGivenName_1 as firstGivenName };
            let familyName_1: string;
            export { familyName_1 as familyName };
            let fullName_1: string;
            export { fullName_1 as fullName };
            let altName_1: string;
            export { altName_1 as altName };
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
    export namespace template_2 {
        export namespace fullName_2 {
            let $type_9: string;
            export { $type_9 as $type };
        }
        export { fullName_2 as fullName };
        export namespace altName_2 {
            let $type_10: string;
            export { $type_10 as $type };
        }
        export { altName_2 as altName };
    }
    export { template_2 as template };
    export namespace graphQl_2 {
        export namespace properties_2 {
            let fullName_3: string;
            export { fullName_3 as fullName };
            let altName_3: string;
            export { altName_3 as altName };
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
    export namespace template_3 {
        namespace title {
            let $type_11: string;
            export { $type_11 as $type };
        }
        namespace text {
            let $type_12: string;
            export { $type_12 as $type };
        }
    }
    export { template_3 as template };
    export namespace graphQl_3 {
        export namespace properties_3 {
            let title_1: any;
            export { title_1 as title };
            let text_1: any;
            export { text_1 as text };
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
    export namespace template_4 {
        namespace gender {
            let $type_13: string;
            export { $type_13 as $type };
        }
        namespace genderPronoun {
            let $type_14: string;
            export { $type_14 as $type };
        }
    }
    export { template_4 as template };
    export namespace graphQl_4 {
        export namespace properties_4 {
            let gender_1: any;
            export { gender_1 as gender };
            let genderPronoun_1: any;
            export { genderPronoun_1 as genderPronoun };
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
    export namespace template_5 {
        namespace email {
            namespace business {
                let $type_15: string;
                export { $type_15 as $type };
            }
            namespace personal {
                let $type_16: string;
                export { $type_16 as $type };
            }
        }
        namespace telephone {
            export namespace business_1 {
                let $type_17: string;
                export { $type_17 as $type };
            }
            export { business_1 as business };
            export namespace personal_1 {
                let $type_18: string;
                export { $type_18 as $type };
            }
            export { personal_1 as personal };
        }
    }
    export { template_5 as template };
    export namespace graphQl_5 {
        export namespace properties_5 {
            export namespace email_1 {
                let business_2: any;
                export { business_2 as business };
                let personal_2: any;
                export { personal_2 as personal };
            }
            export { email_1 as email };
            export namespace telephone_1 {
                let business_3: any;
                export { business_3 as business };
                let personal_3: any;
                export { personal_3 as personal };
            }
            export { telephone_1 as telephone };
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
    export namespace template_6 {
        namespace schemaVersion {
            let $type_19: string;
            export { $type_19 as $type };
        }
        namespace identifier {
            namespace identifierScope {
                let $type_20: string;
                export { $type_20 as $type };
            }
            namespace identifierValue {
                let $type_21: string;
                export { $type_21 as $type };
            }
        }
        namespace entityType {
            let $type_22: string;
            export { $type_22 as $type };
        }
        namespace name {
            let $type_23: string;
            export { $type_23 as $type };
        }
        namespace description {
            let $type_24: string;
            export { $type_24 as $type };
        }
        namespace annotation {
            export namespace author {
                let $type_25: string;
                export { $type_25 as $type };
            }
            export namespace title_2 {
                let $type_26: string;
                export { $type_26 as $type };
            }
            export { title_2 as title };
            export namespace text_2 {
                let $type_27: string;
                export { $type_27 as $type };
            }
            export { text_2 as text };
        }
        namespace tag {
            namespace domain {
                let $type_28: string;
                export { $type_28 as $type };
            }
            namespace value {
                let $type_29: string;
                export { $type_29 as $type };
            }
        }
        namespace customData {
            let $type_30: string;
            export { $type_30 as $type };
        }
    }
    export { template_6 as template };
    export namespace graphQl_6 {
        export namespace properties_6 {
            let schemaVersion_1: any;
            export { schemaVersion_1 as schemaVersion };
            export namespace identifier_1 {
                let identifierScope_1: string;
                export { identifierScope_1 as identifierScope };
                let identifierValue_1: string;
                export { identifierValue_1 as identifierValue };
            }
            export { identifier_1 as identifier };
            let entityType_1: any;
            export { entityType_1 as entityType };
            let name_1: string;
            export { name_1 as name };
            let description_1: any;
            export { description_1 as description };
            export namespace annotation_1 {
                let author_1: any;
                export { author_1 as author };
                let title_3: any;
                export { title_3 as title };
                let text_3: any;
                export { text_3 as text };
            }
            export { annotation_1 as annotation };
            export namespace tag_1 {
                let domain_1: any;
                export { domain_1 as domain };
                let value_1: any;
                export { value_1 as value };
            }
            export { tag_1 as tag };
            let customData_1: any;
            export { customData_1 as customData };
        }
        export { properties_6 as properties };
        export namespace filter_6 {
            export namespace identifier_2 {
                let identifierScope_2: string;
                export { identifierScope_2 as identifierScope };
                let identifierValue_2: string;
                export { identifierValue_2 as identifierValue };
            }
            export { identifier_2 as identifier };
            let name_2: string;
            export { name_2 as name };
        }
        export { filter_6 as filter };
        let inlineFragment_6: any;
        export { inlineFragment_6 as inlineFragment };
    }
    export { graphQl_6 as graphQl };
}
//# sourceMappingURL=utility.d.ts.map