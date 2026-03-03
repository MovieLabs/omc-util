import { omcMigrate, omcValidate } from '../../../index.mjs';

import omcDepiction from './examples/Depiction.json' with { type: 'json' };
import omcTurnover from './examples/VFX-Turnover-v28.json' with { type: 'json' };

const migrate1 = omcMigrate(omcDepiction, 'https://movielabs.com/omc/json/schema/v3.0');
const validate1 = omcValidate(migrate1, { atomic: false, schemaVersion: null });

const migrate2 = omcMigrate(omcTurnover, 'https://movielabs.com/omc/json/schema/v3.0');
const validate2 = omcValidate(migrate2, { atomic: false, schemaVersion: null });

console.log(migrate2);
console.log(validate2);

