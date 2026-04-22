/**
 * Builds the exported configuration tables for the desired schema
 *
 * This could be extended to include multiple versions of schemas in the future.
 */
import { generalConfig } from './generalConfig.js';
import * as omc2 from './v2-8/index.js';
import * as omc3 from './v3-0/index.js';
import { graphQlTemplate, inverseEdges, edgeTable } from './v3-0/index.js';

const versionTemplates = {
    'https://movielabs.com/omc/json/schema/v2.6': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v2.8': { ...omc2 },
    'https://movielabs.com/omc/json/schema/v3.0': { ...omc3 },
};

const omcTemplate = {
    edgeTable: (({ schemaVersion, entityType }) => (
        versionTemplates[schemaVersion].edgeTable[entityType]
    )),
};

export {
    generalConfig,
    graphQlTemplate,
    inverseEdges,
    edgeTable,
    omcTemplate,
};
