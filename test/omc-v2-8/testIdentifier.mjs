/**
 * Test the removal of identifiers from a set
 * @ignore
 */

import { omcIdentifier } from '../../index.mjs';

const targetIdentifier1 = {
    identifier: [
        {
            identifierScope: 'testScope1',
            identifierValue: 'value-1',
        },
        {
            identifierScope: 'testScope1',
            identifierValue: 'value-2',
        },
    ],
};

const removeIdentifier1 = {
    identifier: [
        {
            identifierScope: 'testScope2',
            identifierValue: 'value-2',
        },
    ],
};

const removeResult1 = omcIdentifier.hasMatching(targetIdentifier1, removeIdentifier1);

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

console.log(removeResult1);
console.log(removeResult2);
