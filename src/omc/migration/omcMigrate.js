/**
 * Migrate Omc-Json across versions of the schema
 *
 * @module omcMigrate
 */

import v26 from './v2-0tov2-6.js'; // Migrate from v2.0 & v2.1 to 2.6
import v28 from './v2-6tov2-8.js'; // Migrate from v2.6 to 2.8
import v30 from './v2-8tov3-0.js'; // Migrate from 2.8 to 3.0

const schemaMigration = {
    'https://movielabs.com/omc/json/schema/v2.6': v26, // Migrate from 2.6 to 2.8
    'https://movielabs.com/omc/json/schema/v2.8': v28, // Migrate from 2.6 to 2.8
    'https://movielabs.com/omc/json/schema/v3.0': v30, // Migrate from 2.8 to 3.0
};

const schemaOrder = Object.keys(schemaMigration);

const latestSchemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

// Migrate a single instance
function migrateInstance(omc, toSchemaVersion) {
    const {
        entityType,
        schemaVersion,
    } = omc;

    if (!entityType || !schemaVersion) return { ...omc }; // Cannot migrate without these

    const migrationPattern = schemaMigration[toSchemaVersion]; // Use pattern for current schema version

    if (!migrationPattern) {
        console.log(`No migration pattern found for schema version ${toSchemaVersion}`);
        return { ...omc };
    }

    if (schemaOrder.indexOf(toSchemaVersion) < schemaOrder.indexOf(schemaVersion)) {
        console.log(`Entity uses schemaVersion ${schemaVersion}, cannot be downgraded to ${toSchemaVersion}`);
        return { ...omc };
    }

    if (toSchemaVersion === schemaVersion) return omc; // Already at the target schema version
    return migrationPattern[entityType](omc);
}

/*
 Recurse down a nested entity migrating all instances to the latest schema version
 */
function migrateNested(ent, toSchemaVersion) {
    if (!Array.isArray(ent) && (typeof ent !== 'object' || ent === null)) {
        return ent; // Down to a primitive, null or undefined, so we are at a leaf
    }
    const refEnt = migrateInstance(ent, toSchemaVersion); // Migrate the entity if there is a migration path

    // If this is an array, then we parse each element (used in Context)
    if (Array.isArray(refEnt)) return refEnt.map((e1) => migrateNested(e1));

    const refKeys = Object.keys(refEnt);
    refKeys.forEach((refKey) => {
        if (ent[refKey] !== null) {
            refEnt[refKey] = Array.isArray(refEnt[refKey])
                ? refEnt[refKey].flatMap((e1) => migrateNested(e1))
                : migrateNested(refEnt[refKey]);
        }
    });
    return refEnt;
}

// Migrate a set of entities
const migrateSet = ((omc, toSchemaVersion) => omc.map((ent) => migrateNested(ent, toSchemaVersion)));

/**
 * Migrate either an array of OMC entities a single OMC entity or an object of OMC entities
 *
 * @function omcMigrate
 * @param {OmcJson} omc - The OMC entity or entities to migrate
 * @param {string} [toSchemaVersion] - Migrate up to this schema version (defaults to latest)
 * @returns {OmcJson}
 */
export default function omcMigrate(omc, toSchemaVersion = latestSchemaVersion) {
    if (Array.isArray(omc)) return migrateSet(omc, toSchemaVersion); // Array of instances
    if (Object.hasOwn(omc, 'entityType')) return migrateNested(omc, toSchemaVersion); // Single instance
    return Object.keys(omc).reduce((obj, entKey) => (
        { ...obj, ...{ [entKey]: migrateSet(omc[entKey], toSchemaVersion) } }), {});
}
