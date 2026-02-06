import * as assert from 'node:assert';
import test, { describe, it } from 'node:test';

import { validate } from '../../index.mjs';

import cgAssembly from './examples/cg/cg_assembly.json' with {type: 'json'};
import compositeMaterial from './examples/cg/composite_material.json' with {type: 'json'};
import geometryAssembly from './examples/cg/geo_assembly.json' with {type: 'json'};
import oneGeometry from './examples/cg/one_geo.json' with {type: 'json'};
import oneMap from './examples/cg/one_map.json' with {type: 'json'};
import oneMaterial from './examples/cg/one_mtlx.json' with {type: 'json'};

const options = {
    atomic: true,
    // schemaVersion:'https://movielabs.com/omc/json/schema/v2.5-dev',
};

describe('OMC CG Assembly validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(cgAssembly, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('OMC Composite Material validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(compositeMaterial, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('OMC Geometry Assembly validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(geometryAssembly, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('OMC one Geometry validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(oneGeometry, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('OMC one Map validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(oneMap, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('OMC one Material validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(oneMaterial, options);
        assert.strictEqual(validationResult, true);
    });
});
