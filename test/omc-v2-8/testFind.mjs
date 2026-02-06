import allCharacters from './examples/Europa/allCharacters.json' with { type: 'json' };

import { omcFind } from '../../index.mjs';

const res1 = omcFind(allCharacters, {
    characterName: { fullName: 'Augustus' },
});

const res2 = omcFind(allCharacters, {
    entityType: 'Depiction',
    depictionType: 'portrayal',
});

const res3 = omcFind(allCharacters, {
    identifier: {
        identifierScope: 'com.yamdu.app',
        identifierValue: 'com.yamdu.app.depictor.role.824366',
    },
});

console.log(res1);
