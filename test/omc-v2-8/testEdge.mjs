import { omcEdges } from '../../index.mjs';

const testEnt1 = {
    schemaVersion: 'https://movielabs.com/omc/json/schema/v2.6',
    entityType: 'Character',
    identifier: [
        {
            identifierScope: 'com.yamdu.app',
            identifierValue: 'com.yamdu.app.role.824366',
        },
    ],
    characterName: {
        fullName: 'Augustus',
    },
    profile: {
        background: {
            dislikes: null,
            habits: null,
            likes: null,
            traits: null,
        },
        gender: null,
        physicalCharacteristics: {
            eyeColor: null,
            hairColor: null,
            hairLength: null,
            height: null,
            species: null,
            weight: null,
        },
    },
    description: 'Augustus is a determined and pragmatic man in his late 40s, with a strong sense of duty and leadership. As an experienced American astronaut, he is focused on the mission at hand, often prioritizing the objectives over personal feelings. Augustus is methodical, disciplined, and possesses a no-nonsense attitude, which sometimes makes him appear stern or unyielding. He has a deep respect for the pioneering nature of space exploration and is driven by a desire to make history. Despite his tough exterior, Augustus is not immune to the awe of the unknown, and moments of vulnerability reveal his underlying recognition of the enormity of their task. He is a character who embodies the spirit of exploration, tempered by the weight of responsibility, and while he may clash with others over the approach, his commitment to the mission and the survival of his crew is unwavering.',
    Depiction: {
        identifier: [
            {
                identifierScope: 'com.yamdu.app',
                identifierValue: 'com.yamdu.app.depictor.role.824366',
            },
        ],
    },
    Context: [
        {
            identifier: [
                {
                    identifierScope: 'com.yamdu.app',
                    identifierValue: 'com.yamdu.app.role.context.824366',
                },
            ],
        },
        {
            identifier: [
                {
                    identifierScope: 'com.yamdu.app',
                    identifierValue: 'com.yamdu.app.role.context.824367',
                },
            ],
        },
    ],
};

const testRemove1 = [
    {
        identifierScope: 'com.yamdu.app',
        identifierValue: 'com.yamdu.app.role.context.824367',
    },
];

const edgeRemovalRes1 = omcEdges.removeEdge(testEnt1, testRemove1);

const testEnt2 = {
    schemaVersion: 'https://movielabs.com/omc/json/schema/v2.6',
    entityType: 'Context',
    identifier: [
        {
            identifierScope: 'com.yamdu.app',
            identifierValue: 'com.yamdu.app.role.context.824369',
        },
    ],
    needs: [],
    has: null,
    featuresIn: {
        NarrativeScene: [
            {
                identifier: [
                    {
                        identifierScope: 'com.yamdu.app',
                        identifierValue: 'com.yamdu.app.scene.2475847',
                    },
                ],
            },
            {
                identifier: [
                    {
                        identifierScope: 'com.yamdu.app',
                        identifierValue: 'com.yamdu.app.scene.2475855',
                    },
                ],
            },
            {
                identifier: [
                    {
                        identifierScope: 'com.yamdu.app',
                        identifierValue: 'com.yamdu.app.scene.2486589',
                    },
                ],
            },
            {
                identifier: [
                    {
                        identifierScope: 'com.yamdu.app',
                        identifierValue: 'com.yamdu.app.scene.2553062',
                    },
                ],
            },
            {
                identifier: [
                    {
                        identifierScope: 'com.yamdu.app',
                        identifierValue: 'com.yamdu.app.scene.2553063',
                    },
                ],
            },
        ],
    },
};

const testRemove2 = {
    entityType: 'Character',
    identifier: [
        {
            identifierScope: 'com.yamdu.app',
            identifierValue: 'com.yamdu.app.scene.2553063',
        },
    ],
};

const edgeRemovalRes2 = omcEdges.removeEdge(testEnt2, testRemove2);

console.log(edgeRemovalRes1);
console.log(edgeRemovalRes2);

const edgeValid1 = omcEdges.edgeValid('Collection', 'Asset');
const edgeValid2 = omcEdges.edgeValid('Character', 'NarrativeScene'); // null
const edgeValid3 = omcEdges.edgeValid('Composition', 'Asset');
const edgeValid4 = omcEdges.edgeValid('Character', 'Depiction');

console.log('Edge valid 1', edgeValid1);
console.log('Edge valid 2', edgeValid2);
console.log('Edge valid 3', edgeValid3);
console.log('Edge valid 4', edgeValid4);

const allowed1 = omcEdges.intrinsicAllowed('Character');
const allowed2 = omcEdges.intrinsicAllowed('AssetSC');

console.log(allowed1);
console.log(allowed2);
