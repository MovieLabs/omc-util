import * as assert from 'node:assert';
import test, { describe, it } from 'node:test';

import { validate } from '../../index.mjs';

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

const options = {
    atomic: true,
    schemaVersion:'https://movielabs.com/omc/json/schema/v2.6',
};

describe('omc allCharacters validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allCharacters, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allCreativeWork validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allCreativeWork, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allDepictions validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allDepictions, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allNarrativeLocations validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allNarrativeLocations, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allNarrativeObjects validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allNarrativeObjects, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allNarrativeScenes validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allNarrativeScenes, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allNarrativeWardrobe validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allNarrativeWardrobe, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allParticipants validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allParticipants, options);
        assert.strictEqual(validationResult, true);
    });
});
describe('omc allPeople validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allPeople, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allProductionLocations validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allProductionLocations, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allProductionScenes validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allProductionScenes, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allRoles validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allRoles, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allSlates validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(allSlates, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc allAssetSlate validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(assetSlate, options);
        assert.strictEqual(validationResult, true);
    });
});
