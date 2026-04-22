/**
 * A set of utilities useful when using OMC-JSON
 *
 * @namespace OmcUtil
 */

import './types.js'; // Import the omc type definitions

// Direct re-exports — bundlers can tree-shake unused modules
export { default as omcCompare } from './src/omc/omcCompare.js';
export * as omcEdges from './src/omc/omcEdges.js';
export { default as omcFind } from './src/omc/omcFind.js';
export { default as omcMigrate } from './src/omc/migration/omcMigrate.js';
export * as omcGraphQl from './src/omc/omcGraphQl/index.js';
export * as omcIdentifier from './src/omc/omcIdentifier.js';
export * as omcMerge from './src/omc/omcMerge.js';
export * as omcTransform from './src/omc/omcTransform.js';
export { default as omcValidate } from './src/omc/validation/omcValidate.js';
export { default as omcSDK } from './src/omcModel/omcSDK.js';

export * from './src/templates/index.js';
export * from './src/omcModel/entityModel.js';
