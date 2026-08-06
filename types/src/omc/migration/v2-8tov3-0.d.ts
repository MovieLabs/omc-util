declare namespace _default {
    function Asset(omc: any): any;
    function AssetSC(omc: any): {
        edges: any;
        versionInfo: any;
        assetStructureProperties: any;
        assetStructureType: any;
        assetStructureName: any;
        schemaVersion: string;
        label: string;
        entityType: string;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Character(omc: any): any;
    function Collection(omc: any): {
        collectionName: any;
        schemaVersion: string;
        collectionType: any;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Composition(omc: any): {
        compositionName: any;
        schemaVersion: string;
        compositionType: any;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Context(omc: any): any;
    function CreativeWork(omc: any): {
        CreativeWork: boolean | any[];
        creativeWorkProperties: {
            Episode: any;
            Season: any;
            Series: any;
        };
        creativeWorkTitle: any;
        schemaVersion: string;
        label: string;
        creativeWorkType: any;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Department(omc: any): {
        participantStructureProperties: {
            Location: boolean | any[];
            contact: any;
        };
        participantStructureName: any;
        schemaVersion: string;
        entityType: string;
        participantStructureType: string;
        label: string;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Depiction(omc: any): {
        realizationProperties: {
            RealizationBy: any[];
            RealizationOf: any[];
        };
        realizationName: any;
        schemaVersion: string;
        entityType: string;
        realizationType: any;
        label: string;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Effect(omc: any): {
        effectName: any;
        schemaVersion: string;
        effectType: any;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Infrastructure(omc: any): {
        infrastructureFunction: {
            infrastructureFunctionProperties: any;
            infrastructureFunctionType: any;
        };
        InfrastructureStructure: boolean | any[];
        infrastructureName: any;
        schemaVersion: string;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function InfrastructureSC(omc: any): {
        infrastructureStructureProperties: any;
        infrastructureStructureName: any;
        schemaVersion: string;
        label: string;
        entityType: string;
        infrastructureStructureType: any;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Location(omc: any): {
        locationName: any;
        schemaVersion: string;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function NarrativeAction(omc: any): any;
    function NarrativeAudio(omc: any): any;
    function NarrativeLocation(omc: any): any;
    function NarrativeObject(omc: any): any;
    function NarrativeScene(omc: any): {
        narrativeSceneType: any;
        narrativeSceneName: any;
        schemaVersion: string;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function NarrativeStyling(omc: any): any;
    function NarrativeWardrobe(omc: any): any;
    function Organization(omc: any): {
        participantStructureProperties: {
            Location: boolean | any[];
            contact: any;
        };
        participantStructureName: any;
        schemaVersion: string;
        entityType: string;
        participantStructureType: string;
        label: string;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Participant(omc: any): any;
    function Person(omc: any): {
        participantStructureProperties: {
            Location: boolean | any[];
            gender: any;
            contact: any;
            jobTitle: any;
        };
        participantStructureName: any;
        schemaVersion: string;
        entityType: string;
        participantStructureType: string;
        label: string;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function ProductionLocation(omc: any): {
        Location: boolean | any[];
        productionLocationName: any;
        schemaVersion: string;
        productionLocationType: any;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function ProductionScene(omc: any): {
        productionSceneName: any;
        schemaVersion: string;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Role(omc: any): {
        roleName: any;
        schemaVersion: string;
        roleType: string;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Sequence(omc: any): any;
    function Service(omc: any): {
        participantStructureProperties: {
            software: any;
            contact: any;
        };
        participantStructureName: any;
        schemaVersion: string;
        entityType: string;
        participantStructureType: string;
        label: string;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Slate(omc: any): {
        CreativeWork: boolean | any[];
        slateName: any;
        schemaVersion: string;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function SpecialAction(omc: any): {
        schemaVersion: string;
        specialActionType: any;
        specialActionName: any;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function Task(omc: any): {
        taskFunction: {
            taskFunctionProperties: any;
            taskFunctionType: any;
        };
        TaskStructure: boolean | any[];
        taskName: any;
        schemaVersion: string;
        label: string;
        identifier?: OmcIdentifier[];
        entityType?: OmcEntityType;
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
    function TaskSC(omc: any): {
        taskStructureProperties: any;
        taskStructureType: any;
        taskStructureName: any;
        schemaVersion: string;
        entityType: string;
        label: string;
        identifier?: OmcIdentifier[];
        description: string | null;
        customData: OmcCustomData | null;
        annotation: OmcAnnotation | null;
        tag: OmcTag | null;
        instanceInfo: OmcInstanceInfo | null;
    };
}
export default _default;
//# sourceMappingURL=v2-8tov3-0.d.ts.map