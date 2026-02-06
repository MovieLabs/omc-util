/**
 * A set of utilities useful when using OMC-JSON
 *
 * @module omcUtil
 *
 */

import './types.mjs'; // Import the omc type definitions

import omcCompare from './src/omc/compare.mjs';
import * as omcEdges from './src/omc/edges.mjs';
import omcFind from './src/omc/find.mjs';
import * as omcIdentifier from './src/omc/identifier.mjs';
import migrate from './src/omc/migrate.mjs';
import * as queryBuilder from './src/omc/queryBuilder/index.mjs';
import * as omcTransform from './src/omc/transform.mjs';
import validate from './src/omc/validate.mjs';
import entityModel from './src/omcModel/entityModel.mjs';
import omcSDK from './src/omcModel/omcSDK.mjs';

console.log('Imported OMC-UTIL');

export {
    migrate,
    omcCompare,
    omcFind,
    omcEdges,
    omcTransform,
    omcIdentifier,
    queryBuilder,
    validate,
    entityModel,
    omcSDK,
};
