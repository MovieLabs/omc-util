/**
 * Guard: a v2.8 pull request migrates to v3.0 without throwing or losing what it carried.
 *
 * `Pull_Init.json` is valid v2.8 and holds the three shapes this pins: a Sequence, which becomes a
 * Composition; an asset group whose members are nested under `Asset`; and an AssetSC with a `Carrier`.
 *
 *   Usage: node test/omcMigrate.js
 */

import { readFileSync } from 'node:fs';

import omcMigrate from '../src/omc/migration/omcMigrate.js';
import omcValidate from '../src/omc/validation/omcValidate.js';

const v28 = 'https://movielabs.com/omc/json/schema/v2.8';
const v30 = 'https://movielabs.com/omc/json/schema/v3.0';

let failures = 0;
const pass = ((msg) => console.log(`  ✓ ${msg}`));
const fail = ((msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
});
const check = ((label, cond, detail = '') => (cond ? pass(label) : fail(`${label}   ${detail}`)));

const source = JSON.parse(readFileSync(new URL('./Pull_Init.json', import.meta.url), 'utf8'));
const idValue = ((ent) => ent?.identifier?.[0]?.identifierValue);
const byId = ((omc, value) => omc.find((ent) => idValue(ent) === value));

check('the source is valid v2.8', omcValidate(source) === true);

let migrated = [];
try {
    migrated = omcMigrate(structuredClone(source));
    pass('the whole file migrates without throwing');
} catch (e) {
    fail(`the whole file migrates without throwing   ${e.message}`);
}

// ---- a Sequence becomes a Composition of type sequence ----

{
    const sequence = byId(migrated, 'seq-EUR_101_v03');
    check('the Sequence becomes a Composition', sequence?.entityType === 'Composition', `got ${sequence?.entityType}`);
    check('its compositionType is sequence', sequence?.compositionType === 'sequence', `got ${sequence?.compositionType}`);
    check('its name carries across', sequence?.compositionName?.fullName === 'ALE Metadata Sample'
    && sequence?.label === 'ALE Metadata Sample');

    const typed = omcMigrate({ ...structuredClone(sequence), schemaVersion: v28, entityType: 'Sequence', sequenceType: 'vfx' });
    check('a sequenceType becomes the sub-type', typed?.compositionType === 'sequence.vfx', `got ${typed?.compositionType}`);
    const image = omcMigrate({ ...structuredClone(sequence), schemaVersion: v28, entityType: 'Sequence', sequenceType: 'image' });
    check('a sequenceType with no v3.0 sub-type is plain sequence', image?.compositionType === 'sequence', `got ${image?.compositionType}`);

    const task = byId(migrated, 'BIND_VFX_PULL_001');
    check(
        'a reference to the Sequence follows it to Composition',
        idValue(task?.edges?.for?.Composition?.[0]) === 'seq-EUR_101_v03' && !task?.edges?.for?.Sequence,
        JSON.stringify(task?.edges?.for),
    );
}

// ---- everything else reaches v3.0 and validates there ----

// An embedded carrier is reduced to a reference first: v3.0 Infrastructure has no structure or
// function, so a migrated one does not validate wherever it sits.
const carrierAsReference = ((ent) => {
    const properties = ent.AssetStructure?.[0]?.assetStructureProperties;
    if (!properties?.Carrier) return ent;
    const copy = structuredClone(ent);
    copy.AssetStructure[0].assetStructureProperties.Carrier = properties.Carrier
        .map(({ identifier }) => ({ identifier }));
    return copy;
});

omcValidate(migrated.map(carrierAsReference), { atomic: false })
    .forEach((res) => {
        const what = `${res.omcEntity.entityType} ${idValue(res.omcEntity)}`;
        check(`${what} is v3.0`, res.omcEntity.schemaVersion === v30, `got ${res.omcEntity.schemaVersion}`);
        check(`${what} validates`, res.valid, JSON.stringify(res.error?.map?.((err) => [err.instancePath, err.keyword, err.params])));
    });

// ---- group members move onto the structure ----

{
    const group = byId(migrated, 'mvl_101_012_050');
    const structure = group?.AssetStructure?.[0];
    const members = structure?.assetStructureProperties?.assetGroup?.Member ?? [];

    check('the group keeps no nested Asset', group && !Object.hasOwn(group, 'Asset'));
    check(
        'both plates are members of the structure',
        members.map(idValue).join() === 'mvl_101_012_050_plt-bg_001,mvl_101_012_050_plt-fg_001',
        `got ${members.map(idValue).join()}`,
    );
    check('the members are migrated', members.every((ent) => ent.schemaVersion === v30));
    check(
        'a member keeps what its Contexts carried',
        idValue(members[0]?.edges?.has?.Slate?.[0]) === 'slate-mvl_101_012_050_plt-bg_001',
    );
    check(
        'a member keeps its derivation',
        idValue(members[0]?.AssetStructure?.[0]?.versionInfo?.DerivationOf?.[0]) === 'ocf-65C4BD3F589F00E3',
    );
}

// ---- a group whose structure is absent or only a reference gets a new one ----

{
    const sourceGroup = byId(source, 'mvl_101_012_050');
    const withStructure = ((assetSC) => {
        const copy = structuredClone(sourceGroup);
        if (assetSC) copy.AssetSC = assetSC;
        else delete copy.AssetSC;
        return copy;
    });
    const memberIds = 'mvl_101_012_050_plt-bg_001,mvl_101_012_050_plt-fg_001';
    const referenced = { identifier: [{ identifierScope: 'labkoat', identifierValue: 'asc-elsewhere' }] };

    [['only a reference', referenced], ['absent', null]].forEach(([how, assetSC]) => {
        const group = omcMigrate(withStructure(assetSC));
        const structure = group.AssetStructure?.[0];
        const members = structure?.assetStructureProperties?.assetGroup?.Member ?? [];

        check(`structure ${how}: the group keeps no nested Asset`, !Object.hasOwn(group, 'Asset'));
        check(`structure ${how}: a new assetGroup structure holds the members`,
            structure?.entityType === 'AssetStructure' && structure.assetStructureType === 'assetGroup'
            && members.map(idValue).join() === memberIds, `got ${JSON.stringify(structure)?.slice(0, 200)}`);
        check(`structure ${how}: its identifier is stable for the Asset`,
            idValue(structure) === idValue(omcMigrate(withStructure(assetSC)).AssetStructure?.[0])
            && idValue(structure) !== 'asc-elsewhere');
        check(`structure ${how}: the group validates`,
            omcValidate(carrierAsReference(group)) === true);
    });

    const anonymous = withStructure(referenced);
    delete anonymous.identifier;
    const kept = omcMigrate(anonymous);
    check('a group with no identifier keeps its members on the Asset', Object.hasOwn(kept, 'Asset'),
        JSON.stringify(Object.keys(kept)));
}

// ---- Carrier moves into the structure's properties ----

{
    const structure = byId(migrated, 'ocf-65C4BD3F589F00E3')?.AssetStructure?.[0];
    const carrier = structure?.assetStructureProperties?.Carrier;

    check('the structure keeps no top-level Carrier', structure && !Object.hasOwn(structure, 'Carrier'));
    check('Carrier is an array of one', Array.isArray(carrier) && carrier.length === 1);
    check('the carrier is migrated', carrier?.[0]?.schemaVersion === v30 && carrier?.[0]?.entityType === 'Infrastructure');
    check('the other structural properties stay', structure?.assetStructureProperties?.fileDetails?.fileExtension === 'mxf');
}

// ---- properties v3.0 renamed, reshaped or dropped ----

{
    const entity = ((entityType, value, rest) => ({
        schemaVersion: v28,
        entityType,
        identifier: [{ identifierScope: 'labkoat', identifierValue: value }],
        ...rest,
    }));
    const valid = ((ent) => omcValidate(ent) === true);

    const named = omcMigrate(entity('ProductionScene', 'ps-named', {
        sceneName: { fullName: '12A' }, sceneHeader: 'INT. KITCHEN - DAY',
    }));
    check('a sceneHeader is dropped where the name has a fullName',
        named.productionSceneName?.fullName === '12A' && !Object.hasOwn(named, 'sceneHeader'),
        JSON.stringify(named));
    check('that ProductionScene validates', valid(named));
    const unnamed = omcMigrate(entity('ProductionScene', 'ps-unnamed', {
        sceneName: { altName: '12' }, sceneHeader: 'INT. KITCHEN - DAY',
    }));
    check('a sceneHeader becomes the fullName where the name has none',
        unnamed.productionSceneName?.fullName === 'INT. KITCHEN - DAY' && unnamed.productionSceneName?.altName === '12',
        JSON.stringify(unnamed.productionSceneName));

    const scene = omcMigrate(entity('NarrativeScene', 'ns-1', {
        slugline: [{ author: 'Script-E', title: 'Scene Slug', text: 'Julia finds the letter' }],
    }));
    check('slugline notes become full pieces',
        JSON.stringify(scene.slugline) === JSON.stringify([{ piece: 'full', text: 'Julia finds the letter' }]),
        JSON.stringify(scene.slugline));
    check('that NarrativeScene validates', valid(scene));

    const object = omcMigrate(entity('NarrativeObject', 'no-1', { size: 'large' }));
    check('a NarrativeObject size is dropped', !Object.hasOwn(object, 'size'));
    check('that NarrativeObject validates', valid(object));

    const context = omcMigrate(entity('Context', 'cxt-1', {
        contextType: 'shootDay', contextProperties: { shootDay: 1, shootDate: '2026-01-23' },
    }));
    check('contextProperties carry across unchanged',
        JSON.stringify(context.contextProperties) === JSON.stringify({ shootDay: 1, shootDate: '2026-01-23' }),
        JSON.stringify(context.contextProperties));

    const structure = omcMigrate(entity('AssetSC', 'asc-1', { structuralType: 'digital.movingImage' }));
    check('an image structuralType moves under digital.visual',
        structure.assetStructureType === 'digital.visual.movingImage', `got ${structure.assetStructureType}`);

    const originOf = ((Origin) => omcMigrate(entity('Asset', 'ast-1', {
        provenance: { Origin },
    })).edges?.has?.Provenance?.[0]);
    const combined = originOf({ identifier: [{ identifierScope: 'labkoat', identifierValue: 'ast-src', combinedForm: 'urn:labkoat:ast-src' }] });
    check('Origin becomes origin, the identifier\'s combinedForm',
        combined?.origin === 'urn:labkoat:ast-src' && !Object.hasOwn(combined, 'Origin'), JSON.stringify(combined));
    check('that Provenance validates', valid(combined));
    const joined = originOf({ identifier: [{ identifierScope: 'labkoat', identifierValue: 'ast-src' }] });
    check('Origin with no combinedForm joins scope and value', joined?.origin === 'labkoat:ast-src', `got ${joined?.origin}`);
}

// ---- a second pass changes nothing ----

{
    const again = omcMigrate(structuredClone(migrated));
    check('migrating the result again is a no-op', JSON.stringify(again) === JSON.stringify(migrated));
}

console.log(failures ? `\nomcMigrate: ${failures} FAILED` : '\nomcMigrate: OK');
if (failures) process.exit(1);
