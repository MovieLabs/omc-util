declare namespace _default {
    let properties: {
        creativeWorkType: any;
        creativeWorkCategory: any;
        seasonNumber: any;
        episodeSequence: {
            houseSequence: any;
            distributionNumber: {
                value: any;
                domain: any;
            };
        };
        title: {
            titleName: any;
            titleType: any;
            titleLanguage: any;
        };
        approximateLength: any;
        originalLanguage: any;
        countryOfOrigin: any;
        Context: any;
        Series: any;
        Episode: any;
        ProductionCompany: any;
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
        namespace has {
            let allowed_1: string[];
            export { allowed_1 as allowed };
        }
    }
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
