/**
 * Creates a document model for OMC
 *
 * @module omcSDK
 */

import { makeArray, isPlainObject, isCapitalized } from '../mlHelpers/util.js';
import omcCompare from '../omc/omcCompare.js';
import { relatedEdges, removeEdge } from '../omc/omcEdges.js';
import omcFind from '../omc/omcFind.js';
import * as omcIdentifier from '../omc/omcIdentifier.js';
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

            if (Object.hasOwn(this.store, storeId)) { // Is there already an entity with this identifier?
                const compare = omcCompare({ original: this.store[storeId], comparison: ent });
                if (compare.diff) {
                    const a = JSON.stringify(this.store[storeId]); // ToDo: Do some business logic here
                    const b = JSON.stringify(ent);
                    const msg = b > a ? 'New is greater (maybe swap)' : 'Existing looks best';
                    console.log(`Same identifier, but entities not equal: ${msg}`);
                }
            } else {
                this.store[storeId] = ent; // First time seeing this, so add the entity to the deDupe object
            }
        },
        replace(ent) {
            const { identifier = [] } = ent; // Safeguard against missing identifier (should never happen)

            // Map the entities identifiers to a cacheId if one exists
            const idKeys = this.mapStoreKeys(identifier);
            const storeKeys = Object.values(idKeys).filter((d, i, arr) => d && arr.indexOf(d) === i); // DeDupe and remove null
            const storeId = storeKeys.length === 0 ? this.tempId() : storeKeys.shift();
            Object.keys(idKeys).forEach((idKey) => this.idMapping[idKey] = storeId); // Update the mapping table
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
                const omcEnt = removeEdge(this.store[storeKey], omcEntity);
                if (JSON.stringify(omcEnt) !== JSON.stringify(this.store[storeKey])) {
                    // const diff = compare({ original: omcEnt, comparison: this.store[storeKey] });
                    storeHistory.old.push(this.store[storeKey]);
                    storeHistory.update.push(omcEnt);
                    this.store[storeKey] = entityModel(omcEnt);
                }
            });
            return storeHistory;
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
 * @memberof module:omcSDK
 * @static
 * @param {OmcJson} omc
 * @returns {*|null}
 */
function set(omc) {
    if (!omc) return null; // Check for bad input
    const normalizedOmc = (transform(omc)).unEmbed().toArray();
    normalizedOmc.omc.forEach((ent) => {
        // const modelEnt = omcModel(ent);
        // this.cache.add(modelEnt);
        const tempEnt = entityModel(ent); // Create the entity model
        this.cache.add(tempEnt); // Add to the cache
    });
    this.notify();
    return normalizedOmc; // ToDo: This should at least return the entity models
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
    const update = normalizedOmc.omc.map((omcEnt) => this.cache.replace(entityModel(omcEnt)));
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
        replace,
        reset,
        exportModel,
        find,
        intrinsicProps,
        contextEdges,
        identifier: {
            merge: omcIdentifier.merge,
        },
    };
}
