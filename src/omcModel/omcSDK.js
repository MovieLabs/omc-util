/**
 * Creates a document model for OMC
 *
 * @module omcSDK
 */

import { makeArray, isPlainObject, isCapitalized } from '../mlHelpers/util.js';
import { relatedEdges, removeEdge } from '../omc/omcEdges.js';
import omcFind from '../omc/omcFind.js';
import * as omcIdentifier from '../omc/omcIdentifier.js';
import { mergeEntity } from '../omc/omcMerge.js';
import * as omcTransform from '../omc/omcTransform.js';

import entityModel from './entityModel.js';

const collapseProps = ((obj) => Object.keys(obj || {}).reduce((acc, cur) => {
    if (isCapitalized(cur)) return { ...acc, ...{ [cur]: Array.isArray(obj[cur]) ? obj[cur] : [obj[cur]] } };
    if (isPlainObject(obj[cur])) return { ...acc, ...collapseProps(obj[cur]) };
    return acc;
}, {}));

const isIdentifier = ((id) => (Array.isArray(id)
    ? id[0].identifierScope
    : Object.hasOwn(id, 'identifier') || Object.hasOwn(id, 'identifierScope')));

const transform = (omc) => {
    const transformProto = Object.create({
        toArray() {
            this.omc = omcTransform.toArray(this.omc);
            return this;
        },
        toObject() {
            this.omc = omcTransform.toObject(this.omc);
            return this;
        },
        unEmbed() {
            this.omc = omcTransform.unEmbed(this.omc);
            return this;
        },
    });
    transformProto.omc = omc;
    return transformProto;
};

/**
 * Manage an in memory cache of OMC entities
 * @ignore
 * @memberof module:omcSDK
 * @returns {*}
 */
const cache = () => {
    const proto = {
        tempId() {
            this.cacheKey += 1;
            return `cacheId-${this.cacheKey}`;
        },
        mapStoreKeys(identifier) {
            return identifier.reduce((obj, id) => {
                const idKey = omcIdentifier.idKey(id);
                return { ...obj, [idKey]: this.idMapping[idKey] || null };
            }, {});
        },
        add(ent) {
            const { identifier = [] } = ent; // Safeguard against missing identifier (should never happen)

            // Map the entities identifiers to a cacheId if one exists
            const idKeys = this.mapStoreKeys(identifier);
            const storeKeys = Object.values(idKeys).filter((d, i, arr) => d && arr.indexOf(d) === i); // DeDupe and remove null
            const storeId = storeKeys.length === 0 ? this.tempId() : storeKeys.shift();
            Object.keys(idKeys).forEach((idKey) => this.idMapping[idKey] = storeId); // Update the mapping table
            Object.keys(idKeys).forEach((idKey) => this.missing.delete(idKey)); // Held now, so not missing

            if (!Object.hasOwn(this.store, storeId)) {
                this.store[storeId] = ent; // First time seeing this, so add the entity to the deDupe object
                return storeId;
            }

            // Already held: merge in what the incoming copy adds — edges, and values the stored copy
            // lacks. The stored copy wins a disagreement, so a reload never overwrites an edit.
            let merged = false;
            try {
                merged = mergeEntity(this.store[storeId], ent, { prefer: 'existing', emptyAsNull: true });
            } catch (err) {
                console.warn(`Not merged, the stored entity is kept: ${err.message}`);
            }
            if (!merged) return storeId;
            const cleaned = omcTransform.cleanEntity(merged);
            if (JSON.stringify(cleaned) !== JSON.stringify(this.store[storeId])) this.store[storeId] = entityModel(cleaned);
            return storeId;
        },
        replace(ent) {
            const { identifier = [] } = ent; // Safeguard against missing identifier (should never happen)

            // Map the entities identifiers to a cacheId if one exists
            const idKeys = this.mapStoreKeys(identifier);
            const storeKeys = Object.values(idKeys).filter((d, i, arr) => d && arr.indexOf(d) === i); // DeDupe and remove null
            const storeId = storeKeys.length === 0 ? this.tempId() : storeKeys.shift();
            Object.keys(idKeys).forEach((idKey) => this.idMapping[idKey] = storeId); // Update the mapping table
            Object.keys(idKeys).forEach((idKey) => this.missing.delete(idKey)); // Held now, so not missing
            this.store[storeId] = ent; // Replace an existing entity
            return ent;
        },
        remove(identifier) {
            // Normalize the identifier value, in case of it being full identifier, array of id's or single id
            if (!identifier) return null;
            const id = Object.hasOwn(identifier, 'identifier')
                ? identifier.identifier
                : makeArray(identifier);
            const idKeys = this.mapStoreKeys(id);
            const storeKeys = Object.values(idKeys).filter((d, i, arr) => d && arr.indexOf(d) === i); // DeDupe and remove null
            const storeId = storeKeys.shift();
            Object.keys(idKeys).forEach((key) => delete this.idMapping[key]); // Remove from mapping table
            delete this.store[storeId]; // Delete the record
            return true;
        },
        removeWithEdges(omcEntity) {
            const removeId = omcIdentifier.idNormalize(omcEntity);
            const idKeys = this.mapStoreKeys(removeId);
            const storeKeys = Object.values(idKeys).filter((d, i, arr) => d && arr.indexOf(d) === i); // DeDupe and remove null
            const storeId = storeKeys.shift();
            Object.keys(idKeys).forEach((key) => delete this.idMapping[key]); // Remove from mapping table
            delete this.store[storeId]; // Delete the record for the entity
            const internalIds = Object.keys(this.store);
            const storeHistory = {
                old: [omcEntity],
                update: [],
                remove: [omcEntity],
            };
            internalIds.forEach((storeKey) => {
                // Cleaned before the comparison, not after. Stripping the last edge leaves `[]`
                // behind, and everything in the store is already normalized — so comparing the raw
                // result against the stored entity reports a change on every entity in the model
                // and fills the history with edits nobody made.
                const omcEnt = omcTransform.cleanEntity(removeEdge(this.store[storeKey], omcEntity));
                if (JSON.stringify(omcEnt) !== JSON.stringify(this.store[storeKey])) {
                    // const diff = compare({ original: omcEnt, comparison: this.store[storeKey] });
                    storeHistory.old.push(this.store[storeKey]);
                    storeHistory.update.push(omcEnt);
                    this.store[storeKey] = entityModel(omcEnt);
                }
            });
            return storeHistory;
        },
        reidentify(original, ent) {
            const storeId = this.internalIdMapping(original);
            if (!storeId) return this.replace(ent);
            Object.keys(this.mapStoreKeys(original.identifier || [])).forEach((key) => {
                if (this.idMapping[key] === storeId) delete this.idMapping[key];
            });
            Object.keys(this.mapStoreKeys(ent.identifier || [])).forEach((key) => {
                this.idMapping[key] = storeId;
            });
            this.store[storeId] = ent;
            return ent;
        },
        internalIdMapping(identifier) {
            // Normalize the identifier value, in case of it being full identifier, array of id's or single id
            if (!identifier) return null;
            const id = Object.hasOwn(identifier, 'identifier')
                ? identifier.identifier
                : makeArray(identifier);
            const idKeys = this.mapStoreKeys(id);
            const storeKeys = Object.values(idKeys).filter((d, i, arr) => d && arr.indexOf(d) === i); // DeDupe and remove null
            const storeId = storeKeys.shift();
            return storeId || null;
        },
        retrieve(identifier) { // ToDo: This should be able to use IdMapping (above)
            // Normalize the identifier value, in case of it being full identifier, array of id's or single id
            if (!identifier) return null;
            const id = Object.hasOwn(identifier, 'identifier')
                ? identifier.identifier
                : makeArray(identifier);
            const idKeys = this.mapStoreKeys(id);
            const storeKeys = Object.values(idKeys).filter((d, i, arr) => d && arr.indexOf(d) === i); // DeDupe and remove null
            const storeId = storeKeys.shift();
            return this.store[storeId] || null;
        },
        internal(storeId) {
            return this.store[storeId] || null;
        },
        exportCache() {
            return Object.keys(this.store).map((key) => this.store[key]);
        },
        find(filter, options = {}) {
            if (!filter) return null;
            return omcFind(Object.values(this.store), filter, options);
        },
    };
    const tCache = Object.create(proto); // Create the cache with interface
    tCache.cacheKey = 0;
    tCache.store = {};
    tCache.idMapping = {};
    tCache.missing = new Set(); // idKeys the source was asked for and does not have
    tCache.log = [];
    return tCache;
};

/**
 * Announce that the cache changed.
 *
 * Called from inside each mutator rather than by callers, so a write cannot be made
 * without announcing it. Deliberately a plain observer — no framework involvement —
 * so consumers can adapt it to whatever they use (e.g. React's useSyncExternalStore)
 * while the library stays framework-agnostic.
 *
 * @ignore
 */
function notify() {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
}

/**
 * Subscribe to cache mutations. The listener is called after any of `set`, `replace`,
 * `remove`, `removeWithEdges` or `reset` changes the store.
 *
 * The listener takes no arguments — it is a signal that the store moved, not a diff.
 * Read the new state back through `exportModel` / `get` / `find`, and pair with
 * {@link getVersion} when a cheap change-token is needed.
 *
 * @function subscribe
 * @memberof module:omcSDK
 * @param {function(): void} listener
 * @returns {function(): void} Unsubscribe; safe to call more than once
 *
 * @example
 * const stop = model.subscribe(() => render(model.exportModel()));
 * stop();
 */
function subscribe(listener) {
    if (typeof listener !== 'function') return (() => {});
    this.listeners.add(listener);
    return (() => {
        this.listeners.delete(listener);
    });
}

/**
 * A counter incremented on every store mutation — a cheap change-token that changes
 * exactly when the store does.
 *
 * @function getVersion
 * @memberof module:omcSDK
 * @returns {number}
 */
function getVersion() {
    return this.version;
}

/**
 * Set, or create, new entities in the store
 *
 * Entities are normalized on the way in (see {@link cleanEntity}), so nothing reading the store
 * ever has to ask which spelling of "empty" it is looking at.
 *
 * Returns **what the store now holds**, not what was handed in. Those differ in two ways that
 * matter: the stored copy is normalized, and on an identifier collision the incoming entity is
 * merged into the one already there, which wins any disagreement. A caller that carries its own
 * copy onward — into change history, or a save payload — would otherwise be carrying something
 * the store disagrees with.
 *
 * `keep` names entities whose stored state is final, typically ones with changes not yet saved.
 * They are left exactly as stored and, when absent, not added, so neither an edit nor a removal is
 * undone by loading the entity again.
 *
 * @memberof module:omcSDK
 * @static
 * @param {OmcJson} omc
 * @param {Object} [options]
 * @param {Array<OmcEntity|OmcIdentifier|Array<OmcIdentifier>>} [options.keep=[]] - Entities, or
 *   their identifiers, the incoming data must not change
 * @returns {Array<OmcEntity>|null} The stored entities, or null for bad input. A kept entity the
 *   store does not hold is left out.
 */
function set(omc, { keep = [] } = {}) {
    if (!omc) return null; // Check for bad input
    const keptKeys = new Set(keep.flatMap((ent) => omcIdentifier.idNormalize(ent)).map(omcIdentifier.idKey));
    const isKept = ((ent) => (ent.identifier || []).some((id) => keptKeys.has(omcIdentifier.idKey(id))));
    const normalizedOmc = (transform(omc)).unEmbed().toArray();
    // Cleaned before the model wrapper: entityModel is a shallow copy, so cleaning afterwards would
    // reach back through the shared nested values and rewrite the caller's own object.
    const storeIds = normalizedOmc.omc.map((ent) => (isKept(ent)
        ? this.cache.internalIdMapping(ent.identifier)
        : this.cache.add(entityModel(omcTransform.cleanEntity(ent)))));
    this.notify();
    // Read back after every add: a later copy of the same entity in this call may have merged into it.
    return storeIds.filter(Boolean).map((storeId) => this.cache.internal(storeId));
}

/**
 * Set or add an entity to the cache
 * @function replace
 * @param {OmcJson} omc
 * @returns {*|null}
 */
function replace(omc) {
    if (!omc) return null; // Check for bad input
    const normalizedOmc = (transform(omc)).unEmbed().toArray();
    // normalizedOmc.omc.forEach((ent) => {
    //     // const modelEnt = omcModel(ent);
    //     const modelEnt = entityModel(ent);
    //     this.cache.replace(modelEnt);
    // });
    const update = normalizedOmc.omc.map((omcEnt) => (
        this.cache.replace(entityModel(omcTransform.cleanEntity(omcEnt)))
    ));
    this.notify();
    return update;
}

/**
 * Get an entity stored in the cache
 * @function get
 * @param {OmcIdentifier} omcId
 * @param options
 * @returns {OmcEntity}
 */
function get(omcId, options = {}) {
    return this.cache.retrieve(omcId, options);
}

/**
 * Remove OMC entities that exist in the internal cache
 * @function remove
 * @memberof module:omcSDK
 * @param {OmcEntity} omc
 * @param {Object} options
 */
function remove(omc, options = {}) {
    if (!omc) return null; // Check for bad input
    const removed = this.cache.remove(omc, options);
    if (removed) this.notify();
    return removed;
}

/**
 * Replace an entity with a version carrying different identifiers, keeping its internal id, so
 * whatever holds that id still finds it. The identifiers the original had and the new version
 * lacks no longer resolve to it.
 *
 * @function reidentify
 * @memberof module:omcSDK
 * @param {OmcEntity} original - The entity as the model holds it
 * @param {OmcEntity} updated - The same entity under its new identifiers
 * @returns {OmcEntity|null} The stored entity
 */
function reidentify(original, updated) {
    if (!original || !updated) return null;
    const stored = this.cache.reidentify(original, entityModel(omcTransform.cleanEntity(updated)));
    this.notify();
    return stored;
}

/**
 * Remove OMC entities that exist in the internal cache
 * @function removeWithEdges
 * @memberof module:omcSDK
 * @param {OmcEntity} omc
 */
function removeWithEdges(omc) {
    if (!omc) return null; // Check for bad input
    const storeHistory = this.cache.removeWithEdges(omc);
    this.notify();
    return storeHistory;
}

/**
 * Return the internal identifier used by the cache, this can be useful for applications using the Model
 * as this will serve as a single identifier that is already mapped to omc identifiers.
 *
 * @function internalId
 * @memberof module:omcSDK
 * @param {OmcEntity} omcEntity
 * @param {Object} options
 */
function internalId(omcEntity, options = {}) {
    return this.cache.internalIdMapping(omcEntity, options);
}

function getInternalId(storeId) {
    return this.cache.internal(storeId);
}

/**
 * Record that the source this model loads from (fMam, for the Portal) was asked for these
 * identifiers and does not have them, so a loader need not ask again. Forgotten for an identifier
 * when an entity carrying it is stored, and entirely on `reset`.
 *
 * @function markMissing
 * @memberof module:omcSDK
 * @param {Array<OmcIdentifier|OmcEntity>} references - Identifiers, or references holding them
 */
function markMissing(references) {
    references.flatMap((ref) => omcIdentifier.idNormalize(ref))
        .forEach((id) => this.cache.missing.add(omcIdentifier.idKey(id)));
}

/**
 * Whether a reference is known to be missing from the source: every identifier it carries was asked
 * for and not found, and the model holds none of them.
 *
 * @function isMissing
 * @memberof module:omcSDK
 * @param {OmcIdentifier|OmcEntity} reference - An identifier, or a reference holding identifiers
 * @returns {boolean}
 */
function isMissing(reference) {
    const ids = omcIdentifier.idNormalize(reference);
    return ids.length > 0 && ids.every((id) => this.cache.missing.has(omcIdentifier.idKey(id)));
}

function reset() {
    this.cache = cache(); // Reset the cache, clearing its contents
    this.notify(); // Subscribers live on the store, not the cache, so they survive this
    return this;
}

function exportModel() {
    return this.cache.exportCache();
}

function find(filter, options = {}) {
    return this.cache.find(filter, options);
}

// Returns all references to intrinsic properties
function intrinsicProps(identifier) {
    if (!isIdentifier(identifier)) {
        console.log('Invalid identifier');
        return null;
    }
    const omc = this.get(identifier);
    return omc ? collapseProps(omc) : null;
}

function contextEdges(identifier) {
    if (!isIdentifier(identifier)) {
        console.log('Invalid identifier');
        return null;
    }
    const contextProps = ((obj) => {
        const relatedKeys = relatedEdges(obj);
        return relatedKeys.reduce((acc, cur) => ({
            ...acc,
            [cur]: collapseProps(obj[cur]),
        }), {});
    });
    const omc = this.get(identifier);
    return (omc?.entityType === 'Context') ? contextProps(omc) : null;
}

/**
 * @function omcSDK
 * @memberof module:omcSDK
 * @returns {OmcStore}
 */
export default function omcSDK() {
    return {
        cache: cache(),
        listeners: new Set(),
        version: 0,
        notify,
        subscribe,
        getVersion,
        internalId,
        getInternalId,
        get,
        set,
        remove,
        removeWithEdges,
        reidentify,
        replace,
        reset,
        markMissing,
        isMissing,
        exportModel,
        find,
        intrinsicProps,
        contextEdges,
        identifier: {
            // omcIdentifier exports `idMerge`; there is no `merge`, so this was `undefined` and
            // calling sdk.identifier.merge() would have thrown.
            merge: omcIdentifier.idMerge,
        },
    };
}
