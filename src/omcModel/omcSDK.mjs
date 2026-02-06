/**
 * Creates a document model for OMC
 *
 * @module omcSDK
 */

import { omcEdges } from '../../index.mjs';
import { makeArray, isPlainObject, isCapitalized } from '../mlHelpers/util.mjs';
import omcCompare from '../omc/compare.mjs';
import { relatedEdges } from '../omc/edges.mjs';
import omcFind from '../omc/find.mjs';
import * as omcIdentifier from '../omc/identifier.mjs';
import * as omcTransform from '../omc/transform.mjs';

import entityModel from './entityModel.mjs';

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
 * @memberOf module:omcSDK
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
                const idKey = omcIdentifier.key(id);
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
            const removeId = omcIdentifier.normalizeIdentifier(omcEntity);
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
                const omcEnt = omcEdges.removeEdge(this.store[storeKey], omcEntity);
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
        find(filter) {
            if (!filter) return null;
            return omcFind(Object.values(this.store), filter);
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
 * Set, or create, new entities in the store
 * @memeberOf module:omcSDK
 * @static
 * @param {OmcEntity} omc
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
    return normalizedOmc; // ToDo: This should at least return the entity models
}

/**
 * Set or add and entity to the cache
 * @function replace
 * @param omc
 * @returns {*|null}
 */
function replace(omc) {
    if (!omc) return null; // Check for bad input
    const normalizedOmc = (transform(omc)).unEmbed().toArray();
    normalizedOmc.omc.forEach((ent) => {
        // const modelEnt = omcModel(ent);
        const modelEnt = entityModel(ent);
        this.cache.replace(modelEnt);
    });
    return normalizedOmc;
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
 * @memberOf module:omcSDK
 * @param omc
 * @param options
 */

function remove(omc, options = {}) {
    if (!omc) return null; // Check for bad input
    return this.cache.remove(omc, options);
}

/**
 * Remove OMC entities that exist in the internal cache
 * @function removeWithEdges
 * @memberOf module:omcSDK
 * @param {OmcEntity} omc
 */

function removeWithEdges(omc) {
    if (!omc) return null; // Check for bad input
    return this.cache.removeWithEdges(omc);
}

/**
 * Return the internal identifier used by the cache, this can be useful for applications using the Model
 * as this will serve as a single identifier that is already mapped to omc identifiers.
 *
 * @function internalId
 * @memberOf module:omcSDK
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
 * @typedef OmcStore
 * @memberOf module:omcSDK
 * @property {function(): string} internalId {@link module:omcSDK.internalId}
 * @property {function(): OmcEntity} get {@link module:omcSDK.get}
 * @property {function(): OmcEntity} set {@link module:omcSDK.set}
 */

/**
 * @function omcSDK
 * @memberOf module:omcSDK
 * @returns {OmcStore}
 */

export default function omcSDK() {
    return {
        cache: cache(),
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
