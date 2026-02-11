import { omcValidate } from '../../index.mjs';
import { toObject, toArray, unEmbed } from '../../src/omc/transform.mjs';

import omc from './examples/OMC_Export_test_VFX.json' with {type: 'json'};

// import europaCreativeWorks from './examples/Europa/creativeWork.json' with {type: 'json'};

const options = {
    atomic: false,
    // schemaVersion:'https://movielabs.com/omc/json/schema/v2.8',
};

const europa = omcValidate(omc, options);
console.log(europa);

const omcMigration = unEmbed(omc);
// const omcObject = toObject(omc);
// const objUnEmbed = unEmbed(omcObject);
// const testArray = toArray(omc);
// const migrationTest = migrate(objUnEmbed);
// const validateMigration = validate(migrationTest, options);

console.log();
