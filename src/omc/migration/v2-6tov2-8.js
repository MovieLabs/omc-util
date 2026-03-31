/**
 * Migrate an OMC entity from v2.6 to v2.8
 *
 * @ignore
 */

import v26 from './v2-0tov2-6.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v2.8';

const migrateCustomData = ((omc) => {
    const { customData } = omc;
    if (!Array.isArray(customData)) return [{ domain: null, value: omc.customData }]; // If custom data is not an array then it is the older style
    // Check if the custom data already is in the v2.8 format
    if ((Object.hasOwn(customData[0], 'domain') || Object.hasOwn(customData[0], 'namespace')) && Object.hasOwn(customData[0], 'value')) {
        return customData;
    }
    return [{ domain: null, value: omc.customData }]; // Convert this to the preferred format for v2.8
});

export default {
    Asset: (omc) => {
        const updatedOmc = {
            ...v26.Asset(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    AssetSC: (omc) => {
        const updatedOmc = {
            ...v26.AssetSC(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Infrastructure: (omc) => {
        const updatedOmc = {
            ...v26.Infrastructure(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    InfrastructureSC: (omc) => {
        const updatedOmc = {
            ...v26.InfrastructureSC(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Character: (omc) => {
        const updatedOmc = {
            ...v26.Character(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Context: (omc) => {
        const updatedOmc = {
            ...v26.Context(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    CreativeWork: (omc) => {
        const updatedOmc = {
            ...v26.CreativeWork(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Depiction: (omc) => {
        const updatedOmc = {
            ...v26.Depiction(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Effect: (omc) => {
        const updatedOmc = {
            ...v26.Effect(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    NarrativeAction: (omc) => {
        const updatedOmc = {
            ...v26.NarrativeAction(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    NarrativeAudio: (omc) => {
        const updatedOmc = {
            ...v26.NarrativeAudio(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    NarrativeLocation: (omc) => {
        const updatedOmc = {
            ...v26.NarrativeLocation(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    NarrativeObject: (omc) => {
        const updatedOmc = {
            ...v26.NarrativeObject(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    NarrativeScene: (omc) => {
        const updatedOmc = {
            ...v26.NarrativeScene(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    NarrativeStyling: (omc) => {
        const updatedOmc = {
            ...v26.NarrativeStyling(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    NarrativeWardrobe: (omc) => {
        const updatedOmc = {
            ...v26.NarrativeWardrobe(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    ProductionLocation: (omc) => {
        const updatedOmc = {
            ...v26.ProductionLocation(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    ProductionScene: (omc) => {
        const updatedOmc = {
            ...v26.ProductionScene(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Sequence: (omc) => {
        const updatedOmc = {
            ...v26.Sequence(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Slate: (omc) => {
        const updatedOmc = {
            ...v26.Slate(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    SpecialAction: (omc) => {
        const updatedOmc = {
            ...v26.SpecialAction(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Participant: (omc) => {
        const updatedOmc = {
            ...v26.Participant(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Organization: (omc) => {
        const updatedOmc = {
            ...v26.Organization(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Department: (omc) => {
        const updatedOmc = {
            ...v26.Department(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Person: (omc) => {
        const updatedOmc = {
            ...v26.Person(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Service: (omc) => {
        const updatedOmc = {
            ...v26.Service(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Role: (omc) => {
        const updatedOmc = {
            ...v26.Role(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Task: (omc) => {
        const updatedOmc = {
            ...v26.Task(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    TaskSC: (omc) => {
        const updatedOmc = {
            ...v26.TaskSC(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Location: (omc) => {
        const updatedOmc = {
            ...v26.Location(omc),
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Collection: (omc) => {
        const updatedOmc = {
            ...omc,
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
    Composition: (omc) => {
        const updatedOmc = {
            ...omc,
            schemaVersion,
        };
        if (omc.customData) updatedOmc.customData = migrateCustomData(omc);
        return updatedOmc;
    },
};
