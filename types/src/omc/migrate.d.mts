/**
 * Migrate either an array of OMC entities a single OMC entity or an object of OMC entities
 *
 * @function migrate
 * @param {OmcJson} omc - The OMC entity or entities to migrate
 * @param {string} [toSchemaVersion] - Migrate up to this schema version (defaults to latest)
 * @returns {OmcJson}
 */
export default function migrate(omc: OmcJson, toSchemaVersion?: string): OmcJson;
