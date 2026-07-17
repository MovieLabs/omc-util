declare namespace validation {
    let Asset: {
        condition: {
            entityType: string;
            assetFC: {
                functionalType: string;
            };
        };
        constraint: {
            AssetSC: {
                structuralType: string[];
            };
            Member: string[];
            assetFC: {
                assetProperties: any;
                edges: {
                    for: {
                        CreativeWork: string[];
                    };
                    has: {
                        NarrativeScene: string[];
                    };
                };
            };
        };
    }[];
    let Character: {
        condition: {
            entityType: string;
            characterType: string;
        };
        constraint: {
            edges: {
                featuresIn: {
                    NarrativeScene: string[];
                };
                has: {
                    Portrayal: string[];
                    Context: string[];
                };
            };
        };
    }[];
}
//# sourceMappingURL=test-validation.d.ts.map