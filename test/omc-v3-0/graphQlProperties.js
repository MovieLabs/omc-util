/**
 * Guard: the v3.0 graphQl templates ask only for properties the v3.0 schema has.
 *
 * A query's answer is saved back whole, so a property the schema does not define fails validation
 * on save even when fMam answers it with null. Fields fMam keeps for older schema versions belong
 * in its own GraphQL schema, marked deprecated, and in the templates of those versions only.
 *
 * Each top-level data property of each template is added, null as fMam answers an empty one, to the
 * smallest valid entity of its type, and the validator says whether it recognises it. One at a time
 * and on a valid entity because any other failure, such as a missing required property, stops the
 * validator before it reports unknown properties. Nested properties and relationships are not
 * checked here; relationships are test:graphqledges' concern.
 *
 *   Usage: node test/omc-v3-0/graphQlProperties.js
 */

import { omcTemplate, omcValidate } from '../../index.js';
import { isCapitalized } from '../../src/mlHelpers/util.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

/** The validator's errors for one entity, empty when it is valid. */
const errorsFor = ((entity) => {
    const [result] = omcValidate([entity], { atomic: false });
    return result.valid ? [] : result.error;
});

/** The properties the validator does not recognise on `entity`. */
const unknownKeys = ((entity) => errorsFor(entity)
    .filter((err) => err.keyword === 'unevaluatedProperties' || err.keyword === 'additionalProperties')
    .map((err) => err.params.unevaluatedProperty || err.params.additionalProperty));

/** A value of the first JSON type named, for a property the validator says needs one. */
const valueOfType = ((type) => ({
    string: 'x', boolean: true, number: 1, integer: 1, array: [], object: {}, null: null,
}[[type].flat()[0]]));

/**
 * The smallest valid entity of a type: required properties are filled in, following the
 * validator's own corrections, until it passes. Null when it cannot be made to.
 */
const validMinimal = ((entityType) => {
    const entity = { schemaVersion, entityType, identifier: [{ identifierScope: 'test', identifierValue: 'test-1' }] };
    for (let step = 0; step < 20; step += 1) {
        const errors = errorsFor(entity);
        if (!errors.length) return entity;
        const fix = errors.find((err) => err.keyword === 'required' && err.instancePath === '/0')
            || errors.find((err) => ['enum', 'type'].includes(err.keyword) && /^\/0\/[^/]+$/.test(err.instancePath));
        if (!fix) return null;
        if (fix.keyword === 'required') entity[fix.params.missingProperty] = 'x';
        else {
            const key = fix.instancePath.split('/')[2];
            entity[key] = fix.keyword === 'enum' ? fix.params.allowedValues[0] : valueOfType(fix.params.type);
        }
    }
    return null;
});

const findings = omcTemplate.graphQlEntities({ schemaVersion }).flatMap((entityType) => {
    const { properties } = omcTemplate.graphQl({ entityType, schemaVersion });
    const minimal = validMinimal(entityType);
    if (!minimal) return [`${entityType}: no valid minimal entity could be built, so nothing was checked`];
    return Object.keys(properties)
        .filter((key) => !isCapitalized(key) && key !== 'edges' && !Object.hasOwn(minimal, key))
        .filter((key) => unknownKeys({ ...minimal, [key]: null }).includes(key))
        .map((key) => `${entityType} ${key}`);
});

const unique = [...new Set(findings)];
unique.forEach((finding) => console.error(`  ✗ not in the v3.0 schema: ${finding}`));
if (unique.length) {
    console.error(`\n${unique.length} failed`);
    process.exit(1);
}
console.log('graphQlProperties: all passed');
