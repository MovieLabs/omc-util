/**
 * Migrate an OMC entity from v2.8 to v3.0
 *
 * @ignore
 */

import { isPlainObject, makeArray } from '../../mlHelpers/util.js';
import { edgeCreate } from '../omcEdges.js';
import { idCombinedForm, idMint } from '../omcIdentifier.js';
import { deepMerge } from '../omcMerge.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';
const labelDefault = 'N/A';

const edgeTargetRename = {
    Depiction: 'Realization',
    AssetSC: 'AssetStructure',
    Context: 'Bundle',
    InfrastructureSC: 'InfrastructureStructure',
    ParticipantSC: 'ParticipantStructure',
    Sequence: 'Composition',
    TaskSC: 'TaskStructure',
};

// The v2.8 sequenceTypes that have a v3.0 compositionType of their own; any other is plain 'sequence'.
const sequenceTypeMap = {
    vfx: 'sequence.vfx',
    editorial: 'sequence.editorial',
    animation: 'sequence.animation',
    color: 'sequence.color',
};

// The v2.8 image structuralTypes, which v3.0 moved under `digital.visual`.
const assetStructureTypeMap = {
    'digital.image': 'digital.visual.image',
    'digital.movingImage': 'digital.visual.movingImage',
    'digital.imageSeries': 'digital.visual.imageSeries',
};

const productionLocationTypeMap = {
    shooting: 'shootingLocation',
    production: 'productionLocation',
};

// For a given set of targets for an edge, replace the old name with the new one.
const renameTarget = ((edge) => {
    Object.keys(edge).forEach((key) => {
        if (edgeTargetRename[key]) {
            const newTarget = edgeTargetRename[key];
            edge[newTarget] = edge[key];
            delete edge[key];
        }
    });
    return edge;
});

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
        contextProperties: _ctxProps,
        Context: _cxt,
        ForEntity: _forEnt,
        For: _for,
        ...edges
    } = cxt;
    Object.keys(edges).forEach((predicate) => renameTarget(edges[predicate])); // For each predicate, check if targets need renaming
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
        const res = edgeCreate({
            fromEntity: {
                ...omc,
                schemaVersion, // Use the schema version you are migrating to
            },
            toEntity: {
                schemaVersion,
                entityType,
                identifier: id.identifier,
            },
        });
        return res ? res.fromEntity : obj; // If error return original object
    }, omc);
    delete update[targetProp];
    return update;
}

/**
 * Populate the new name property on entities where it did not previously exist
 */
function migrateName(name) {
    return name ? { fullName: name } : name; // If name is false or null, return that, otherwise re-formant
}

/**
 * The reference shape for some properties has been changed from a singleton to an array of references
 */
const migrateShape = ((ref, propName = null) => {
    if (!propName) return ref ? [ref] : null;
    if (!Object.hasOwn(ref, propName)) return false;
    return ref[propName] ? [ref[propName]] : null;
}); // If a reference shape is a singleton, wrap it in an array.

/**
 * Migrate the version information if there is any
 */
function migrateVersion(omcVersion) {
    if (!omcVersion) return omcVersion; // There is no version information

    const {
        versionNumber = false, // Keep if present
        name: _name, // Remove
        description: _description, // Remove
        annotation: _annotation, // Remove
        customData: _customData, // Remove
        DerivationOf = false, // Change shape
        RevisionOf = false, // Change shape
        VariantOf = false, // Change shape
        RepresentationOf = false, // Change shape
        ...rest // References to child versions
    } = omcVersion;

    return {
        ...(versionNumber !== false && { versionNumber }),
        ...(DerivationOf !== false && { DerivationOf: migrateShape(DerivationOf) }),
        ...(RevisionOf !== false && { RevisionOf: migrateShape(RevisionOf) }),
        ...(VariantOf !== false && { VariantOf: migrateShape(VariantOf) }),
        ...(RepresentationOf !== false && { RepresentationOf: migrateShape(RepresentationOf) }),
        ...rest,
    };
}

/**
 * The v2.8 AssetSC that carries an asset group's members, which is where v3.0 holds them
 * (`assetStructureProperties.assetGroup.Member`). It is migrated to v3.0 afterwards.
 *
 * An embedded structure takes the members. One that is absent or only a reference cannot, so a new
 * assetGroup structure replaces it, with an identifier hashed from the group Asset's own: migrating
 * the same Asset again gives the same structure. A replaced reference's target is left as it is.
 *
 * @param {Object|false} assetSC - The v2.8 AssetSC of the group: an entity, a reference, or absent
 * @param {Array|Object} members - The group's nested `Asset` value
 * @param {Array|Object} assetIdentifier - The group Asset's identifier
 * @returns {Object|null} The structure, or null when the Asset has no identifier to seed one from
 */
function groupStructure(assetSC, members, assetIdentifier) {
    if (isPlainObject(assetSC) && assetSC.entityType) {
        const structuralProperties = assetSC.structuralProperties || {};
        return {
            ...assetSC,
            structuralProperties: {
                ...structuralProperties,
                assetGroup: {
                    ...structuralProperties.assetGroup,
                    Member: makeArray(members),
                },
            },
        };
    }

    const seed = makeArray(assetIdentifier)[0];
    if (!seed?.identifierValue) return null;
    return {
        schemaVersion: 'https://movielabs.com/omc/json/schema/v2.8',
        entityType: 'AssetSC',
        identifier: [idMint({
            identifierScope: seed.identifierScope,
            value: seed.identifierValue,
            entityType: 'AssetStructure',
        })],
        structuralType: 'assetGroup',
        structuralProperties: { assetGroup: { Member: makeArray(members) } },
    };
}

/**
 * v2.8 `Origin` referenced an entity; v3.0 `origin` is a string naming it: the referenced
 * identifier's combinedForm, or its scope and value joined by `:` where it has none.
 */
function migrateOrigin(Origin) {
    const id = makeArray(makeArray(Origin)[0]?.identifier)[0];
    return id ? idCombinedForm(id, ':') : null;
}

/**
 * v2.8 slugline notes are `{author, title, text}`; v3.0 slugline pieces are `{piece, text}`. A v2.8
 * note holds the slugline whole, so each becomes a `full` piece; the title and author are dropped.
 */
function migrateSlugline(slugline) {
    if (!Array.isArray(slugline)) return slugline;
    return slugline.map(({ text = null }) => ({ piece: 'full', text }));
}

/**
 * v2.8 `audioContent` is an array; v3.0 holds one object. A single item becomes that object and an
 * empty array is dropped. Several are left as they are, so they fail validation rather than vanish.
 */
function migrateAudioContent(properties) {
    if (!isPlainObject(properties) || !Array.isArray(properties.audioContent)) return properties;
    const { audioContent, ...rest } = properties;
    if (audioContent.length > 1) return properties;
    return audioContent.length ? { ...rest, audioContent: audioContent[0] } : rest;
}

/**
 * Migrate Provenance, by creating a new entity.
 */

function migrateProvenance(provenance) {
    if (!provenance) return null;

    // Create an identifier, as Provenance is now an entity
    const provId = idMint({ identifierScope: 'com.movielabs', entityType: 'Provenance' });
    const createdBy = migrateShape(provenance, 'CreatedBy');
    const role = migrateShape(provenance, 'Role');
    const { Origin = false, ...rest } = provenance; // A reference becomes the string `origin`

    return [{
        schemaVersion,
        entityType: 'Provenance',
        identifier: [provId],
        ...rest,
        ...(createdBy !== false && { CreatedBy: createdBy }),
        ...(Origin !== false && { origin: migrateOrigin(Origin) }),
        ...(role !== false && { Role: role }),
    }];
}

/**
 * Clean properties, remove any empty strings, arrays or objects without keys
 */

export default {
    Asset: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const intUpdate = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Realization');

        // Properties that need to be migrated
        const {
            name = false, // Becomes assetName
            Asset = false, // Group members, which move onto the AssetStructure
            AssetSC = false, // Becomes AssetStructure
            assetFC = {}, // Internally restructured, this has a required property so must not be null
            version = false, // Becomes versionInfo
            provenance = false, // Becomes and entity
            edges = {}, // Gets a Provenance edge
            ...rest
        } = intUpdate;

        const {
            functionalType = 'assetFunction', // Become assetFunctionType, now required
            functionalProperties = false, // Becomes assetFunctionProperties
        } = assetFC;
        const assetFunction = {
            assetFunctionType: functionalType,
            ...(functionalProperties !== false && { assetFunctionProperties: migrateAudioContent(functionalProperties) }),
        };

        const assetName = migrateName(name); // Reformat the name property
        const structure = Asset ? groupStructure(AssetSC, Asset, rest.identifier) : AssetSC;
        const AssetStructure = structure ? makeArray(structure) : AssetSC; // Wrap in array
        const versionInfo = migrateVersion(version);
        const Provenance = migrateProvenance(provenance); // Migrate provenance and make an edge
        if (Provenance) {
            edges.has = {
                ...edges.has,
                Provenance,
            };
        }

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault, // Label uses the existing name, or is set to N/A
            ...(assetName !== false && { assetName }),
            ...(AssetStructure !== false && { AssetStructure }),
            ...(Asset && structure === null && { Asset }), // Members with no structure stay, and fail validation
            assetFunction,
            ...(versionInfo !== false && { versionInfo }),
            edges,
        };
    },
    AssetSC: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false, // Becomes assetStructureName
            provenance = false, // Becomes Provenance entity
            version = false, // Becomes versionInfo
            structuralType = 'assetStructure', // Becomes assetStructureType, now required
            structuralProperties = false, // assetStructureProperties
            Carrier = false, // Moves into assetStructureProperties, singleton becomes an array
            edges = {}, // Gets a Provenance edge
            ...rest
        } = cxtUpdate;

        const assetStructureProperties = Carrier === false
            ? structuralProperties
            : { ...structuralProperties, Carrier: Carrier ? makeArray(Carrier) : null };
        const assetStructureName = migrateName(name);
        const versionInfo = migrateVersion(version);
        const Provenance = migrateProvenance(provenance);
        if (Provenance) {
            edges.has = {
                ...edges.has,
                Provenance,
            };
        }

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            entityType: 'AssetStructure',
            ...(assetStructureName !== false && { assetStructureName }),
            assetStructureType: assetStructureTypeMap[structuralType] || structuralType,
            ...(assetStructureProperties !== false && { assetStructureProperties }),
            ...(versionInfo !== false && { versionInfo }),
            edges,
        };
    },
    Character: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const update = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Realization');

        const {
            name = false,
            characterType = 'character', // Required property
            profile = false, // Becomes characterProperties
            ...rest
        } = update;

        return {
            ...rest,
            schemaVersion,
            characterType,
            label: name || labelDefault,
            ...(name !== false && { characterName: migrateName(name) }),
            ...(profile !== false && { characterProperties: profile }),
        };
    },
    Collection: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            collectionType = 'collection', // Required property
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            collectionType,
            label: name || labelDefault,
            ...(name !== false && { collectionName: migrateName(name) }),
        };
    },
    Composition: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            compositionType = 'composition', // Required property
            compositionProperties = false, // Its audioContent becomes one object
            provenance: _provenance, // Remove
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            compositionType,
            ...(compositionProperties !== false && { compositionProperties: migrateAudioContent(compositionProperties) }),
            label: name || labelDefault,
            ...(name !== false && { compositionName: migrateName(name) }),
        };
    },
    // v3.0 has no Context: it is a Bundle, whose properties are named for it.
    Context: (omc) => {
        const {
            name = false,
            contextType = 'bundle', // Becomes bundleType, which is required
            contextCategory = false, // Becomes bundleCategory
            contextProperties = false, // Becomes bundleProperties
            ForEntity: _ForEntity, // Remove,
            For: _For, // Remove
            ...rest
        } = omc;

        // Separate the edges and remove them from top level
        const edges = cxtEdges(omc);
        Object.keys(edges).forEach((key) => delete rest[key]); // Delete the edges at the top level.

        return {
            ...rest,
            schemaVersion,
            entityType: 'Bundle',
            bundleType: contextType,
            label: name || labelDefault,
            ...(name !== false && { bundleName: migrateName(name) }),
            ...(contextCategory !== false && { bundleCategory: contextCategory }),
            ...(contextProperties !== false && { bundleProperties: contextProperties }),
            edges,
        };
    },
    CreativeWork: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            CreativeWork = false, // Singleton, make an array
            creativeWorkType = 'creativeWork', // Now a required property
            Series = false, // Moves to the properties
            Season = false, // Moves to the properties
            Episode = false, // Moves to the properties
            title = false, // Becomes creativeWorkTitle
            ...rest
        } = cxtUpdate;

        const creativeWorkProperties = {
            ...(Series !== false && { Series }),
            ...(Season !== false && { Season }),
            ...(Episode !== false && { Episode }),
        };

        return {
            ...rest,
            schemaVersion,
            label: name || 'N/A', // ToDo: Could check the title list for a better option
            creativeWorkType,
            ...(title !== false && { creativeWorkTitle: title }),
            ...((Object.keys(creativeWorkProperties)).length && { creativeWorkProperties }), // Spread this if there are any values
            ...(CreativeWork !== false && { CreativeWork: migrateShape(CreativeWork) }),
        };
    },
    Department: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            structuralType: _structuralType = false, // Becomes participantStructureType
            name = false, // Becomes part of properties
            departmentName = false, // Becomes participantStructureName
            Location = false, // Singleton becomes an array
            contact, // Becomes part of properties
            ...rest
        } = cxtUpdate;

        const participantStructureProperties = {
            ...(contact !== false && { contact }),
            ...(Location !== false && { Location: migrateShape(Location) }),
        };

        return {
            ...rest,
            schemaVersion,
            entityType: 'ParticipantStructure',
            participantStructureType: 'department',
            label: name || labelDefault,
            ...(departmentName !== false && { participantStructureName: departmentName }),
            ...(participantStructureProperties !== false && { participantStructureProperties }),
        };
    },
    Depiction: (omc) => {
        // Depictions are now Realizations with the sub-type 'depiction'
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            depictionType = 'depiction', // Required property
            Depicts = false, // Becomes RealizationOf
            Depicter = false, // Becomes RealizedBy
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            entityType: 'Realization',
            realizationType: depictionType,
            label: name || labelDefault,
            ...(name !== false && { realizationName: migrateName(name) }),
            ...(Depicts !== false && { RealizationOf: makeArray(Depicts) }),
            ...(Depicter !== false && { RealizedBy: makeArray(Depicter) }),
        };
    },
    Effect: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            effectType = 'effect', // Required property
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            effectType,
            label: name || labelDefault,
            ...(name !== false && { effectName: migrateName(name) }),
        };
    },
    Infrastructure: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false, // Becomes participantName
            InfrastructureSC = false, // Becomes ParticipantStructure and singleton becomes array
            infrastructureFC = {}, // Becomes participantFunction, has a required property
            Infrastructure: _infrastructure, // ToDo: Expand to include this in the Structure
            ...rest
        } = cxtUpdate;

        const {
            functionalType = 'infrastructureFunction', // Become assetFunctionType, now required
            functionalProperties = false, // Becomes assetFunctionProperties
        } = infrastructureFC;
        const infrastructureFunction = {
            infrastructureFunctionType: functionalType,
            ...(functionalProperties !== false && { infrastructureFunctionProperties: functionalProperties }),
        };

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { infrastructureName: migrateName(name) }),
            ...(InfrastructureSC !== false && { InfrastructureStructure: migrateShape(InfrastructureSC) }),
            ...(infrastructureFunction !== false && { infrastructureFunction }),
        };
    },
    InfrastructureSC: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            structuralType = 'infrastructureStructure', // Becomes infrastructureStructure, required property
            structuralProperties = false,
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            entityType: 'InfrastructureStructure',
            infrastructureStructureType: structuralType,
            ...(name !== false && { infrastructureStructureName: migrateName(name) }),
            ...(structuralProperties !== false && { infrastructureStructureProperties: structuralProperties }),
        };
    },
    Location: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { locationName: migrateName(name) }),
        };
    },
    NarrativeAction: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const update = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Realization');

        const {
            name = false,
            narrativeType = 'specialAction', // Becomes narrativeActionType, required property
            ...rest
        } = update;

        return {
            ...rest,
            schemaVersion,
            entityType: 'SpecialAction',
            specialActionType: narrativeType,
            label: name || labelDefault,
            ...(name !== false && { narrativeActionName: migrateName(name) }),
        };
    },
    NarrativeAudio: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const update = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Realization');

        const {
            name = false,
            narrativeType = 'narrativeAudio', // Becomes narrativeAudioType, required property
            ...rest
        } = update;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { narrativeAudioName: migrateName(name) }),
            narrativeAudioType: narrativeType,
        };
    },
    NarrativeLocation: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const update = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Depiction');

        const {
            name = false,
            narrativeType = 'narrativeLocation', // Becomes narrativeLocationType, required property
            Location = false,
            ...rest
        } = update;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { narrativeLocationName: migrateName(name) }),
            narrativeLocationType: narrativeType,
            ...(Location !== false && { Location: migrateShape(Location) }),
        };
    },
    NarrativeObject: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const update = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Depiction');

        const {
            name = false,
            narrativeType = 'narrativeObject', // Becomes narrativeObjectType, required property
            size: _size, // Remove
            ...rest
        } = update;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { narrativeObjectName: migrateName(name) }),
            narrativeObjectType: narrativeType,
        };
    },
    NarrativeScene: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            sceneName, // Becomes narrativeSceneName
            narrativeType = 'narrativeScene', // Required property
            slugline = false, // Annotation-shaped notes become pieces
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(sceneName !== false && { narrativeSceneName: sceneName }),
            narrativeSceneType: narrativeType,
            ...(slugline !== false && { slugline: migrateSlugline(slugline) }),
        };
    },
    NarrativeStyling: (omc) => {
        const memberUpdate = { ...setEdgesFromContext(omc) };
        const update = migrateIntrinsicToEdge(memberUpdate, 'Depiction', 'Depiction');

        const {
            name = false,
            narrativeType = 'narrativeStyling', // Required property
            ...rest
        } = update;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { narrativeStylingName: migrateName(name) }),
            narrativeStylingType: narrativeType,
        };
    },
    NarrativeWardrobe: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const update = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Depiction');

        const {
            name = false,
            narrativeType = 'narrativeWardrobe', // Required property
            ...rest
        } = update;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { narrativeWardrobeName: migrateName(name) }),
            narrativeWardrobeType: narrativeType,
        };
    },
    Organization: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            structuralType: _structuralType = false, // Becomes participantStructureType
            name = false, // Becomes part of properties
            organizationName = false, // Becomes participantStructureName
            Location = false, // Singleton becomes an array
            contact, // Becomes part of properties
            ...rest
        } = cxtUpdate;

        const participantStructureProperties = {
            ...(contact !== false && { contact }),
            ...(Location !== false && { Location: migrateShape(Location) }),
        };

        return {
            ...rest,
            schemaVersion,
            entityType: 'ParticipantStructure',
            participantStructureType: 'organization',
            label: name || labelDefault,
            ...(organizationName !== false && { participantStructureName: organizationName }),
            ...(participantStructureProperties !== false && { participantStructureProperties }),
        };
    },
    Participant: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };
        const intUpdate = migrateIntrinsicToEdge(cxtUpdate, 'Depiction', 'Realization');

        const {
            name = false, // Becomes participantName
            ParticipantSC = false, // Becomes ParticipantStructure and singleton becomes array
            participantFC = {}, // Becomes participantFunction, has a required property
            Participant: _participant, // ToDo: Expand to include this in the Structure
            ...rest
        } = intUpdate;

        const {
            functionalType = 'participantFunction', // Become assetFunctionType, now required
            functionalProperties = false, // Becomes assetFunctionProperties
        } = participantFC;
        const participantFunction = {
            participantFunctionType: functionalType,
            ...(functionalProperties !== false && { participantFunctionProperties: functionalProperties }),
        };

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { participantName: migrateName(name) }),
            ...(ParticipantSC !== false && { ParticipantStructure: migrateShape(ParticipantSC) }),
            ...(participantFunction !== false && { participantFunction }),
        };
    },
    Person: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            structuralType: _structuralType = false, // Becomes participantStructureType
            name = false, // Becomes part of properties
            personName = false, // Becomes participantStructureName
            jobTitle = false, // Becomes part of properties
            Location = false, // Singleton becomes an array
            contact, // Becomes part of properties
            gender, // Becomes part of properties
            ...rest
        } = cxtUpdate;

        const participantStructureProperties = {
            ...(jobTitle !== false && { jobTitle }),
            ...(contact !== false && { contact }),
            ...(gender !== false && { gender }),
            ...(Location !== false && { Location: migrateShape(Location) }),
        };

        return {
            ...rest,
            schemaVersion,
            entityType: 'ParticipantStructure',
            participantStructureType: 'person',
            label: name || labelDefault,
            ...(personName !== false && { participantStructureName: personName }),
            ...(participantStructureProperties !== false && { participantStructureProperties }),
        };
    },
    ProductionLocation: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            locationType = 'productionLocation', // Becomes ProductionLocationType, required
            Location,
            ...rest
        } = cxtUpdate;
        const productionLocationType = productionLocationTypeMap[locationType] || locationType; // Map to new controlled vocab if possible

        return {
            ...rest,
            schemaVersion,
            productionLocationType,
            label: name || labelDefault,
            ...(name !== false && { productionLocationName: migrateName(name) }),
            ...(Location !== false && { Location: migrateShape(Location) }),
        };
    },
    ProductionScene: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            sceneName = false,
            sceneHeader = false, // The name's fullName when it has none, otherwise dropped
            sceneNumber = null,
            sceneDescriptor = false,
            ...rest
        } = cxtUpdate;

        const productionSceneName = sceneHeader && !sceneName?.fullName
            ? { ...sceneName, fullName: sceneHeader }
            : sceneName;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            sceneDescriptor: sceneDescriptor || sceneNumber,
            ...(productionSceneName !== false && { productionSceneName }),
        };
    },
    Role: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            roleType: 'role',
            label: name || labelDefault,
            ...(name !== false && { roleName: migrateName(name) }),
        };
    },
    // v3.0 has no Sequence: it is a Composition whose compositionType is 'sequence', or a sub-type
    // from sequenceTypeMap. A `version` has no v3.0 home and is left in place, so it fails validation
    // rather than vanishing.
    Sequence: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false, // Becomes compositionName
            sequenceType = false, // Becomes the compositionType sub-type
            SCD = false, // The chronology descriptor, which becomes StartHere
            provenance = false, // Becomes an entity
            edges = {}, // Gets a Provenance edge
            ...rest
        } = cxtUpdate;

        const compositionName = migrateName(name);
        const Provenance = migrateProvenance(provenance);
        if (Provenance) {
            edges.has = {
                ...edges.has,
                Provenance,
            };
        }

        return {
            ...rest,
            schemaVersion,
            entityType: 'Composition',
            label: name || labelDefault,
            compositionType: sequenceTypeMap[sequenceType] || 'sequence',
            ...(compositionName !== false && { compositionName }),
            ...(SCD !== false && { StartHere: SCD }),
            edges,
        };
    },
    Service: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            structuralType: _structuralType = false, // Becomes participantStructureType
            name = false, // Becomes part of properties
            serviceName = false, // Becomes participantStructureName
            software = false, // Singleton becomes an array
            contact, // Becomes part of properties
            ...rest
        } = cxtUpdate;

        const participantStructureProperties = {
            ...(contact !== false && { contact }),
            ...(software !== false && { software }),
        };

        return {
            ...rest,
            schemaVersion,
            entityType: 'ParticipantStructure',
            participantStructureType: 'service',
            label: name || labelDefault,
            ...(serviceName !== false && { participantStructureName: serviceName }),
            ...(participantStructureProperties !== false && { participantStructureProperties }),
        };
    },
    Slate: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            slateUID = false, // Now lives in slateName
            CreativeWork = false, // Migrate shape
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { slateName: migrateName(slateUID) }),
            ...(CreativeWork !== false && { CreativeWork: migrateShape(CreativeWork) }),
        };
    },
    SpecialAction: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            specialActionType = 'specialAction', // Required property
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            label: name || labelDefault,
            ...(name !== false && { specialActionName: migrateName(name) }),
            schemaVersion,
            specialActionType,
        };
    },
    Task: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false, // Becomes participantName
            TaskSC = false, // Becomes ParticipantStructure and singleton becomes array
            taskFC = {}, // Becomes participantFunction, has a required property
            Task: _task, // ToDo: Expand to include this in the Structure
            ...rest
        } = cxtUpdate;

        const {
            functionalType = 'taskFunction', // Become assetFunctionType, now required
            functionalProperties = false, // Becomes assetFunctionProperties
        } = taskFC;
        const taskFunction = {
            taskFunctionType: functionalType,
            ...(functionalProperties !== false && { taskFunctionProperties: functionalProperties }),
        };

        return {
            ...rest,
            schemaVersion,
            label: name || labelDefault,
            ...(name !== false && { taskName: migrateName(name) }),
            ...(TaskSC !== false && { TaskStructure: migrateShape(TaskSC) }),
            ...(taskFunction !== false && { taskFunction }),
        };
    },
    TaskSC: (omc) => {
        const cxtUpdate = { ...setEdgesFromContext(omc) };

        const {
            name = false,
            structuralType = 'taskStructure', // required property
            structuralProperties,
            ...rest
        } = cxtUpdate;

        return {
            ...rest,
            schemaVersion,
            entityType: 'TaskStructure',
            label: name || labelDefault,
            ...(name !== false && { taskStructureName: migrateName(name) }),
            taskStructureType: structuralType,
            ...(structuralProperties !== false && { taskStructureProperties: structuralProperties }),
        };
    },
};
