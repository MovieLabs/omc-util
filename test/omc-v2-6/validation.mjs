import { validate, migrate } from '../../index.mjs';
import { toObject, toArray, unEmbed } from '../../src/omc/transform.mjs';
import omc1 from '../omc-v2-0/examples/HSM/allCharacters.json' with {type: 'json'};

import europaCharacter from './examples/Europa/allCharacters.json' with {type: 'json'};
import europaLocation from './examples/Europa/allNarrativeObjects.json' with {type: 'json'};
import europaNarObjects from './examples/Europa/allNarrativeObjects.json' with {type: 'json'};
import europaNarScenes from './examples/Europa/allNarrativeScenes.json' with {type: 'json'};
import allCharacters from './examples/HSM/allCharacters.json' with {type: 'json'};
import allCreativeWork from './examples/HSM/allCreativeWork.json' with {type: 'json'};
import allDepictions from './examples/HSM/allDepictions.json' with {type: 'json'};
import allNarrativeLocations from './examples/HSM/allNarrativeLocations.json' with {type: 'json'};
import allNarrativeObjects from './examples/HSM/allNarrativeObjects.json' with {type: 'json'};
import allNarrativeScenes from './examples/HSM/allNarrativeScenes.json' with {type: 'json'};
import allNarrativeWardrobe from './examples/HSM/allNarrativeWardrobe.json' with {type: 'json'};
import allParticipants from './examples/HSM/allParticipants.json' with {type: 'json'};
import allPeople from './examples/HSM/allPeople.json' with {type: 'json'};
import allProductionLocations from './examples/HSM/allProductionLocations.json' with {type: 'json'};
import allProductionScenes from './examples/HSM/allProductionScenes.json' with {type: 'json'};
import allRoles from './examples/HSM/allRoles.json' with {type: 'json'};
import allSlates from './examples/HSM/allSlates.json' with {type: 'json'};
import assetSlate from './examples/HSM/Asset-Slate.json' with {type: 'json'};
import deepNesting from './examples/HSM/deepNesting.json' with {type: 'json'};
import assetCapture from './examples/HSM/getAssetCapture.json' with {type: 'json'};
import assetStoryboard from './examples/HSM/getAssetStoryboard.json' with {type: 'json'};
import prodSceneSlate from './examples/HSM/ProductionScene-Slate-Assets.json' with {type: 'json'};
import omc from './examples/singleEntities/Character.json' with {type: 'json'};

// import europaCreativeWorks from './examples/Europa/creativeWork.json' with {type: 'json'};

const options = {
    atomic: false,
    schemaVersion:'https://movielabs.com/omc/json/schema/v2.6',
};

const charArrayValidationError = validate(deepNesting, options);
// console.log(charArrayValidationError);

const europa = validate(europaNarScenes, options);
// console.log(asArray);

const omcMigration = unEmbed(omc1);
const omcObject = toObject(omc1);
const objUnEmbed = unEmbed(omcObject);
const testArray = toArray(omc);
const migrationTest = migrate(objUnEmbed);
const validateMigration = validate(migrationTest, options);

console.log();
