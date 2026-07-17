export function tentativeRdf({ domain, predicate, range }: {
    domain: any;
    predicate: any;
    range: any;
}): string;
export function intrinsicRdf({ predicate }: {
    predicate: any;
}): string;
export namespace edgeDefinitions {
    export namespace has {
        export let predicate: string;
        export let cardinality: string;
        export let inverse: string;
        export { tentativeRdf as rdf };
        export let connects: ({
            domain: string[];
            range: string[];
            rdfMap: string[];
            inverse?: undefined;
        } | {
            domain: string[];
            range: string[];
            inverse: string;
            rdfMap: any[];
        })[];
    }
    export namespace _for {
        let predicate_1: string;
        export { predicate_1 as predicate };
        let cardinality_1: string;
        export { cardinality_1 as cardinality };
        let inverse_1: string;
        export { inverse_1 as inverse };
        export { tentativeRdf as rdf };
        let connects_1: ({
            domain: string[];
            range: string[];
            rdfMap: string[];
            inverse?: undefined;
        } | {
            domain: string[];
            range: string[];
            inverse: string;
            rdfMap: string[];
        })[];
        export { connects_1 as connects };
    }
    export { _for as for };
    export namespace needs {
        let predicate_2: string;
        export { predicate_2 as predicate };
        let cardinality_2: string;
        export { cardinality_2 as cardinality };
        let inverse_2: string;
        export { inverse_2 as inverse };
        export { tentativeRdf as rdf };
        let connects_2: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_2 as connects };
    }
    export namespace neededBy {
        let predicate_3: string;
        export { predicate_3 as predicate };
        let cardinality_3: string;
        export { cardinality_3 as cardinality };
        let inverse_3: string;
        export { inverse_3 as inverse };
        export { tentativeRdf as rdf };
        let connects_3: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_3 as connects };
    }
    export namespace features {
        let predicate_4: string;
        export { predicate_4 as predicate };
        let cardinality_4: string;
        export { cardinality_4 as cardinality };
        let inverse_4: string;
        export { inverse_4 as inverse };
        export { tentativeRdf as rdf };
        let connects_4: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_4 as connects };
    }
    export namespace featuresIn {
        let predicate_5: string;
        export { predicate_5 as predicate };
        let cardinality_5: string;
        export { cardinality_5 as cardinality };
        let inverse_5: string;
        export { inverse_5 as inverse };
        export { tentativeRdf as rdf };
        let connects_5: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_5 as connects };
    }
    export namespace uses {
        let predicate_6: string;
        export { predicate_6 as predicate };
        let cardinality_6: string;
        export { cardinality_6 as cardinality };
        let inverse_6: string;
        export { inverse_6 as inverse };
        export { tentativeRdf as rdf };
        let connects_6: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_6 as connects };
    }
    export namespace usedBy {
        let predicate_7: string;
        export { predicate_7 as predicate };
        let cardinality_7: string;
        export { cardinality_7 as cardinality };
        let inverse_7: string;
        export { inverse_7 as inverse };
        export { tentativeRdf as rdf };
        let connects_7: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_7 as connects };
    }
    export namespace usedIn {
        let predicate_8: string;
        export { predicate_8 as predicate };
        let cardinality_8: string;
        export { cardinality_8 as cardinality };
        let inverse_8: string;
        export { inverse_8 as inverse };
        export { tentativeRdf as rdf };
        let connects_8: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_8 as connects };
    }
    export namespace contributesTo {
        let predicate_9: string;
        export { predicate_9 as predicate };
        let cardinality_9: string;
        export { cardinality_9 as cardinality };
        let inverse_9: string;
        export { inverse_9 as inverse };
        export { tentativeRdf as rdf };
        let connects_9: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_9 as connects };
    }
    export namespace contributor {
        let predicate_10: string;
        export { predicate_10 as predicate };
        let cardinality_10: string;
        export { cardinality_10 as cardinality };
        let inverse_10: string;
        export { inverse_10 as inverse };
        export { tentativeRdf as rdf };
        let connects_10: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_10 as connects };
    }
    export namespace informs {
        let predicate_11: string;
        export { predicate_11 as predicate };
        let cardinality_11: string;
        export { cardinality_11 as cardinality };
        let inverse_11: string;
        export { inverse_11 as inverse };
        export { tentativeRdf as rdf };
        let connects_11: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_11 as connects };
    }
    export namespace informedBy {
        let predicate_12: string;
        export { predicate_12 as predicate };
        let cardinality_12: string;
        export { cardinality_12 as cardinality };
        let inverse_12: string;
        export { inverse_12 as inverse };
        export { tentativeRdf as rdf };
        let connects_12: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_12 as connects };
    }
    export namespace related {
        let predicate_13: string;
        export { predicate_13 as predicate };
        let cardinality_13: string;
        export { cardinality_13 as cardinality };
        let inverse_13: string;
        export { inverse_13 as inverse };
        export { tentativeRdf as rdf };
        let connects_13: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_13 as connects };
    }
    export namespace productOf {
        let predicate_14: string;
        export { predicate_14 as predicate };
        let cardinality_14: string;
        export { cardinality_14 as cardinality };
        let inverse_14: string;
        export { inverse_14 as inverse };
        export function rdf(): string;
        let connects_14: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_14 as connects };
    }
    export namespace memberOf {
        let predicate_15: string;
        export { predicate_15 as predicate };
        let cardinality_15: string;
        export { cardinality_15 as cardinality };
        let inverse_15: string;
        export { inverse_15 as inverse };
        export { tentativeRdf as rdf };
        let connects_15: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_15 as connects };
    }
    export namespace hasCxt {
        let predicate_16: string;
        export { predicate_16 as predicate };
        let cardinality_16: string;
        export { cardinality_16 as cardinality };
        let inverse_16: string;
        export { inverse_16 as inverse };
        export function rdf_1(): string;
        export { rdf_1 as rdf };
        let connects_16: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_16 as connects };
    }
    export namespace cxtFor {
        let predicate_17: string;
        export { predicate_17 as predicate };
        let cardinality_17: string;
        export { cardinality_17 as cardinality };
        let inverse_17: string;
        export { inverse_17 as inverse };
        export function rdf_2(): string;
        export { rdf_2 as rdf };
        let connects_17: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_17 as connects };
    }
    export namespace AssetStructure {
        let predicate_18: string;
        export { predicate_18 as predicate };
        export let placement: string;
        let cardinality_18: string;
        export { cardinality_18 as cardinality };
        let inverse_18: any;
        export { inverse_18 as inverse };
        export function rdf_3(): string;
        export { rdf_3 as rdf };
        let connects_18: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_18 as connects };
    }
    export namespace Depicts {
        let predicate_19: string;
        export { predicate_19 as predicate };
        let placement_1: string;
        export { placement_1 as placement };
        let cardinality_19: string;
        export { cardinality_19 as cardinality };
        let inverse_19: string;
        export { inverse_19 as inverse };
        export { tentativeRdf as rdf };
        let connects_19: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_19 as connects };
    }
    export namespace Depicter {
        let predicate_20: string;
        export { predicate_20 as predicate };
        let placement_2: string;
        export { placement_2 as placement };
        let cardinality_20: string;
        export { cardinality_20 as cardinality };
        let inverse_20: string;
        export { inverse_20 as inverse };
        export { tentativeRdf as rdf };
        let connects_20: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_20 as connects };
    }
    export namespace RealizationOf {
        let predicate_21: string;
        export { predicate_21 as predicate };
        let placement_3: string;
        export { placement_3 as placement };
        let cardinality_21: string;
        export { cardinality_21 as cardinality };
        let inverse_21: string;
        export { inverse_21 as inverse };
        export { tentativeRdf as rdf };
        let connects_21: {
            domain: string[];
            path: string;
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_21 as connects };
    }
    export namespace RealizationBy {
        let predicate_22: string;
        export { predicate_22 as predicate };
        let placement_4: string;
        export { placement_4 as placement };
        let cardinality_22: string;
        export { cardinality_22 as cardinality };
        let inverse_22: string;
        export { inverse_22 as inverse };
        export { tentativeRdf as rdf };
        let connects_22: {
            domain: string[];
            path: string;
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_22 as connects };
    }
    export namespace ParticipantStructure {
        let predicate_23: string;
        export { predicate_23 as predicate };
        let placement_5: string;
        export { placement_5 as placement };
        let cardinality_23: string;
        export { cardinality_23 as cardinality };
        let inverse_23: any;
        export { inverse_23 as inverse };
        export function rdf_4(): string;
        export { rdf_4 as rdf };
        let connects_23: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_23 as connects };
    }
    export namespace InfrastructureStructure {
        let predicate_24: string;
        export { predicate_24 as predicate };
        let placement_6: string;
        export { placement_6 as placement };
        let cardinality_24: string;
        export { cardinality_24 as cardinality };
        let inverse_24: any;
        export { inverse_24 as inverse };
        export function rdf_5(): string;
        export { rdf_5 as rdf };
        let connects_24: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_24 as connects };
    }
    export namespace TaskStructure {
        let predicate_25: string;
        export { predicate_25 as predicate };
        let placement_7: string;
        export { placement_7 as placement };
        let cardinality_25: string;
        export { cardinality_25 as cardinality };
        let inverse_25: any;
        export { inverse_25 as inverse };
        export function rdf_6(): string;
        export { rdf_6 as rdf };
        let connects_25: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_25 as connects };
    }
    export namespace Member {
        let predicate_26: string;
        export { predicate_26 as predicate };
        let placement_8: string;
        export { placement_8 as placement };
        let cardinality_26: string;
        export { cardinality_26 as cardinality };
        let inverse_26: string;
        export { inverse_26 as inverse };
        export { intrinsicRdf as rdf };
        let connects_26: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_26 as connects };
    }
    export namespace includes {
        let predicate_27: string;
        export { predicate_27 as predicate };
        let placement_9: string;
        export { placement_9 as placement };
        export let pathTemplate: string;
        let cardinality_27: string;
        export { cardinality_27 as cardinality };
        let inverse_27: any;
        export { inverse_27 as inverse };
        export { intrinsicRdf as rdf };
        let connects_27: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_27 as connects };
    }
    export namespace ConfigurationFile {
        let predicate_28: string;
        export { predicate_28 as predicate };
        let placement_10: string;
        export { placement_10 as placement };
        export let path: string;
        let cardinality_28: string;
        export { cardinality_28 as cardinality };
        let inverse_28: any;
        export { inverse_28 as inverse };
        export function rdf_7(): string;
        export { rdf_7 as rdf };
        let connects_28: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_28 as connects };
    }
    export namespace StartHere {
        let predicate_29: string;
        export { predicate_29 as predicate };
        let placement_11: string;
        export { placement_11 as placement };
        let cardinality_29: string;
        export { cardinality_29 as cardinality };
        let inverse_29: any;
        export { inverse_29 as inverse };
        export function rdf_8(): string;
        export { rdf_8 as rdf };
        let connects_29: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_29 as connects };
    }
    export namespace Product {
        let predicate_30: string;
        export { predicate_30 as predicate };
        let placement_12: string;
        export { placement_12 as placement };
        let cardinality_30: string;
        export { cardinality_30 as cardinality };
        let inverse_30: string;
        export { inverse_30 as inverse };
        export { intrinsicRdf as rdf };
        let connects_30: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_30 as connects };
    }
    export namespace Provenance {
        let predicate_31: string;
        export { predicate_31 as predicate };
        let placement_13: string;
        export { placement_13 as placement };
        let cardinality_31: string;
        export { cardinality_31 as cardinality };
        let inverse_31: string;
        export { inverse_31 as inverse };
        export function rdf_9(): string;
        export { rdf_9 as rdf };
        let connects_31: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_31 as connects };
    }
    export namespace CreatedBy {
        let predicate_32: string;
        export { predicate_32 as predicate };
        let placement_14: string;
        export { placement_14 as placement };
        let cardinality_32: string;
        export { cardinality_32 as cardinality };
        let inverse_32: any;
        export { inverse_32 as inverse };
        export function rdf_10(): string;
        export { rdf_10 as rdf };
        let connects_32: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_32 as connects };
    }
    export namespace Origin {
        let predicate_33: string;
        export { predicate_33 as predicate };
        let placement_15: string;
        export { placement_15 as placement };
        let cardinality_33: string;
        export { cardinality_33 as cardinality };
        let inverse_33: any;
        export { inverse_33 as inverse };
        export { intrinsicRdf as rdf };
        let connects_33: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_33 as connects };
    }
    export namespace Role {
        let predicate_34: string;
        export { predicate_34 as predicate };
        let placement_16: string;
        export { placement_16 as placement };
        let cardinality_34: string;
        export { cardinality_34 as cardinality };
        let inverse_34: any;
        export { inverse_34 as inverse };
        export { intrinsicRdf as rdf };
        let connects_34: {
            domain: string[];
            range: string[];
            path: string;
            rdfMap: string[];
        }[];
        export { connects_34 as connects };
    }
    export namespace Director {
        let predicate_35: string;
        export { predicate_35 as predicate };
        let placement_17: string;
        export { placement_17 as placement };
        let cardinality_35: string;
        export { cardinality_35 as cardinality };
        let inverse_35: string;
        export { inverse_35 as inverse };
        export function rdf_11(): string;
        export { rdf_11 as rdf };
        let connects_35: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_35 as connects };
    }
    export namespace CreativeWork {
        let predicate_36: string;
        export { predicate_36 as predicate };
        let placement_18: string;
        export { placement_18 as placement };
        let cardinality_36: string;
        export { cardinality_36 as cardinality };
        let inverse_36: string;
        export { inverse_36 as inverse };
        export function rdf_12(): string;
        export { rdf_12 as rdf };
        let connects_36: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_36 as connects };
    }
    export namespace ProductionCompany {
        let predicate_37: string;
        export { predicate_37 as predicate };
        let placement_19: string;
        export { placement_19 as placement };
        let cardinality_37: string;
        export { cardinality_37 as cardinality };
        let inverse_37: string;
        export { inverse_37 as inverse };
        export function rdf_13(): string;
        export { rdf_13 as rdf };
        let connects_37: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_37 as connects };
    }
    export namespace Series {
        let predicate_38: string;
        export { predicate_38 as predicate };
        let placement_20: string;
        export { placement_20 as placement };
        let cardinality_38: string;
        export { cardinality_38 as cardinality };
        let inverse_38: string;
        export { inverse_38 as inverse };
        export { intrinsicRdf as rdf };
        let connects_38: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_38 as connects };
    }
    export namespace Season {
        let predicate_39: string;
        export { predicate_39 as predicate };
        let placement_21: string;
        export { placement_21 as placement };
        let cardinality_39: string;
        export { cardinality_39 as cardinality };
        let inverse_39: string;
        export { inverse_39 as inverse };
        export { intrinsicRdf as rdf };
        let connects_39: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_39 as connects };
    }
    export namespace Episode {
        let predicate_40: string;
        export { predicate_40 as predicate };
        let placement_22: string;
        export { placement_22 as placement };
        let cardinality_40: string;
        export { cardinality_40 as cardinality };
        let inverse_40: string;
        export { inverse_40 as inverse };
        export { intrinsicRdf as rdf };
        let connects_40: {
            domain: string[];
            range: string[];
            rdfMap: any[];
        }[];
        export { connects_40 as connects };
    }
    export namespace Location {
        let predicate_41: string;
        export { predicate_41 as predicate };
        let placement_23: string;
        export { placement_23 as placement };
        let cardinality_41: string;
        export { cardinality_41 as cardinality };
        let inverse_41: any;
        export { inverse_41 as inverse };
        export { intrinsicRdf as rdf };
        let connects_41: {
            domain: string[];
            range: string[];
            rdfMap: string[];
        }[];
        export { connects_41 as connects };
    }
}
//# sourceMappingURL=edges.d.ts.map