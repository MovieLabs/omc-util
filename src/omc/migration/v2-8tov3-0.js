/**
 * Migrate an OMC entity from v2.8 to v3.0
 *
 * @ignore
 */

import { makeArray } from '../../mlHelpers/util.js';
import { edgeCreate } from '../omcEdges.js';
import { deepMerge } from '../omcMerge.js';

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
 * For properties where we removed an intrinsic edge and replaced it with a regular edge, we need
 * to create the edge in one direction
 * @param {OmcJson} omc
 * @param {string} targetProp - This is the property name for the intrinsic edge and target entity type
 * @param {string} entityType - The targets entityType, which may be different from targetProp value
 * @returns {*}
 */

function migrateIntrinsicToEdge(omc, targetProp, entityType) {
    if (!omc[targetProp]) {
        delete omc[targetProp];
        return omc;
    }
    const refIdentifiers = makeArray(omc[targetProp]);
    const update = refIdentifiers.reduce((obj, id) => {
        const { fromEntity } = edgeCreate({
            fromEntity: omc,
            toEntity: {
                schemaVersion,
                entityType,
                identifier: id.identifier,
            },
        });
        return fromEntity;
    }, omc);
    delete update[targetProp];
    return update;
}

/**
 * Migrate the entity 'group' property to the new Member property and deletes the original
 * @param entityType
 * @param omc
 */
function migrateMember(omc, entityType) {
    const { [entityType]: Member, ...rest } = omc;
    return typeof Member === 'undefined' ? { ...rest } : { ...rest, Member };
}

/**
 * The reference shape for some properties has been changed from a singleton to an array of references
 */
function migrateReferenceShape(omc, targetProp) {
    const reference = omc[targetProp];
    if (!reference) return omc;
    return {
        ...omc,
        [targetProp]: makeArray(omc[targetProp]),
    };
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
        const memberUpdate = migrateMember(
            {
                ...setEdgesFromContext(omc),
                schemaVersion,
            },
            'Asset',
        );
        const update = migrateReferenceShape(memberUpdate, 'AssetSC');
        return migrateName(migrateLabel(update), 'assetName');
    },
    AssetSC: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'assetSCName');
    },
    Infrastructure: (omc) => {
        const memberUpdate = migrateMember(
            {
                ...setEdgesFromContext(omc),
                schemaVersion,
            },
            'Infrastructure',
        );
        const update = migrateReferenceShape(memberUpdate, 'InfrastructureSC');
        return migrateName(migrateLabel(update), 'infrastructureName');
    },
    InfrastructureSC: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'infrastructureSCName');
    },
    Character: (omc) => {
        const memberUpdate = {
            // ...setEdgesFromContext(v28.Character(omc)),
            ...setEdgesFromContext(omc),
            characterType: omc.characterType || 'character',
            schemaVersion,
        };

        // Move a characters profile into the characterProperties
        const { profile = null } = memberUpdate;
        delete memberUpdate.profile;
        const propUpdate = { ...memberUpdate, characterProperties: profile };

        const update = migrateIntrinsicToEdge(propUpdate, 'Depiction', 'Realization');
        return migrateLabel(update);
    },
    Context: (omc) => {
        const update = {
            ...setContextEdges(omc),
            schemaVersion,
            contextType: omc.contextType || 'context',
        };
        return migrateName(migrateLabel(update), 'contextName');
    },
    CreativeWork: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            creativeWorkType: omc.creativeWorkType || 'creativeWork',
        };
        const shapeUpdate = migrateReferenceShape(update, 'CreativeWork');
        return migrateLabel(shapeUpdate);
    },
    Depiction: (omc) => {
        // Depictions are now Realizations with the sub-type 'depiction'
        const memberUpdate = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            entityType: 'Realization',
            realizationType: omc.depictionType || 'depiction',
        };
        const update = migrateReferenceShape(migrateReferenceShape(memberUpdate, 'Depicts'), 'Depicter');
        update.realizationProperties = {
            RealizationOf: update.Depicts || null,
            RealizationBy: update.Depicter || null,
        };
        delete update.depictionType;
        delete update.Depicts;
        delete update.Depicter;
        return migrateName(migrateLabel(update), 'realizationName');
    },
    Effect: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            effectType: omc.effectType || 'effectType',
        };
        return migrateName(migrateLabel(update), 'effectName');
    },
    NarrativeAudio: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            narrativeAudioType: omc.narrativeType || 'narrativeAudio',
        };
        delete update.narrativeType;
        return migrateName(migrateLabel(update), 'narrativeAudioName');
    },
    NarrativeAction: (omc) => {
        const specialActionType = omc.narrativeActionType || 'specialAction';
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            entityType: 'SpecialAction',
            specialActionType,
        };
        delete update.narrativeActionType;
        return migrateName(migrateLabel(update), 'specialActionName');
    },
    NarrativeLocation: (omc) => {
        const memberUpdate = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            narrativeLocationType: omc.narrativeType || 'narrativeLocation',
        };
        const edgeUpdate = migrateIntrinsicToEdge(memberUpdate, 'Depiction', 'Depiction');
        const update = migrateReferenceShape(edgeUpdate, 'Location');
        delete update.narrativeType;
        return migrateName(migrateLabel(update), 'narrativeLocationName');
    },
    NarrativeObject: (omc) => {
        const memberUpdate = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            narrativeObjectType: omc.narrativeType || 'narrativeObject',
        };
        const update = migrateIntrinsicToEdge(memberUpdate, 'Depiction', 'Depiction');
        delete update.narrativeType;
        return migrateName(migrateLabel(update), 'narrativeObjectName');
    },
    NarrativeScene: (omc) => {
        const { sceneName } = omc || null;
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            narrativeSceneName: sceneName,
            narrativeSceneType: omc.narrativeType || 'narrativeScene',
        };
        delete update.sceneName;
        delete update.narrativeType;
        return migrateLabel(update);
    },
    NarrativeStyling: (omc) => {
        const memberUpdate = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            narrativeStyling: omc.narrativeType || 'narrativeStyling',
        };
        const update = migrateIntrinsicToEdge(memberUpdate, 'Depiction', 'Depiction');
        delete update.narrativeType;
        return migrateName(migrateLabel(update), 'narrativeStylingName');
    },
    NarrativeWardrobe: (omc) => {
        const memberUpdate = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            narrativeWardrobeType: omc.narrativeType || 'narrativeWardrobe',
        };
        const update = migrateIntrinsicToEdge(memberUpdate, 'Depiction', 'Depiction');
        delete update.narrativeType;
        return migrateName(migrateLabel(update), 'narrativeWardrobeName');
    },
    ProductionLocation: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            productionLocationType: omc.locationType || 'productionLocation',
        };
        const shapeUpdate = migrateReferenceShape(update, 'Location');
        delete shapeUpdate.locationType;
        return migrateName(migrateLabel(shapeUpdate), 'productionLocationName');
    },
    ProductionScene: (omc) => {
        const { sceneName = null } = omc;
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            productionSceneName: sceneName,
        };
        delete update.sceneName;
        return migrateName(migrateLabel(update), 'productionSceneName');
    },
    Sequence: (omc) => (omc), // Sequence is fully deprecated and will fail validation
    Slate: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    SpecialAction: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            specialActionType: omc.specialActionType || 'specialAction',
        };
        return migrateName(migrateLabel(update), 'specialActionName');
    },
    Participant: (omc) => {
        const memberUpdate = migrateMember(
            {
                ...setEdgesFromContext(omc),
                schemaVersion,
            },
            'Participant',
        );
        const update = migrateReferenceShape(memberUpdate, 'ParticipantSC');
        return migrateLabel(update);
    },
    Organization: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        const shapeUpdate = migrateReferenceShape(update, 'Location');
        return migrateLabel(shapeUpdate);
    },
    Department: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        const shapeUpdate = migrateReferenceShape(update, 'Location');
        return migrateLabel(shapeUpdate);
    },
    Person: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        const shapeUpdate = migrateReferenceShape(update, 'Location');
        return migrateLabel(shapeUpdate);
    },
    Service: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Role: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        return migrateLabel(update);
    },
    Task: (omc) => {
        const memberUpdate = migrateMember(
            {
                ...setEdgesFromContext(omc),
                schemaVersion,
            },
            'Task',
        );
        const update = migrateReferenceShape(memberUpdate, 'TaskSC');
        return migrateName(migrateLabel(update), 'taskName');
    },
    TaskSC: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'taskSCName');
    },
    Location: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
        };
        return migrateName(migrateLabel(update), 'locationName');
    },
    Collection: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            collectionType: omc.collectionType || 'collection',
        };
        return migrateName(migrateLabel(update), 'collectionName');
    },
    Composition: (omc) => {
        const update = {
            ...setEdgesFromContext(omc),
            schemaVersion,
            compositionType: omc.compositionType || 'composition',
        };
        return migrateName(migrateLabel(update), 'compositionName');
    },
};
