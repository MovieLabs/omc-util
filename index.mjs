/**
 * A set of utilities useful when using OMC-JSON
 *
 * @namespace OmcUtil
 */

import './types.mjs'; // Import the omc type definitions

// Direct re-exports — bundlers can tree-shake unused modules
export { default as omcCompare } from './src/omc/compare.mjs';
export * as omcEdges from './src/omc/edges.mjs';
export { default as omcFind } from './src/omc/find.mjs';
export { default as omcMigrate } from './src/omc/migrate.mjs';
export * as omcGraphQl from './src/omc/omcGraphQl/index.mjs';
export * as omcIdentifier from './src/omc/omcIdentifier.mjs';
export * as omcTransform from './src/omc/transform.mjs';
export { default as omcValidate } from './src/omc/validate.mjs';
export { default as omcSDK } from './src/omcModel/omcSDK.mjs';

export * from './src/config/index.mjs';
export * from './src/omcModel/entityModel.mjs';
