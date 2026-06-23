/**
 * @typedef OmcGeneralConfig
 * @property {string} group - A broad grouping for the entity as it is used in the Ontology
 * @property {string} idPrefix - A shortened prefix that can be used with the identifierValue
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
        presentation: {
            entityColor: '#EBDEF0',
            entityLabel: 'Asset',
            entityLabelSuffix: (omc) => omc?.assetFC?.functionalType ? `: ${omc.assetFC.functionalType}` : '',
            header: {
                backgroundColor: '#EBDEF0',
                fontColor: '#000',
                entityLabel: 'Asset',
                entityLabelSuffix: (omc) => omc?.assetFC?.functionalType ? `: ${omc.assetFC.functionalType}` : '',
            },
            propRows: [
                'label',
                (e) => ({ functionalType: e.assetFC?.functionalType || 'N/A' }),
            ],
        },
    },
    AssetStructure: {
        group: 'Asset',
        idPrefix: 'asts',
        presentation: {
            entityColor: '#C39BD3',
            entityLabel: 'Asset Structure',
            entityLabelSuffix: () => '',
            header: {
                backgroundColor: '#C39BD3',
                fontColor: '#000',
                entityLabel: 'Asset Structure',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ structuralType: e.structuralType || 'N/A' }),
            ],
        },
    },
    Character: {
        group: 'Media Creation Context',
        idPrefix: 'chr',
        presentation: {
            entityColor: '#EAF2F8',
            entityLabel: 'Character',
            entityLabelSuffix: ((omc) => formatLabel(omc.characterType)),
            // icon: CharacterIcon,
            header: {
                backgroundColor: '#EAF2F8',
                fontColor: '#000',
                entityLabel: 'Character',
                entityLabelSuffix: ((omc) => formatLabel(omc.characterType)),
                // icon: CharacterIcon,
            },
            propRows: ['label', identifier],
        },
    },
    CreativeWork: {
        group: 'Media Creation Context',
        idPrefix: 'cw',
        presentation: {
            entityColor: '#FEF5E7',
            entityLabel: 'Creative Work',
            entityLabelSuffix: ((omc) => formatLabel(omc.creativeWorkType)),
            // icon: CreativeWorkIcon,
            header: {
                backgroundColor: '#FEF5E7',
                fontColor: '#000',
                entityLabel: 'Creative Work',
                entityLabelSuffix: ((omc) => formatLabel(omc.creativeWorkType)),
                // icon: CreativeWorkIcon,,
            },
            propRows: ['label', identifier],
        },
    },
    Context: {
        group: 'Media Creation Context',
        idPrefix: 'cxt',
        presentation: {
            entityColor: '#F5B041',
            entityLabel: 'Context',
            entityLabelSuffix: ((omc) => formatLabel(omc.contextType)),
            header: {
                backgroundColor: '#F5B041',
                fontColor: '#000',
                entityLabel: 'Context',
                entityLabelSuffix: ((omc) => formatLabel(omc.contextType)),
            },
            propRows: ['label', 'contextType', 'contextCategory'],
        },
    },
    Depiction: {
        group: 'Media Creation Context',
        idPrefix: 'dep',
        presentation: {
            entityColor: '#FAD7A0',
            entityLabel: 'Depiction',
            entityLabelSuffix: ((omc) => formatLabel(omc.depictionType)),
            // icon: DepictionIcon,
            header: {
                backgroundColor: '#FAD7A0',
                fontColor: '#000',
                entityLabel: 'Depiction',
                entityLabelSuffix: ((omc) => formatLabel(omc.depictionType)),
                // icon: DepictionIcon,
            },
            propRows: ['label', 'depictionType'],
        },
    },
    Effect: {
        group: 'Media Creation Context',
        idPrefix: 'eff',
        presentation: {
            entityColor: '#E8F8F5',
            entityLabel: 'Effect',
            entityLabelSuffix: ((omc) => formatLabel(omc.effectType)),
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
        presentation: {
            entityColor: '#D4E6F1',
            entityLabel: 'Nar. Audio',
            entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
            // icon: AudioIcon,
            header: {
                backgroundColor: '#D4E6F1',
                fontColor: '#000',
                entityLabel: 'Nar. Audio',
                entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
                // icon: AudioIcon,
            },
            propRows: ['label', 'narrativeType'],
        },
    },
    NarrativeLocation: {
        group: 'Media Creation Context',
        idPrefix: 'nloc',
        presentation: {
            entityColor: '#A9CCE3',
            entityLabel: 'Nar. Location',
            entityLabelSuffix: () => '',
            // icon: LocationIcon,
            header: {
                backgroundColor: '#A9CCE3',
                fontColor: '#000',
                entityLabel: 'Nar. Location',
                entityLabelSuffix: () => '',
                // icon: LocationIcon,
            },
            propRows: ['label', 'narrativeType'],
        },
    },
    NarrativeObject: {
        group: 'Media Creation Context',
        idPrefix: 'nobj',
        presentation: {
            entityColor: '#7FB3D5',
            entityLabel: 'Nar. Object',
            entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
            header: {
                backgroundColor: '#7FB3D5',
                fontColor: '#000',
                entityLabel: 'Nar. Object',
                entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
            },
            propRows: ['label', 'narrativeType'],
        },
    },
    NarrativeScene: {
        group: 'Media Creation Context',
        idPrefix: 'nscn',
        presentation: {
            entityColor: '#A9CCE3',
            entityLabel: 'Nar. Scene',
            entityLabelSuffix: () => '',
            // icon: NarrativeSceneIcon,
            header: {
                backgroundColor: '#A9CCE3',
                fontColor: '#000',
                entityLabel: 'Nar. Scene',
                entityLabelSuffix: () => '',
                // icon: NarrativeSceneIcon,
            },
            propRows: [
                'label',
                (e) => ({ sceneName: e.sceneName?.fullName || 'N/A' }),
            ],
        },
    },
    NarrativeStyling: {
        group: 'Media Creation Context',
        idPrefix: 'nsty',
        presentation: {
            entityColor: '#5499C7',
            entityLabel: 'Nar. Styling',
            entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
            header: {
                backgroundColor: '#5499C7',
                fontColor: '#000',
                entityLabel: 'Nar. Styling',
                entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
            },
            propRows: ['label', 'narrativeType'],
        },
    },
    NarrativeWardrobe: {
        group: 'Media Creation Context',
        idPrefix: 'nwar',
        presentation: {
            entityColor: '#2980B9',
            entityLabel: 'Nar. Wardrobe',
            entityLabelSuffix: () => '',
            // icon: CostumeIcon,
            header: {
                backgroundColor: '#2980B9',
                fontColor: '#000',
                entityLabel: 'Nar. Wardrobe',
                entityLabelSuffix: () => '',
                // icon: CostumeIcon,
            },
            propRows: ['label', 'narrativeType'],
        },
    },
    ProductionScene: {
        group: 'Media Creation Context',
        idPrefix: 'pscn',
        presentation: {
            entityColor: '#7DCEA0',
            entityLabel: 'Prod. Scene',
            entityLabelSuffix: () => '',
            // icon: ProductionSceneIcon,
            header: {
                backgroundColor: '#7DCEA0',
                fontColor: '#000',
                entityLabel: 'Prod. Scene',
                entityLabelSuffix: () => '',
                // icon: ProductionSceneIcon,
            },
            propRows: ['label', identifier],
        },
    },
    ProductionLocation: {
        group: 'Media Creation Context',
        idPrefix: 'ploc',
        presentation: {
            entityColor: '#A9DFBF',
            entityLabel: 'Prod. Location',
            entityLabelSuffix: () => '',
            // icon: LocationIcon,
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
        presentation: {
            entityColor: '#FAD7A0',
            entityLabel: 'Realization',
            entityLabelSuffix: ((omc) => formatLabel(omc.realizationType)),
            // icon: DepictionIcon,
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
        presentation: {
            entityColor: '#52BE80',
            entityLabel: 'Slate',
            entityLabelSuffix: () => '',
            // icon: SlateIcon,
            header: {
                backgroundColor: '#52BE80',
                fontColor: '#000',
                entityLabel: 'Slate',
                entityLabelSuffix: () => '',
                // icon: SlateIcon,
            },
            propRows: ['label', identifier],
        },
    },
    SpecialAction: {
        group: 'Media Creation Context',
        idPrefix: 'sact',
        presentation: {
            entityColor: '#A3E4D7',
            entityLabel: 'Special Action',
            entityLabelSuffix: ((omc) => formatLabel(omc.specialActionType)),
            header: {
                backgroundColor: '#A3E4D7',
                fontColor: '#000',
                entityLabel: 'Special Action',
                entityLabelSuffix: ((omc) => formatLabel(omc.specialActionType)),
            },
            propRows: [
                'label',
            ],
        },
    },
    Participant: {
        group: 'Participant',
        idPrefix: 'prt',
        presentation: {
            entityColor: '#F9EBEA',
            entityLabel: 'Participant',
            entityLabelSuffix: () => '',
            header: {
                backgroundColor: '#F9EBEA',
                fontColor: '#000',
                entityLabel: 'Participant',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ jobTitle: e.participantFC?.jobTitle || 'N/A' }),
            ],
        },
    },
    ParticipantStructure: {
        group: 'Participant',
        idPrefix: 'prts',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Participant Structure',
            entityLabelSuffix: () => '',
            // icon: PersonIcon,
            header: {
                backgroundColor: '#E6B0AA',
                fontColor: '#000',
                entityLabel: 'Participant Structure',
                entityLabelSuffix: () => '',
                // icon: PersonIcon,
            },
            propRows: ['label', identifier],
        },
    },
    Person: {
        group: 'Participant',
        idPrefix: 'per',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Person',
            entityLabelSuffix: () => '',
            // icon: PersonIcon,
            header: {
                backgroundColor: '#E6B0AA',
                fontColor: '#000',
                entityLabel: 'Person',
                entityLabelSuffix: () => '',
                // icon: PersonIcon,
            },
            propRows: ['label', identifier],
        },
    },
    Organization: {
        group: 'Participant',
        idPrefix: 'org',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Organization',
            entityLabelSuffix: () => '',
            // icon: OrganizationIcon,
            header: {
                backgroundColor: '#E6B0AA',
                fontColor: '#000',
                entityLabel: 'Organization',
                entityLabelSuffix: () => '',
                // icon: OrganizationIcon,
            },
            propRows: ['label', identifier],
        },
    },
    Department: {
        group: 'Participant',
        idPrefix: 'dpt',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Department',
            entityLabelSuffix: () => '',
            header: {
                backgroundColor: '#E6B0AA',
                fontColor: '#000',
                entityLabel: 'Department',
                entityLabelSuffix: () => '',
            },
            propRows: ['label', identifier],
        },
    },
    Service: {
        group: 'Participant',
        idPrefix: 'srvc',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Service',
            entityLabelSuffix: () => '',
            // icon: ServiceIcon,
            header: {
                backgroundColor: '#E6B0AA',
                fontColor: '#000',
                entityLabel: 'Service',
                entityLabelSuffix: () => '',
                // icon: ServiceIcon,
            },
            propRows: ['label', identifier],
        },
    },
    Role: {
        group: 'Participant',
        idPrefix: 'rol',
        presentation: {
            entityColor: '#CD6155',
            entityLabel: 'Role',
            entityLabelSuffix: () => '',
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
        presentation: {
            entityColor: '#F5CBA7',
            entityLabel: 'Infrastructure',
            entityLabelSuffix: () => '',
            header: {
                backgroundColor: '#F5CBA7',
                fontColor: '#000',
                entityLabel: 'Infrastructure',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ functionalType: e.infrastructureFC?.functionalType || 'N/A' }),
            ],
        },
    },
    InfrastructureStructure: {
        group: 'Infrastructure',
        idPrefix: 'infs',
        presentation: {
            entityColor: '#F0B27A',
            entityLabel: 'Infrastructure Structure',
            entityLabelSuffix: () => '',
            header: {
                backgroundColor: '#F0B27A',
                fontColor: '#000',
                entityLabel: 'Infrastructure Structure',
                entityLabelSuffix: () => '',
            },
            propRows: [
                'label',
                (e) => ({ structuralType: e?.structuralType || 'N/A' }),
            ],
        },
    },
    Task: {
        group: 'Task',
        idPrefix: 'tsk',
        presentation: {
            entityColor: '#fcf3cf',
            entityLabel: 'Task',
            entityLabelSuffix: () => '',
            header: {
                backgroundColor: '#fcf3cf',
                fontColor: '#000',
                entityLabel: 'Task',
                entityLabelSuffix: () => '',
            },
            propRows: ['label', identifier],
        },
    },
    TaskStructure: {
        group: 'Task',
        idPrefix: 'tsks',
        presentation: {
            entityColor: '#f7dc6f',
            entityLabel: 'Task Structure',
            entityLabelSuffix: () => '',
            header: {
                backgroundColor: '#f7dc6f',
                fontColor: '#000',
                entityLabel: 'Task Structure',
                entityLabelSuffix: () => '',
            },
            propRows: ['label', identifier],
        },
    },
    Collection: {
        group: 'Utility',
        idPrefix: 'col',
        presentation: {
            entityColor: '#D7DBDD',
            entityLabel: 'Collection',
            entityLabelSuffix: () => '',
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
        presentation: {
            entityColor: '#BDC3C7',
            entityLabel: 'Composition',
            entityLabelSuffix: () => '',
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
        presentation: {
            entityColor: '#AEB6BF',
            entityLabel: 'Location',
            entityLabelSuffix: () => '',
            // icon: LocationIcon,
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
        presentation: {
            entityColor: '#BDC3C7',
            entityLabel: 'Provenance',
            entityLabelSuffix: () => '',
            // icon: LocationIcon,
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
