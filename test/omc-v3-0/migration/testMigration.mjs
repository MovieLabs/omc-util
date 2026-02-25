import { omcMigrate, omcValidate } from '../../../index.mjs';

import omcDepiction from './examples/Depiction.json' with { type: 'json' };

const migrate1 = omcMigrate(omcDepiction, 'https://movielabs.com/omc/json/schema/v3.0');
const validate1 = omcValidate(migrate1, { atomic: false, schemaVersion: null });

console.log(migrate1);
console.log(validate1);
