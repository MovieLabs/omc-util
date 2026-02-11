/**
 * Test the removal of identifiers from a set
 * @ignore
 */

import { omcIdentifier } from '../../index.mjs';

const testIdentifier1 = [
    {
        identifierScope: 'testScope1',
        identifierValue: 'value-1',
    },
    {
        identifierScope: 'testScope1',
        identifierValue: 'value-2',
        url: 'test-1',
    },
];

const testIdentifier2 = [
    {
        identifierScope: 'testScope1',
        identifierValue: 'value-2',
        url: 'testUrl',
    },
];

const testIdentifier3 = [
    {
        identifierScope: 'testScope3',
        identifierValue: 'value-1',
    },
];

// testIdentifier1 / testIdentifier2 - true
const isDuplicateResult1 = omcIdentifier.idIsDuplicate(testIdentifier1, testIdentifier2[0]);

// testIdentifier1 / testIdentifier2 - false
const isDuplicateResult2 = omcIdentifier.idIsDuplicate(testIdentifier1, testIdentifier3[0]);

const mergedSet1 = omcIdentifier.idMerge(testIdentifier1, testIdentifier2);

const mergedSet2 = omcIdentifier.idMerge(testIdentifier1, testIdentifier3);

const targetIdentifier2 = [
    {
        identifierScope: 'testScope1',
        identifierValue: 'value-1',
        url: 'http://',
    },
    {
        identifierScope: 'testScope1',
        identifierValue: 'value-2',
    },
];

const removeIdentifier2 = [
    {
        identifierScope: 'testScope1',
        identifierValue: 'value-3',
    },
];

const removeResult2 = omcIdentifier.hasMatching(targetIdentifier2, removeIdentifier2);

console.log(removeResult2);
