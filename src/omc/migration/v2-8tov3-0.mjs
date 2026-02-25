/**
 * Migrate an OMC entity from v2.8 to v3.0
 *
 * @ignore
 */

import v28 from './v2-6tov2-8.mjs';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

export default {
    Asset: (omc) => ({
        ...v28.Asset(omc),
        schemaVersion,
    }),
    AssetSC: (omc) => ({
        ...v28.AssetSC(omc),
        schemaVersion,
    }),
    Infrastructure: (omc) => ({
        ...v28.Infrastructure(omc),
        schemaVersion,
    }),
    InfrastructureSC: (omc) => ({
        ...v28.InfrastructureSC(omc),
        schemaVersion,
    }),
    Character: (omc) => ({
        ...v28.Character(omc),
        schemaVersion,
    }),
    Context: (omc) => ({
        ...v28.Context(omc),
        schemaVersion,
    }),
    CreativeWork: (omc) => ({
        ...v28.CreativeWork(omc),
        schemaVersion,
    }),
    Depiction: (omc) => ({
        ...v28.Depiction(omc),
        schemaVersion,
    }),
    Effect: (omc) => ({
        ...v28.Effect(omc),
        schemaVersion,
    }),
    NarrativeAudio: (omc) => ({
        ...v28.NarrativeAudio(omc),
        schemaVersion,
    }),
    NarrativeAction: (omc) => ({
        ...v28.NarrativeAction(omc),
        schemaVersion,
    }),
    NarrativeLocation: (omc) => ({
        ...v28.NarrativeLocation(omc),
        schemaVersion,
    }),
    NarrativeObject: (omc) => ({
        ...v28.NarrativeObject(omc),
        schemaVersion,
    }),
    NarrativeScene: (omc) => ({
        ...v28.NarrativeScene(omc),
        schemaVersion,
    }),
    NarrativeStyling: (omc) => ({
        ...v28.NarrativeStyling(omc),
        schemaVersion,
    }),
    NarrativeWardrobe: (omc) => ({
        ...v28.NarrativeWardrobe(omc),
        schemaVersion,
    }),
    ProductionLocation: (omc) => ({
        ...v28.NarrativeLocation(omc),
        schemaVersion,
    }),
    ProductionScene: (omc) => ({
        ...v28.ProductionScene(omc),
        schemaVersion,
    }),
    Sequence: (omc) => (omc), // Sequence is fully deprecated and will fail validation
    Slate: (omc) => ({
        ...v28.Slate(omc),
        schemaVersion,
    }),
    SpecialAction: (omc) => ({
        ...v28.SpecialAction(omc),
        schemaVersion,
    }),
    Participant: (omc) => ({
        ...v28.Participant(omc),
        schemaVersion,
    }),
    Organization: (omc) => ({
        ...v28.Organization(omc),
        schemaVersion,
    }),
    Department: (omc) => ({
        ...v28.Department(omc),
        schemaVersion,
    }),
    Person: (omc) => ({
        ...v28.Person(omc),
        schemaVersion,
    }),
    Service: (omc) => ({
        ...v28.Service(omc),
        schemaVersion,
    }),
    Role: (omc) => ({
        ...v28.Role(omc),
        schemaVersion,
    }),
    Task: (omc) => ({
        ...v28.Task(omc),
        schemaVersion,
    }),
    TaskSC: (omc) => ({
        ...v28.TaskSC(omc),
        schemaVersion,
    }),
    Location: (omc) => ({
        ...v28.Location(omc),
        schemaVersion,
    }),
    Collection: (omc) => ({
        ...v28.Collection(omc),
        schemaVersion,
    }),
    Composition: (omc) => ({
        ...v28.Composition(omc),
        schemaVersion,
    }),
};
