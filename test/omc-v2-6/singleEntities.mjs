import * as assert from 'node:assert';
import test, { describe, it } from 'node:test';

import { validate } from '../../index.mjs';

import asset from './examples/singleEntities/Asset.json' with {type: 'json'};
import assetSC from './examples/singleEntities/AssetSC.json' with {type: 'json'};
import character from './examples/singleEntities/Character.json' with {type: 'json'};
import composition from './examples/singleEntities/Composition.json' with {type: 'json'};
import creativeWork from './examples/singleEntities/CreativeWork.json' with {type: 'json'};
import department from './examples/singleEntities/Department.json' with {type: 'json'};
import depiction from './examples/singleEntities/Depiction.json' with {type: 'json'};
import effect from './examples/singleEntities/Effect.json' with {type: 'json'};
import infrastructure from './examples/singleEntities/Infrastructure.json' with {type: 'json'};
import infrastructureSC from './examples/singleEntities/InfrastructureSC.json' with {type: 'json'};
import location from './examples/singleEntities/Location.json' with {type: 'json'};
import narrativeAudio from './examples/singleEntities/NarrativeAudio.json' with {type: 'json'};
import narrativeLocation from './examples/singleEntities/NarrativeLocation.json' with {type: 'json'};
import narrativeObject from './examples/singleEntities/NarrativeObject.json' with {type: 'json'};
import narrativeScene from './examples/singleEntities/NarrativeScene.json' with {type: 'json'};
import narrativeStyling from './examples/singleEntities/NarrativeStyling.json' with {type: 'json'};
import narrativeWardrobe from './examples/singleEntities/NarrativeWardrobe.json' with {type: 'json'};
import organization from './examples/singleEntities/Organization.json' with {type: 'json'};
import participant from './examples/singleEntities/Participant.json' with {type: 'json'};
import person from './examples/singleEntities/Person.json' with {type: 'json'};
import productionLocation from './examples/singleEntities/ProductionLocation.json' with {type: 'json'};
import productionScene from './examples/singleEntities/ProductionScene.json' with {type: 'json'};
import role from './examples/singleEntities/Role.json' with {type: 'json'};
import service from './examples/singleEntities/Service.json' with {type: 'json'};
import slate from './examples/singleEntities/Slate.json' with {type: 'json'}
import specialAction from './examples/singleEntities/SpecialAction.json' with {type: 'json'};
import task from './examples/singleEntities/Task.json' with {type: 'json'};
import taskSC from './examples/singleEntities/TaskSC.json' with {type: 'json'};

const options = {
    atomic: true,
    // schemaVersion:'https://movielabs.com/omc/json/schema/v2.5-dev',
};

describe('omc Asset validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(asset, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc AssetSC validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(assetSC, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Character validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(character, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Creative Work validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(creativeWork, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Depiction validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(depiction, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Effect validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(effect, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc NarrativeAudio validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(narrativeAudio, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc NarrativeLocation.mjs validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(narrativeLocation, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc NarrativeObject validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(narrativeObject, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc NarrativeScene validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(narrativeScene, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc NarrativeStyling validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(narrativeStyling, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc NarrativeWardrobe validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(narrativeWardrobe, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc ProductionLocation validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(productionLocation, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc ProductionScene validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(productionScene, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Slate validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(slate, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Special Action validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(specialAction, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Participant validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(participant, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Person validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(person, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Organization validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(organization, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Department validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(department, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Service validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(service, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Role validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(role, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Task validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(task, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc TaskSC validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(taskSC, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Infrastructure validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(infrastructure, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc InfrastructureSC validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(infrastructureSC, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Location validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(location, options);
        assert.strictEqual(validationResult, true);
    });
});

describe('omc Composition validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(composition, options);
        assert.strictEqual(validationResult, true);
    });
});

const omcObject = {
    Asset: asset,
    AssetSC: assetSC,
    Character: character,
    CreativeWork: creativeWork,
    Depiction: depiction,
    Effect: effect,
    NarrativeAudio: narrativeAudio,
    NarrativeLocation: narrativeLocation,
    NarrativeObject: narrativeObject,
    NarrativeScene: narrativeScene,
    NarrativeStyling: narrativeStyling,
    NarrativeWardrobe: narrativeWardrobe,
    ProductionLocation: productionLocation,
    ProductionScene: productionScene,
    Slate: slate,
    SpecialAction: specialAction,
    Participant: participant,
    Person: person,
    Organization: organization,
    Department: department,
    Service: service,
    Role: role,
    Task: task,
    TaskSC: taskSC,
    Infrastructure: infrastructure,
    InfrastructureSC: infrastructureSC,
    Location: location,
    Composition: composition,
};

describe('omc Object Properties validation', () => {
    it('should return true for valid OMC-JSON', () => {
        const validationResult = validate(omcObject, options);
        assert.strictEqual(validationResult, true);
    });
});
