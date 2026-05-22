/**
 * Template details for InfrastructureSC
 */

import { generalConfig } from '../generalConfig.js';
import { baseEntity, basicName } from '../utility/utility.js';

const entityType = 'InfrastructureSC';
const entityGeneral = generalConfig[entityType];

export default {
    ...entityGeneral, // Include the general properties
    template: {
        ...baseEntity.template,
        infrastructureSCName: basicName.template,
        structuralType: null,
        structuralProperties: null,
    },
    graphQl: {
        properties: {
            ...baseEntity.graphQl.properties,
            structuralType: null,
            infrastructureSCName: basicName.graphQl.properties,
            structuralProperties: null,
        },
        filter: {
            ...baseEntity.graphQl.filter,
            infrastructureSCName: basicName.graphQl.filter,
        },
        inlineFragment: {},
    },
    idPrefix: 'infsc',
};
