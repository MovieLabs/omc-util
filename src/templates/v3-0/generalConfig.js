/**
 * @typedef OmcGeneralConfig
 * @property {string} group - A broad grouping for the entity as it is used in the Ontology
 * @property {string} idPrefix - A shortened prefix that can be used with the identifierValue
 * @property {string[]} [mergeKey] - Property path(s) whose value(s) can be treated as unique
 *   within a project, so they can substitute for an identifier when combining data from multiple
 *   sources into one canonical instance (matching an existing entity, or deterministically minting
 *   an id). An ordered composite key; omit or leave empty when the entity type has no merge key.
 * @property {Object} presentation - Presentation configuration for UI's
 * @property {string} presnetation.color - A color for representing the entity in UI's and charts
 * @property {string} presentation.entityLabel - A entityLabel when displaying the entity in UI's and charts
 * @property {function} presentation.entityLabelSuffix - A function for displaying a suffix to the entityLabel based on an instance
 */

const formatLabel = ((val) => {
    if (!val) return '';
    const cleanVal = val.replace('narrative', '')
        .split(/(?=[A-Z])/)
        .join('-');
    return `: ${cleanVal}`;
});

const identifier = (e) => ({ identifier: `${e.identifier[0].identifierScope}:${e.identifier[0].identifierValue}` });

/**
 * @type OmcGeneralConfig
 */
export const generalConfig = {
    Asset: {
        group: 'Asset',
        idPrefix: 'ast',
        mergeKey: ['assetName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#EBDEF0',
                fontColor: '#000',
                entityLabel: 'Asset',
                entityLabelSuffix: (omc) => omc?.assetFunction?.functionType ? `: ${omc.assetFunction.functionType}` : '',
            },
            propRows: [
                'label',
                (e) => ({ functionType: e.assetFunction?.assetFunctionType || 'N/A' }),
            ],
        },
    },
    AssetStructure: {
        group: 'Asset',
        idPrefix: 'asts',
        mergeKey: ['assetStructureName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#C39BD3',
                fontColor: '#000',
                entityLabel: 'Asset Structure',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ structureType: e.assetStructureType || 'N/A' }),
            ],
        },
    },
    Character: {
        group: 'Media Creation Context',
        idPrefix: 'chr',
        mergeKey: ['characterName.scriptName'],
        presentation: {
            header: {
                backgroundColor: '#EAF2F8',
                fontColor: '#000',
                entityLabel: 'Character',
                entityLabelSuffix: ((omc) => formatLabel(omc.characterType)),
                // icon: CharacterIcon,
            },
            propRows: ['label', 'characterType'],
        },
    },
    CreativeWork: {
        group: 'Media Creation Context',
        idPrefix: 'cw',
        mergeKey: ['creativeWorkName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#FEF5E7',
                fontColor: '#000',
                entityLabel: 'Creative Work',
                entityLabelSuffix: ((omc) => formatLabel(omc.creativeWorkType)),
                // icon: CreativeWorkIcon,,
            },
            propRows: ['label', 'creativeWorkType'],
        },
    },
    Context: {
        group: 'Media Creation Context',
        idPrefix: 'cxt',
        mergeKey: ['contextName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#F5B041',
                fontColor: '#000',
                entityLabel: 'Context',
                entityLabelSuffix: ((omc) => formatLabel(omc.contextType)),
            },
            propRows: ['label', 'contextType', 'contextCategory'],
        },
    },
    Effect: {
        group: 'Media Creation Context',
        idPrefix: 'eff',
        mergeKey: ['effectName.scriptName'],
        presentation: {
            header: {
                backgroundColor: '#E8F8F5',
                fontColor: '#000',
                entityLabel: 'Effect',
                entityLabelSuffix: ((omc) => formatLabel(omc.effectType)),
            },
            propRows: ['label', 'effectType'],
        },
    },
    NarrativeAudio: {
        group: 'Media Creation Context',
        idPrefix: 'naud',
        mergeKey: ['narrativeAudioName.scriptName'],
        presentation: {
            header: {
                backgroundColor: '#D4E6F1',
                fontColor: '#000',
                entityLabel: 'Nar. Audio',
                entityLabelSuffix: ((omc) => formatLabel(omc.narrativeAudioType)),
                // icon: AudioIcon,
            },
            propRows: ['label', 'narrativeAudioType'],
        },
    },
    NarrativeLocation: {
        group: 'Media Creation Context',
        idPrefix: 'nloc',
        mergeKey: ['narrativeLocationName.scriptName'],
        presentation: {
            header: {
                backgroundColor: '#A9CCE3',
                fontColor: '#000',
                entityLabel: 'Nar. Location',
                entityLabelSuffix: () => '',
                // icon: LocationIcon,
            },
            propRows: ['label', 'narrativeLocationType'],
        },
    },
    NarrativeObject: {
        group: 'Media Creation Context',
        idPrefix: 'nobj',
        mergeKey: ['narrativeObjectName.scriptName'],
        presentation: {
            header: {
                backgroundColor: '#7FB3D5',
                fontColor: '#000',
                entityLabel: 'Nar. Object',
                entityLabelSuffix: ((omc) => formatLabel(omc.narrativeObjectType)),
            },
            propRows: ['label', 'narrativeObjectType'],
        },
    },
    NarrativeScene: {
        group: 'Media Creation Context',
        idPrefix: 'nscn',
        mergeKey: ['sceneNumber'],
        presentation: {
            header: {
                backgroundColor: '#A9CCE3',
                fontColor: '#000',
                entityLabel: 'Nar. Scene',
                entityLabelSuffix: () => '',
                // icon: NarrativeSceneIcon,
            },
            propRows: [
                'label',
                (e) => ({ fullName: e.narrativeSceneName?.fullName || 'N/A' }),
                (e) => ({ sceneNumber: e.sceneNumber || 'N/A' }),
            ],
        },
    },
    NarrativeStyling: {
        group: 'Media Creation Context',
        idPrefix: 'nsty',
        mergeKey: ['narrativeStylingName.scriptName'],
        presentation: {
            header: {
                backgroundColor: '#5499C7',
                fontColor: '#000',
                entityLabel: 'Nar. Styling',
                entityLabelSuffix: ((omc) => formatLabel(omc.narrativeStylingType)),
            },
            propRows: ['label', 'narrativeStylingType'],
        },
    },
    NarrativeWardrobe: {
        group: 'Media Creation Context',
        idPrefix: 'nwar',
        mergeKey: ['narrativeWardrobeName.scriptName'],
        presentation: {
            header: {
                backgroundColor: '#2980B9',
                fontColor: '#000',
                entityLabel: 'Nar. Wardrobe',
                entityLabelSuffix: () => '',
                // icon: CostumeIcon,
            },
            propRows: ['label', 'narrativeWardrobeType'],
        },
    },
    ProductionScene: {
        group: 'Media Creation Context',
        idPrefix: 'pscn',
        mergeKey: ['sceneNumber'],
        presentation: {
            header: {
                backgroundColor: '#7DCEA0',
                fontColor: '#000',
                entityLabel: 'Prod. Scene',
                entityLabelSuffix: () => '',
                // icon: ProductionSceneIcon,
            },
            propRows: [
                'label',
                (e) => ({ fullName: e.productionSceneName?.fullName || 'N/A' }),
                (e) => ({ sceneNumber: e.sceneNumber || 'N/A' }),
            ],
        },
    },
    ProductionLocation: {
        group: 'Media Creation Context',
        idPrefix: 'ploc',
        mergeKey: ['productionLocationName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#A9DFBF',
                fontColor: '#000',
                entityLabel: 'Prod. Location',
                entityLabelSuffix: () => '',
                // icon: LocationIcon,
            },
            propRows: ['label', identifier],
        },
    },
    Realization: {
        group: 'Media Creation Context',
        idPrefix: 'rel',
        mergeKey: ['realizationName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#FAD7A0',
                fontColor: '#000',
                entityLabel: 'Realization',
                entityLabelSuffix: ((omc) => formatLabel(omc.realizationType)),
                // icon: DepictionIcon,
            },
            propRows: ['label', 'realizationType'],
        },
    },
    Slate: {
        group: 'Media Creation Context',
        idPrefix: 'slt',
        mergeKey: ['slateName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#52BE80',
                fontColor: '#000',
                entityLabel: 'Slate',
                entityLabelSuffix: () => '',
                // icon: SlateIcon,
            },
            propRows: [
                'label',
                (e) => ({ fullName: e?.slateName?.fullName || 'N/A' }),
            ],
        },
    },
    SpecialAction: {
        group: 'Media Creation Context',
        idPrefix: 'sact',
        mergeKey: ['specialActionName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#A3E4D7',
                fontColor: '#000',
                entityLabel: 'Special Action',
                entityLabelSuffix: ((omc) => formatLabel(omc.specialActionType)),
            },
            propRows: [
                'label', 'specialActionTyoe',
            ],
        },
    },
    Participant: {
        group: 'Participant',
        idPrefix: 'prt',
        mergeKey: ['participantName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#F9EBEA',
                fontColor: '#000',
                entityLabel: 'Participant',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ functionType: e?.participantFunction?.participantFunctionType || 'N/A' }),
            ],
        },
    },
    ParticipantStructure: {
        group: 'Participant',
        idPrefix: 'prts',
        mergeKey: ['participantName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#E6B0AA',
                fontColor: '#000',
                entityLabel: 'Participant Structure',
                entityLabelSuffix: () => '',
                // icon: PersonIcon,
            },
            propRows: [
                'label',
                (e) => ({ structureType: e?.participantStructureType || 'N/A' }),
            ],
        },
    },
    Role: {
        group: 'Participant',
        idPrefix: 'rol',
        mergeKey: ['roleName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#CD6155',
                fontColor: '#000',
                entityLabel: 'Role',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ roleType: e.roleType || 'N/A' }),
            ],
        },
    },
    Infrastructure: {
        group: 'Infrastructure',
        idPrefix: 'inf',
        mergeKey: ['infrastructureName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#F5CBA7',
                fontColor: '#000',
                entityLabel: 'Infrastructure',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ functionType: e.infrastructureFunction?.infrastructureFunctionType || 'N/A' }),
            ],
        },
    },
    InfrastructureStructure: {
        group: 'Infrastructure',
        idPrefix: 'infs',
        mergeKey: ['infrastructureStructureName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#F0B27A',
                fontColor: '#000',
                entityLabel: 'Infrastructure Structure',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ structureType: e?.infrastructureStructureType || 'N/A' }),
            ],
        },
    },
    Task: {
        group: 'Task',
        idPrefix: 'tsk',
        mergeKey: ['taskName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#fcf3cf',
                fontColor: '#000',
                entityLabel: 'Task',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ functionType: e.taskFunction?.taskFunctionType || 'N/A' }),
            ],
        },
    },
    TaskStructure: {
        group: 'Task',
        idPrefix: 'tsks',
        mergeKey: ['taskStructureName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#f7dc6f',
                fontColor: '#000',
                entityLabel: 'Task Structure',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ structureType: e?.taskStructureType || 'N/A' }),
            ],
        },
    },
    Collection: {
        group: 'Utility',
        idPrefix: 'col',
        mergeKey: ['collectionName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#D7DBDD',
                fontColor: '#000',
                entityLabel: 'Collection',
                entityLabelSuffix: () => '',
            },
            propRows: ['label', 'collectionType'],
        },
    },
    Composition: {
        group: 'Utility',
        idPrefix: 'cmp',
        mergeKey: ['compositionName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#BDC3C7',
                fontColor: '#000',
                entityLabel: 'Composition',
                entityLabelSuffix: () => '',
            },
            propRows: ['label', 'compositionType'],
        },
    },
    Location: {
        group: 'Utility',
        idPrefix: 'loc',
        mergeKey: ['locationName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#AEB6BF',
                fontColor: '#000',
                entityLabel: 'Location',
                entityLabelSuffix: () => '',
                // icon: LocationIcon,
            },
            propRows: ['label', identifier],
        },
    },
    Provenance: {
        group: 'Utility',
        idPrefix: 'prv',
        mergeKey: ['provenanceName.fullName'],
        presentation: {
            header: {
                backgroundColor: '#BDC3C7',
                fontColor: '#000',
                entityLabel: 'Provenance',
                entityLabelSuffix: () => '',
                // icon: LocationIcon,
            },
            propRows: ['label', identifier],
        },
    },
};
