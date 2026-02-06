import { validate, migrate } from '../../index.mjs';
import { toObject, unEmbed } from '../../src/omc/transform.mjs';

import allCharacters from './examples/HSM/allCharacters.json' with {type: 'json'};
import deepNesting from './examples/HSM/deepNesting.json' with {type: 'json'};
import allCharactersError from './examples/HSM/allCharacters-v2-0-error.json' with {type: 'json'};
import assetSlate from './examples/HSM/Asset-Slate.json' with {type: 'json'};
import europaAllCharacters from './examples/Europa/allCharacters.json' with {type: 'json'};
import nbcvfx from './examples/HSM/Asset_35360-002_Challenger_test.json' with {type: 'json'};

import europaCharacter from './examples/Europa/allCharacters.json' with {type: 'json'};
import europaLocation from './examples/Europa/allNarrativeObjects.json' with {type: 'json'};
import europaNarObjects from './examples/Europa/allNarrativeObjects.json' with {type: 'json'};
import europaNarScenes from './examples/Europa/allNarrativeScenes.json' with {type: 'json'};
import europaCreativeWorks from './examples/Europa/creativeWork.json' with {type: 'json'};

const options = {
    atomic: false,
    schemaVersion:'https://movielabs.com/omc/json/schema/v2.6',
};

// const charArrayValidationError = omcValidate(allCharactersError, options);
// console.log(charArrayValidationError);

const asArray = validate(europaCharacter, options);
// console.log(asArray);

const omcMigration = unEmbed(europaCharacter);
const migrationTest = migrate(europaCharacter);

// const allChar25 = migrate(allCharacters, options);

const charArrayValidation = validate(migrationTest, options);


// const charObj = toObject(allCharacters);
/// const charObjValidation = omcValidate(charObj, options);

// console.log(charArrayValidation);
// console.log(charObjValidation);

const nbcvfxObj = validate(nbcvfx, options);
console.log(nbcvfxObj);

console.log();
