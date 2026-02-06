import * as assert from 'node:assert';
import test, { describe, it } from 'node:test';

import { validate } from '../../index.mjs';

import character from './examples/singleEntities/Character.json' with {type: 'json'};
// import CreativeWork from './examples/allCreativeWork.json' with {type: 'json'}
import depiction from './examples/singleEntities/Depiction.json' with {type: 'json'};

const options = {
    atomic: true,
    schemaVersion:'https://movielabs.com/omc/json/schema/v2.6',
};

describe('omc Character validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(character, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Depiction validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(depiction, options);
        assert.strictEqual(validationResult, true);
    });
});

