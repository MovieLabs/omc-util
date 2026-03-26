export namespace entityEdges {
    export namespace Asset {
        namespace intrinsicProps {
            export namespace Context {
                let type: string;
                let path: string;
                let allowed: string[];
            }
            export namespace Asset_1 {
                let type_1: string;
                export { type_1 as type };
                let path_1: string;
                export { path_1 as path };
                let allowed_1: string[];
                export { allowed_1 as allowed };
            }
            export { Asset_1 as Asset };
            export namespace AssetSC {
                let type_2: string;
                export { type_2 as type };
                let path_2: string;
                export { path_2 as path };
                let allowed_2: string[];
                export { allowed_2 as allowed };
            }
            export namespace Depiction {
                let type_3: string;
                export { type_3 as type };
                let path_3: string;
                export { path_3 as path };
                let allowed_3: string[];
                export { allowed_3 as allowed };
            }
        }
        namespace edges {
            let _for: string[];
            export { _for as for };
            export let has: string[];
            export let usedIn: string[];
        }
    }
    export namespace AssetSC_1 {
        let intrinsicProps_1: {};
        export { intrinsicProps_1 as intrinsicProps };
        let edges_1: {};
        export { edges_1 as edges };
    }
    export { AssetSC_1 as AssetSC };
    export namespace Character {
        export namespace intrinsicProps_2 {
            export namespace Context_1 {
                let type_4: string;
                export { type_4 as type };
                let path_4: string;
                export { path_4 as path };
                let allowed_4: string[];
                export { allowed_4 as allowed };
            }
            export { Context_1 as Context };
            export namespace Depiction_1 {
                let type_5: string;
                export { type_5 as type };
                let path_5: string;
                export { path_5 as path };
                let allowed_5: string[];
                export { allowed_5 as allowed };
            }
            export { Depiction_1 as Depiction };
        }
        export { intrinsicProps_2 as intrinsicProps };
        export namespace edges_2 {
            let featuresIn: string[];
            let needs: string[];
        }
        export { edges_2 as edges };
    }
    export namespace CreativeWork {
        export namespace intrinsicProps_3 {
            export namespace Context_2 {
                let type_6: string;
                export { type_6 as type };
                let path_6: string;
                export { path_6 as path };
                let allowed_6: string[];
                export { allowed_6 as allowed };
            }
            export { Context_2 as Context };
        }
        export { intrinsicProps_3 as intrinsicProps };
        export namespace edges_3 {
            let has_1: string[];
            export { has_1 as has };
        }
        export { edges_3 as edges };
    }
    export namespace Context_3 {
        export namespace intrinsicProps_4 {
            export namespace Context_4 {
                let type_7: string;
                export { type_7 as type };
                let path_7: string;
                export { path_7 as path };
                let allowed_7: string[];
                export { allowed_7 as allowed };
            }
            export { Context_4 as Context };
            export namespace ForEntity {
                let type_8: string;
                export { type_8 as type };
                let path_8: string;
                export { path_8 as path };
                let allowed_8: any;
                export { allowed_8 as allowed };
            }
        }
        export { intrinsicProps_4 as intrinsicProps };
        let edges_4: {};
        export { edges_4 as edges };
    }
    export { Context_3 as Context };
    export namespace Depiction_2 {
        export namespace intrinsicProps_5 {
            export namespace Context_5 {
                let type_9: string;
                export { type_9 as type };
                let path_9: string;
                export { path_9 as path };
                let allowed_9: string[];
                export { allowed_9 as allowed };
            }
            export { Context_5 as Context };
            export namespace Depicts {
                let type_10: string;
                export { type_10 as type };
                let path_10: string;
                export { path_10 as path };
                let allowed_10: string[];
                export { allowed_10 as allowed };
            }
            export namespace Depictor {
                let type_11: string;
                export { type_11 as type };
                let path_11: string;
                export { path_11 as path };
                let allowed_11: string[];
                export { allowed_11 as allowed };
            }
        }
        export { intrinsicProps_5 as intrinsicProps };
        export namespace edges_5 {
            let usedIn_1: string[];
            export { usedIn_1 as usedIn };
        }
        export { edges_5 as edges };
    }
    export { Depiction_2 as Depiction };
    export namespace Effect {
        export namespace intrinsicProps_6 {
            export namespace Context_6 {
                let type_12: string;
                export { type_12 as type };
                let path_12: string;
                export { path_12 as path };
                let allowed_12: string[];
                export { allowed_12 as allowed };
            }
            export { Context_6 as Context };
        }
        export { intrinsicProps_6 as intrinsicProps };
        export namespace edges_6 {
            let featuresIn_1: string[];
            export { featuresIn_1 as featuresIn };
            export let neededBy: string[];
        }
        export { edges_6 as edges };
    }
    export namespace NarrativeAudio {
        export namespace intrinsicProps_7 {
            export namespace Context_7 {
                let type_13: string;
                export { type_13 as type };
                let path_13: string;
                export { path_13 as path };
                let allowed_13: string[];
                export { allowed_13 as allowed };
            }
            export { Context_7 as Context };
            export namespace Depiction_3 {
                let type_14: string;
                export { type_14 as type };
                let path_14: string;
                export { path_14 as path };
                let allowed_14: string[];
                export { allowed_14 as allowed };
            }
            export { Depiction_3 as Depiction };
        }
        export { intrinsicProps_7 as intrinsicProps };
        export namespace edges_7 {
            let featuresIn_2: string[];
            export { featuresIn_2 as featuresIn };
            let neededBy_1: string[];
            export { neededBy_1 as neededBy };
        }
        export { edges_7 as edges };
    }
    export namespace NarrativeLocation {
        export namespace intrinsicProps_8 {
            export namespace Context_8 {
                let type_15: string;
                export { type_15 as type };
                let path_15: string;
                export { path_15 as path };
                let allowed_15: string[];
                export { allowed_15 as allowed };
            }
            export { Context_8 as Context };
            export namespace Depiction_4 {
                let type_16: string;
                export { type_16 as type };
                let path_16: string;
                export { path_16 as path };
                let allowed_16: string[];
                export { allowed_16 as allowed };
            }
            export { Depiction_4 as Depiction };
            export namespace Location {
                let type_17: string;
                export { type_17 as type };
                let path_17: string;
                export { path_17 as path };
                let allowed_17: string[];
                export { allowed_17 as allowed };
            }
        }
        export { intrinsicProps_8 as intrinsicProps };
        export namespace edges_8 {
            let features: string[];
        }
        export { edges_8 as edges };
    }
    export namespace NarrativeObject {
        export namespace intrinsicProps_9 {
            export namespace Context_9 {
                let type_18: string;
                export { type_18 as type };
                let path_18: string;
                export { path_18 as path };
                let allowed_18: string[];
                export { allowed_18 as allowed };
            }
            export { Context_9 as Context };
            export namespace Depiction_5 {
                let type_19: string;
                export { type_19 as type };
                let path_19: string;
                export { path_19 as path };
                let allowed_19: string[];
                export { allowed_19 as allowed };
            }
            export { Depiction_5 as Depiction };
        }
        export { intrinsicProps_9 as intrinsicProps };
        export namespace edges_9 {
            let featuresIn_3: string[];
            export { featuresIn_3 as featuresIn };
            let neededBy_2: string[];
            export { neededBy_2 as neededBy };
        }
        export { edges_9 as edges };
    }
    export namespace NarrativeScene {
        export namespace intrinsicProps_10 {
            export namespace Context_10 {
                let type_20: string;
                export { type_20 as type };
                let path_20: string;
                export { path_20 as path };
                let allowed_20: string[];
                export { allowed_20 as allowed };
            }
            export { Context_10 as Context };
            export namespace Depiction_6 {
                let type_21: string;
                export { type_21 as type };
                let path_21: string;
                export { path_21 as path };
                let allowed_21: string[];
                export { allowed_21 as allowed };
            }
            export { Depiction_6 as Depiction };
        }
        export { intrinsicProps_10 as intrinsicProps };
        export namespace edges_10 {
            let features_1: string[];
            export { features_1 as features };
            let _for_1: string[];
            export { _for_1 as for };
            let has_2: string[];
            export { has_2 as has };
        }
        export { edges_10 as edges };
    }
    export namespace NarrativeStyling {
        export namespace intrinsicProps_11 {
            export namespace Context_11 {
                let type_22: string;
                export { type_22 as type };
                let path_22: string;
                export { path_22 as path };
                let allowed_22: string[];
                export { allowed_22 as allowed };
            }
            export { Context_11 as Context };
            export namespace Depiction_7 {
                let type_23: string;
                export { type_23 as type };
                let path_23: string;
                export { path_23 as path };
                let allowed_23: string[];
                export { allowed_23 as allowed };
            }
            export { Depiction_7 as Depiction };
        }
        export { intrinsicProps_11 as intrinsicProps };
        export namespace edges_11 {
            let featuresIn_4: string[];
            export { featuresIn_4 as featuresIn };
            let neededBy_3: string[];
            export { neededBy_3 as neededBy };
        }
        export { edges_11 as edges };
    }
    export namespace NarrativeWardrobe {
        export namespace intrinsicProps_12 {
            export namespace Context_12 {
                let type_24: string;
                export { type_24 as type };
                let path_24: string;
                export { path_24 as path };
                let allowed_24: string[];
                export { allowed_24 as allowed };
            }
            export { Context_12 as Context };
            export namespace Depiction_8 {
                let type_25: string;
                export { type_25 as type };
                let path_25: string;
                export { path_25 as path };
                let allowed_25: string[];
                export { allowed_25 as allowed };
            }
            export { Depiction_8 as Depiction };
        }
        export { intrinsicProps_12 as intrinsicProps };
        export namespace edges_12 {
            let featuresIn_5: string[];
            export { featuresIn_5 as featuresIn };
            let neededBy_4: string[];
            export { neededBy_4 as neededBy };
        }
        export { edges_12 as edges };
    }
    export namespace ProductionScene {
        export namespace intrinsicProps_13 {
            export namespace Context_13 {
                let type_26: string;
                export { type_26 as type };
                let path_26: string;
                export { path_26 as path };
                let allowed_26: string[];
                export { allowed_26 as allowed };
            }
            export { Context_13 as Context };
        }
        export { intrinsicProps_13 as intrinsicProps };
        export namespace edges_13 {
            let _for_2: string[];
            export { _for_2 as for };
            let has_3: string[];
            export { has_3 as has };
            export let related: string[];
            export let uses: string[];
        }
        export { edges_13 as edges };
    }
    export namespace ProductionLocation {
        export namespace intrinsicProps_14 {
            export namespace Context_14 {
                let type_27: string;
                export { type_27 as type };
                let path_27: string;
                export { path_27 as path };
                let allowed_27: string[];
                export { allowed_27 as allowed };
            }
            export { Context_14 as Context };
        }
        export { intrinsicProps_14 as intrinsicProps };
        export namespace edges_14 {
            let usedIn_2: string[];
            export { usedIn_2 as usedIn };
        }
        export { edges_14 as edges };
    }
    export namespace Slate {
        export namespace intrinsicProps_15 {
            export namespace Context_15 {
                let type_28: string;
                export { type_28 as type };
                let path_28: string;
                export { path_28 as path };
                let allowed_28: string[];
                export { allowed_28 as allowed };
            }
            export { Context_15 as Context };
        }
        export { intrinsicProps_15 as intrinsicProps };
        export namespace edges_15 {
            let has_4: string[];
            export { has_4 as has };
            let _for_3: string[];
            export { _for_3 as for };
        }
        export { edges_15 as edges };
    }
    export namespace SpecialAction {
        export namespace intrinsicProps_16 {
            export namespace Context_16 {
                let type_29: string;
                export { type_29 as type };
                let path_29: string;
                export { path_29 as path };
                let allowed_29: string[];
                export { allowed_29 as allowed };
            }
            export { Context_16 as Context };
        }
        export { intrinsicProps_16 as intrinsicProps };
        export namespace edges_16 {
            let featuresIn_6: string[];
            export { featuresIn_6 as featuresIn };
            let neededBy_5: string[];
            export { neededBy_5 as neededBy };
        }
        export { edges_16 as edges };
    }
    export namespace Participant {
        export namespace intrinsicProps_17 {
            export namespace Context_17 {
                let type_30: string;
                export { type_30 as type };
                let path_30: string;
                export { path_30 as path };
                let allowed_30: string[];
                export { allowed_30 as allowed };
            }
            export { Context_17 as Context };
            export namespace ParticipantSC {
                let type_31: string;
                export { type_31 as type };
                let path_31: string;
                export { path_31 as path };
                let allowed_31: string[];
                export { allowed_31 as allowed };
            }
            export namespace Role {
                let type_32: string;
                export { type_32 as type };
                let path_32: string;
                export { path_32 as path };
                let allowed_32: string[];
                export { allowed_32 as allowed };
            }
        }
        export { intrinsicProps_17 as intrinsicProps };
        export namespace edges_17 {
            let _for_4: string[];
            export { _for_4 as for };
        }
        export { edges_17 as edges };
    }
    export namespace Person {
        export namespace intrinsicProps_18 {
            export namespace Context_18 {
                let type_33: string;
                export { type_33 as type };
                let path_33: string;
                export { path_33 as path };
                let allowed_33: string[];
                export { allowed_33 as allowed };
            }
            export { Context_18 as Context };
        }
        export { intrinsicProps_18 as intrinsicProps };
        let edges_18: {};
        export { edges_18 as edges };
    }
    export namespace Organization {
        export namespace intrinsicProps_19 {
            export namespace Context_19 {
                let type_34: string;
                export { type_34 as type };
                let path_34: string;
                export { path_34 as path };
                let allowed_34: string[];
                export { allowed_34 as allowed };
            }
            export { Context_19 as Context };
        }
        export { intrinsicProps_19 as intrinsicProps };
        let edges_19: {};
        export { edges_19 as edges };
    }
    export namespace Department {
        export namespace intrinsicProps_20 {
            export namespace Context_20 {
                let type_35: string;
                export { type_35 as type };
                let path_35: string;
                export { path_35 as path };
                let allowed_35: string[];
                export { allowed_35 as allowed };
            }
            export { Context_20 as Context };
        }
        export { intrinsicProps_20 as intrinsicProps };
        let edges_20: {};
        export { edges_20 as edges };
    }
    export namespace Service {
        export namespace intrinsicProps_21 {
            export namespace Context_21 {
                let type_36: string;
                export { type_36 as type };
                let path_36: string;
                export { path_36 as path };
                let allowed_36: string[];
                export { allowed_36 as allowed };
            }
            export { Context_21 as Context };
        }
        export { intrinsicProps_21 as intrinsicProps };
        let edges_21: {};
        export { edges_21 as edges };
    }
    export namespace Role_1 {
        export namespace intrinsicProps_22 {
            export namespace Context_22 {
                let type_37: string;
                export { type_37 as type };
                let path_37: string;
                export { path_37 as path };
                let allowed_37: string[];
                export { allowed_37 as allowed };
            }
            export { Context_22 as Context };
        }
        export { intrinsicProps_22 as intrinsicProps };
        let edges_22: {};
        export { edges_22 as edges };
    }
    export { Role_1 as Role };
    export namespace Infrastructure {
        export namespace intrinsicProps_23 {
            export namespace Context_23 {
                let type_38: string;
                export { type_38 as type };
                let path_38: string;
                export { path_38 as path };
                let allowed_38: string[];
                export { allowed_38 as allowed };
            }
            export { Context_23 as Context };
        }
        export { intrinsicProps_23 as intrinsicProps };
        export namespace edges_23 {
            let has_5: string[];
            export { has_5 as has };
        }
        export { edges_23 as edges };
    }
    export namespace Task {
        export namespace intrinsicProps_24 {
            export namespace Context_24 {
                let type_39: string;
                export { type_39 as type };
                let path_39: string;
                export { path_39 as path };
                let allowed_39: string[];
                export { allowed_39 as allowed };
            }
            export { Context_24 as Context };
        }
        export { intrinsicProps_24 as intrinsicProps };
        let edges_24: {};
        export { edges_24 as edges };
    }
    export namespace Composition {
        export namespace intrinsicProps_25 {
            export namespace Context_25 {
                let type_40: string;
                export { type_40 as type };
                let path_40: string;
                export { path_40 as path };
                let allowed_40: string[];
                export { allowed_40 as allowed };
            }
            export { Context_25 as Context };
            export namespace Asset_2 {
                let type_41: string;
                export { type_41 as type };
                let path_41: string;
                export { path_41 as path };
                let allowed_41: string[];
                export { allowed_41 as allowed };
            }
            export { Asset_2 as Asset };
            export namespace AssetSC_2 {
                let type_42: string;
                export { type_42 as type };
                let path_42: string;
                export { path_42 as path };
                let allowed_42: string[];
                export { allowed_42 as allowed };
            }
            export { AssetSC_2 as AssetSC };
            export namespace Composition_1 {
                let type_43: string;
                export { type_43 as type };
                let path_43: string;
                export { path_43 as path };
                let allowed_43: string[];
                export { allowed_43 as allowed };
            }
            export { Composition_1 as Composition };
            export namespace StartHere {
                let type_44: string;
                export { type_44 as type };
                let path_44: string;
                export { path_44 as path };
                let allowed_44: string[];
                export { allowed_44 as allowed };
            }
        }
        export { intrinsicProps_25 as intrinsicProps };
        let edges_25: {};
        export { edges_25 as edges };
    }
    export namespace Location_1 {
        export namespace intrinsicProps_26 {
            export namespace Context_26 {
                let type_45: string;
                export { type_45 as type };
                let path_45: string;
                export { path_45 as path };
                let allowed_45: string[];
                export { allowed_45 as allowed };
            }
            export { Context_26 as Context };
        }
        export { intrinsicProps_26 as intrinsicProps };
        let edges_26: {};
        export { edges_26 as edges };
    }
    export { Location_1 as Location };
}
export type EntityDetail = any;
export type intrinsicProps = any;
/**
 * - A list of allowed edges to other entity types
 */
export type edges = any;
