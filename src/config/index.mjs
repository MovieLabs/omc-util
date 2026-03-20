/**
 * Builds the exported configuration tables for the desired schema
 *
 * This could be extended to include multiple versions of schemas in the future.
 */
import { generalConfig } from './generalConfig.mjs';
import { graphQlTemplate, inverseEdges, edgeTable } from './v3-0/index.mjs';

export {
    generalConfig,
    graphQlTemplate,
    inverseEdges,
    edgeTable,
};
