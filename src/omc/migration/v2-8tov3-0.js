/**
 * Migrate an OMC entity from v2.8 to v3.0
 *
 * @ignore
 */

import { deepMerge } from '../omcMerge.js';

import v28 from './v2-6tov2-8.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

/**
 * Hoist edges carried on resolved Context entities onto the entity itself.
 *
 * In v2.x edges for an entity were carried on a Context (e.g. features, has,
 * for). v3.x moves those edges directly onto the entity's `edges` property.
 * This helper expects `omc.Context` to already contain fully-resolved Context
 * entities (the client inlines them before calling migrate). Any item without
 * an entityType is treated as an unresolved reference and skipped.
 *
 * Non-edge Context metadata (schemaVersion, entityType, identifier, name,
 * description, contextType, contextCategory, ForEntity) is stripped; whatever
 * remains on the Context is, by definition, an edge. When multiple Contexts
 * contribute edges they are deep-merged into a single `edges` object, and
 * merged on top of any pre-existing `edges` property on the entity.
 *
 * @param {OmcEntity} omc
 * @returns {OmcEntity}
 */
function setEdgesFromContext(omc) {
    if (!omc || !Array.isArray(omc.Context) || omc.Context.length === 0) return omc;

    const edgeFragments = omc.Context
        .filter((ctx) => ctx && ctx.entityType === 'Context') // Skip unresolved refs
        .map((ctx) => {
            const {
                schemaVersion: _sv,
                entityType: _et,
                identifier: _id,
                name: _name,
                description: _desc,
                contextType: _ctxType,
                contextCategory: _ctxCat,
                ForEntity: _for,
                ...edges
            } = ctx;
            return edges;
        });

    if (edgeFragments.length === 0) return { ...omc, Context: null };

    const merged = edgeFragments.reduce((acc, frag) => deepMerge(acc, frag), {});
    if (Object.keys(merged).length === 0) return { ...omc, Context: null };

    const existing = omc.edges && typeof omc.edges === 'object' ? omc.edges : {};
    return {
        ...omc,
        edges: deepMerge(existing, merged),
        Context: null,
    };
}

export default {
    Asset: (omc) => ({
        ...setEdgesFromContext(v28.Asset(omc)),
        schemaVersion,
    }),
    AssetSC: (omc) => ({
        ...setEdgesFromContext(v28.AssetSC(omc)),
        schemaVersion,
    }),
    Infrastructure: (omc) => ({
        ...setEdgesFromContext(v28.Infrastructure(omc)),
        schemaVersion,
    }),
    InfrastructureSC: (omc) => ({
        ...setEdgesFromContext(v28.InfrastructureSC(omc)),
        schemaVersion,
    }),
    Character: (omc) => ({
        ...setEdgesFromContext(v28.Character(omc)),
        schemaVersion,
    }),
    Context: (omc) => ({
        ...v28.Context(omc),
        schemaVersion,
    }),
    CreativeWork: (omc) => ({
        ...setEdgesFromContext(v28.CreativeWork(omc)),
        schemaVersion,
    }),
    Depiction: (omc) => ({
        ...setEdgesFromContext(v28.Depiction(omc)),
        schemaVersion,
    }),
    Effect: (omc) => ({
        ...setEdgesFromContext(v28.Effect(omc)),
        schemaVersion,
    }),
    NarrativeAudio: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeAudio(omc)),
        schemaVersion,
    }),
    NarrativeAction: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeAction(omc)),
        schemaVersion,
    }),
    NarrativeLocation: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeLocation(omc)),
        schemaVersion,
    }),
    NarrativeObject: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeObject(omc)),
        schemaVersion,
    }),
    NarrativeScene: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeScene(omc)),
        schemaVersion,
    }),
    NarrativeStyling: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeStyling(omc)),
        schemaVersion,
    }),
    NarrativeWardrobe: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeWardrobe(omc)),
        schemaVersion,
    }),
    ProductionLocation: (omc) => ({
        ...setEdgesFromContext(v28.NarrativeLocation(omc)),
        schemaVersion,
    }),
    ProductionScene: (omc) => ({
        ...setEdgesFromContext(v28.ProductionScene(omc)),
        schemaVersion,
    }),
    Sequence: (omc) => (omc), // Sequence is fully deprecated and will fail validation
    Slate: (omc) => ({
        ...setEdgesFromContext(v28.Slate(omc)),
        schemaVersion,
    }),
    SpecialAction: (omc) => ({
        ...setEdgesFromContext(v28.SpecialAction(omc)),
        schemaVersion,
    }),
    Participant: (omc) => ({
        ...setEdgesFromContext(v28.Participant(omc)),
        schemaVersion,
    }),
    Organization: (omc) => ({
        ...setEdgesFromContext(v28.Organization(omc)),
        schemaVersion,
    }),
    Department: (omc) => ({
        ...setEdgesFromContext(v28.Department(omc)),
        schemaVersion,
    }),
    Person: (omc) => ({
        ...setEdgesFromContext(v28.Person(omc)),
        schemaVersion,
    }),
    Service: (omc) => ({
        ...setEdgesFromContext(v28.Service(omc)),
        schemaVersion,
    }),
    Role: (omc) => ({
        ...setEdgesFromContext(v28.Role(omc)),
        schemaVersion,
    }),
    Task: (omc) => ({
        ...setEdgesFromContext(v28.Task(omc)),
        schemaVersion,
    }),
    TaskSC: (omc) => ({
        ...setEdgesFromContext(v28.TaskSC(omc)),
        schemaVersion,
    }),
    Location: (omc) => ({
        ...setEdgesFromContext(v28.Location(omc)),
        schemaVersion,
    }),
    Collection: (omc) => ({
        ...setEdgesFromContext(v28.Collection(omc)),
        schemaVersion,
    }),
    Composition: (omc) => ({
        ...setEdgesFromContext(v28.Composition(omc)),
        schemaVersion,
    }),
};
