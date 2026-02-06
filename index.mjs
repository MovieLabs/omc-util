/**
 * A set of utilities useful when using OMC-JSON
 *
 * @namespace OmcUtil
 */

import './types.mjs'; // Import the omc type definitions

import omcCompare from './src/omc/compare.mjs';
import * as omcEdges from './src/omc/edges.mjs';
import omcFind from './src/omc/find.mjs';
import * as omcIdentifier from './src/omc/identifier.mjs';
import omcMigrate from './src/omc/migrate.mjs';
import * as queryBuilder from './src/omc/queryBuilder/index.mjs';
import * as omcTransform from './src/omc/transform.mjs';
import omcValidate from './src/omc/validate.mjs';
import entityModel from './src/omcModel/entityModel.mjs';
import omcSDK from './src/omcModel/omcSDK.mjs';

export {
    omcMigrate,
    omcCompare,
    omcFind,
    omcEdges,
    omcTransform,
    omcIdentifier,
    queryBuilder,
    omcValidate,
    entityModel,
    omcSDK,
};
