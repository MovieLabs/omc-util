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
        },
    },
    AssetSC: {
        group: 'Asset',
        idPrefix: 'astsc',
        presentation: {
            entityColor: '#C39BD3',
            entityLabel: 'Asset SC',
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
        },
    },
    Context: {
        group: 'Media Creation Context',
        idPrefix: 'cxt',
        presentation: {
            entityColor: '#F5B041',
            entityLabel: 'Context',
            entityLabelSuffix: ((omc) => formatLabel(omc.contextType)),
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
        },
    },
    Effect: {
        group: 'Media Creation Context',
        idPrefix: 'eff',
        presentation: {
            entityColor: '#E8F8F5',
            entityLabel: 'Effect',
            entityLabelSuffix: ((omc) => formatLabel(omc.effectType)),
        },
    },
    NarrativeAudio: {
        group: 'Media Creation Context',
        idPrefix: 'naud',
        presentation: {
            entityColor: '#D4E6F1',
            entityLabel: 'Narrative Audio',
            entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
            // icon: AudioIcon,
        },
    },
    NarrativeLocation: {
        group: 'Media Creation Context',
        idPrefix: 'nloc',
        presentation: {
            entityColor: '#A9CCE3',
            entityLabel: 'Narrative Location',
            // icon: LocationIcon,
        },
    },
    NarrativeObject: {
        group: 'Media Creation Context',
        idPrefix: 'nobj',
        presentation: {
            entityColor: '#7FB3D5',
            entityLabel: 'Narrative Object',
            entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
        },
    },
    NarrativeScene: {
        group: 'Media Creation Context',
        idPrefix: 'nscn',
        presentation: {
            entityColor: '#A9CCE3',
            entityLabel: 'Narrative Scene',
            // icon: NarrativeSceneIcon,
        },
    },
    NarrativeStyling: {
        group: 'Media Creation Context',
        idPrefix: 'nsty',
        presentation: {
            entityColor: '#5499C7',
            entityLabel: 'Narrative Styling',
            entityLabelSuffix: ((omc) => formatLabel(omc.narrativeType)),
        },
    },
    NarrativeWardrobe: {
        group: 'Media Creation Context',
        idPrefix: 'nwar',
        presentation: {
            entityColor: '#2980B9',
            entityLabel: 'Narrative Wardrobe',
            // icon: CostumeIcon,
        },
    },
    ProductionScene: {
        group: 'Media Creation Context',
        idPrefix: 'pscn',
        presentation: {
            entityColor: '#7DCEA0',
            entityLabel: 'Production Scene',
            // icon: ProductionSceneIcon,
        },
    },
    ProductionLocation: {
        group: 'Media Creation Context',
        idPrefix: 'ploc',
        presentation: {
            entityColor: '#A9DFBF',
            entityLabel: 'Production Location',
            // icon: LocationIcon,
        },
    },
    Slate: {
        group: 'Media Creation Context',
        idPrefix: 'slt',
        presentation: {
            entityColor: '#52BE80',
            entityLabel: 'Slate',
            // icon: SlateIcon,
        },
    },
    SpecialAction: {
        group: 'Media Creation Context',
        idPrefix: 'sact',
        presentation: {
            entityColor: '#A3E4D7',
            entityLabel: 'Special Action',
            entityLabelSuffix: ((omc) => formatLabel(omc.specialActionType)),
        },
    },
    Participant: {
        group: 'Participant',
        idPrefix: 'prpt',
        presentation: {
            entityColor: '#F9EBEA',
            entityLabel: 'Participant',
        },
    },
    Person: {
        group: 'Participant',
        idPrefix: 'per',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Person',
            // icon: PersonIcon,
        },
    },
    Organization: {
        group: 'Participant',
        idPrefix: 'org',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Organization',
            // icon: OrganizationIcon,
        },
    },
    Department: {
        group: 'Participant',
        idPrefix: 'dpt',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Department',
        },
    },
    Service: {
        group: 'Participant',
        idPrefix: 'srvc',
        presentation: {
            entityColor: '#E6B0AA',
            entityLabel: 'Service',
            // icon: ServiceIcon,
        },
    },
    Role: {
        group: 'Participant',
        idPrefix: 'rol',
        presentation: {
            entityColor: '#CD6155',
            entityLabel: 'Role',
        },
    },
    Infrastructure: {
        group: 'Infrastructure',
        idPrefix: 'inf',
        presentation: {
            entityColor: '#F5CBA7',
            entityLabel: 'Infrastructure',
        },
    },
    InfrastructureSC: {
        group: 'InfrastructureSC',
        idPrefix: 'inf',
        presentation: {
            entityColor: '#F0B27A',
            entityLabel: 'InfrastructureSC',
        },
    },
    Task: {
        group: 'Task',
        idPrefix: 'tsk',
        presentation: {

        },
    },
    Collection: {
        group: 'Utility',
        idPrefix: 'col',
        presentation: {
            entityColor: '#D7DBDD',
            entityLabel: 'Collection',
        },
    },
    Composition: {
        group: 'Utility',
        idPrefix: 'cmp',
        presentation: {
            entityColor: '#BDC3C7',
            entityLabel: 'Composition',
        },
    },
    Location: {
        group: 'Utility',
        idPrefix: 'loc',
        presentation: {
            entityColor: '#AEB6BF',
            entityLabel: 'Location',
            // icon: LocationIcon,
        },
    },
};
