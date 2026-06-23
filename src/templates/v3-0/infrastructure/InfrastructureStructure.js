/**
 * Template details for InfrastructureSC
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'InfrastructureStructure';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        infrastructureStructureName: basicName.template,
        infrastructureStructureType: null,
        infrastructureStructureProperties: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            infrastructureStructureType: null,
            infrastructureStructureName: basicName.graphQl.properties,
            infrastructureStructureProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            infrastructureStructureName: basicName.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'infs',
};
