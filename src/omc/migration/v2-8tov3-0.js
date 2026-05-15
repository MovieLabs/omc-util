/**
 * Migrate an OMC entity from v2.8 to v3.0
 *
 * @ignore
 */

import { deepMerge } from '../omcMerge.js';

import v28 from './v2-6tov2-8.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

const cxtEdges = ((cxt) => {
    const {
        schemaVersion: _sv,
        entityType: _et,
        identifier: _id,
        name: _name,
        description: _desc,
        annotation: _anno,
        tag: _tag,
        customData: _cd,
        instanceInfo: _if,
        contextType: _ctxType,
        contextCategory: _ctxCat,
        Context: _cxt,
        ForEntity: _for,
        ...edges
    } = cxt;
    return edges;
});

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
    const { Context, ...update } = omc; // Context will be removed
    if (!omc || !Array.isArray(Context) || Context.length === 0) return update;

    const edgeFragments = Context
        .filter((ctx) => ctx && ctx.entityType === 'Context') // Skip unresolved refs
        .map((cxt) => cxtEdges(cxt)); // Just the edge properties

    if (edgeFragments.length === 0) return update;

    const merged = edgeFragments.reduce((acc, frag) => deepMerge(acc, frag), {});
    if (Object.keys(merged).length === 0) return update;

    const existing = omc.edges && typeof omc.edges === 'object' ? omc.edges : {};
    const edges = deepMerge(existing, merged);
    return {
        ...update,
        edges,
    };
}

/**
 * Hoist edges carried on resolved Context entities onto the entity itself.
 *
 * @param {OmcEntity} omc
 * @returns {OmcEntity}
 */

const baseKeys = ['entityType', 'identifier', 'name', 'description', 'annotation', 'tag', 'customData', 'instanceInfo', 'contextType', 'contextCategory', 'Context'];

function setContextEdges(omc) {
    if (omc.entityType !== 'Context') return omc;

    // Copy the non-edge properties that need to be preserved
    const migratedContext = baseKeys.reduce((cxt, key) => (omc[key] ? { ...cxt, [key]: omc[key] } : cxt), {});
    const edges = cxtEdges(omc); // Just the edges;

    return {
        schemaVersion,
        ...migratedContext,
        edges,
    };
}

/**
 * Migrate the entity 'group' property to the new Member property and deletes the original
 * @param entityType
 * @param omc
 */
function migrateMember(entityType, omc) {
    const { [entityType]: Member, ...rest } = omc;
    return typeof Member === 'undefined' ? { ...rest } : { ...rest, Member };
}

/**
 * Migrate the name property to use the new property label
 */
function migrateLabel(omc) {
    const { name: label, ...rest } = omc;
    return typeof label === 'undefined' ? { ...rest } : { ...rest, label };
}

/**
 * Populate the new name property on entities where it did not previously exist
 */
function migrateName(omc, nameKey) {
    const { label = null } = omc; // Use the label for the name
    omc[nameKey] = { fullName: label };
    return omc;
}

export default {
    Asset: (omc) => {
        const update = migrateMember('Asset', {
            ...setEdgesFromContext(v28.Asset(omc)),
            schemaVersion,
        });
        return migrateName(migrateLabel(update), 'assetName');
    },
    AssetSC: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.AssetSC(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'assetSCName');
    },
    Infrastructure: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Infrastructure(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'infrastructureName');
    },
    InfrastructureSC: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.InfrastructureSC(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'infrastructureSCName');
    },
    Character: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Character(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Context: (omc) => {
        const update = {
            ...setContextEdges(v28.Context(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'contextName');
    },
    CreativeWork: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.CreativeWork(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Depiction: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Depiction(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'depictionName');
    },
    Effect: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Effect(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'effectName');
    },
    NarrativeAudio: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.NarrativeAudio(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'narrativeAudioName');
    },
    NarrativeAction: (omc) => {
        const specialActionType = omc.narrativeActionType || 'specialAction';
        const update = {
            ...setEdgesFromContext(v28.NarrativeAction(omc)),
            schemaVersion,
            entityType: 'SpecialAction',
            specialActionType,
        };
        delete update.narrativeActionType;
        return migrateName(migrateLabel(update), 'specialActionName');
    },
    NarrativeLocation: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.NarrativeLocation(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'narrativeLocationName');
    },
    NarrativeObject: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.NarrativeObject(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'narrativeObjectName');
    },
    NarrativeScene: (omc) => {
        const { sceneName } = omc || null;
        const update = {
            ...setEdgesFromContext(v28.NarrativeScene(omc)),
            schemaVersion,
            narrativeSceneName: sceneName,
        };
        delete update.sceneName;
        return migrateLabel(update);
    },
    NarrativeStyling: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.NarrativeStyling(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'narrativeStylingName');
    },
    NarrativeWardrobe: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.NarrativeWardrobe(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'narrativeWardrobeName');
    },
    ProductionLocation: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.NarrativeLocation(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'productionLocationName');
    },
    ProductionScene: (omc) => {
        const { sceneName = null } = omc;
        const update = {
            ...setEdgesFromContext(v28.ProductionScene(omc)),
            schemaVersion,
            productionSceneName: sceneName,
        };
        delete update.sceneName;
        return migrateName(migrateLabel(update), 'productionSceneName');
    },
    Sequence: (omc) => (omc), // Sequence is fully deprecated and will fail validation
    Slate: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Slate(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    SpecialAction: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.SpecialAction(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'specialActionName');
    },
    Participant: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Participant(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Organization: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Organization(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Department: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Department(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Person: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Person(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Service: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Service(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Role: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Role(omc)),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Task: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Task(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'taskName');
    },
    TaskSC: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.TaskSC(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'taskSCName');
    },
    Location: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Location(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'locationName');
    },
    Collection: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Collection(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'collectionName');
    },
    Composition: (omc) => {
        const update = {
            ...setEdgesFromContext(v28.Composition(omc)),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'compositionName');
    },
};
