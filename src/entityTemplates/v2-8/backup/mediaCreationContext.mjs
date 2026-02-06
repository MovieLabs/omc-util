import { basicName, completeName, note } from './utility.mjs';

export const Character = {
    properties: {
        characterType: null,
        characterName: completeName,
        Context: null,
        Depiction: null,
    },
};

// The relationship properties should be added as part of custom query in the query builder
export const Context = {
    properties: {
        contextType: ['string'],
        contextCategory: ['string'],
        contextProperties: null,
    },
    ForEntity: null,
    Context: null,
};

export const CreativeWork = {
    properties: {
        creativeWorkType: null,
        creativeWorkCategory: null,
        seasonNumber: null,
        episodeSequence: {
            houseSequence: null,
            distributionNumber: {
                value: null,
                domain: null,
            },
        },
        creativeWorkTitle: {
            titleName: null,
            titleType: null,
            titleLanguage: null,
        },
        approximateLength: null,
        originalLanguage: null,
        countryOfOrigin: null,
        Context: null,
        Series: null,
        Episode: null,
        ProductionCompany: null,
    },
};

export const Depiction = {
    properties: {
        depictionType: 'string',
        Depicts: null,
        Depicter: null,
        Context: null,
    },
    inlineFragment: {
        Depicts: {
            Character: '...on',
            NarrativeLocation: '...on',
            NarrativeObject: '...on',
            NarrativeStyling: '...on',
            NarrativeWardrobe: '...on',
        },
        Depicter: {
            Participant: '...on',
            Asset: '...on',
        },
    },
};

export const Effect = {
    properties: {
        effectType: null,
        Context: null,
    },
};

export const NarrativeAudio = {
    properties: {
        narrativeType: 'string',
        Context: null,
        Depiction: null,
    },
};

export const NarrativeLocation = {
    properties: {
        narrativeType: 'string',
        Context: null,
        Depiction: null,
    },
};

export const NarrativeObject = {
    properties: {
        narrativeType: 'string',
        quantity: null,
        size: null,
        Context: null,
        Depiction: null,
    },
};

export const NarrativeScene = {
    properties: {
        sceneName: basicName,
        sceneNumber: 'string',
        slugline: note,
        Context: null,
    },
};

export const NarrativeStyling = {
    properties: {
        narrativeType: 'string',
        Context: null,
    },
};

export const NarrativeWardrobe = {
    properties: {
        narrativeType: 'string',
        Context: null,
    },
};

export const ProductionLocation = {
    properties: {
        locationType: 'string',
        Context: null,
        Location: null,
    },
};

export const ProductionScene = {
    properties: {
        sceneName: basicName,
        sceneHeader: null,
        sceneDescriptor: null,
        sceneNumber: null,
    },
};

export const Slate = {
    properties: {
        slateUID: ['String'],
        cameraLabel: null,
        cameraUnit: null,
        cameraRoll: null,
        soundRoll: null,
        shootDate: null,
        shootDay: null,
        recordingFPS: null,
        Context: null,
        CreativeWork: null,
        Director: null,
    },
};

export const SpecialAction = {
    properties: {
        specialActionType: 'string',
        Context: null,
    },
};
