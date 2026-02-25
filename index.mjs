/**
 * A set of utilities useful when using OMC-JSON
 *
 * @namespace OmcUtil
 */

import './types.mjs'; // Import the omc type definitions

// Direct re-exports — bundlers can tree-shake unused modules
export { default as omcCompare } from './src/omc/omcCompare.mjs';
export * as omcEdges from './src/omc/omcEdges.mjs';
export { default as omcFind } from './src/omc/omcFind.mjs';
export { default as omcMigrate } from './src/omc/migration/omcMigrate.mjs';
export * as omcGraphQl from './src/omc/omcGraphQl/index.mjs';
export * as omcIdentifier from './src/omc/omcIdentifier.mjs';
export * as omcMerge from './src/omc/omcMerge.mjs';
export * as omcTransform from './src/omc/omcTransform.mjs';
export { default as omcValidate } from './src/omc/validation/omcValidate.mjs';
export { default as omcSDK } from './src/omcModel/omcSDK.mjs';

export * from './src/config/index.mjs';
export * from './src/omcModel/entityModel.mjs';
