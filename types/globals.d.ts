/**
 * Ambient type declarations for TypeScript declaration generation.
 *
 * These types are defined via JSDoc in types.mjs and individual source files.
 * JSDoc resolves types globally, but TypeScript treats .mjs files as modules
 * with isolated scope. This file bridges the gap by declaring types in the
 * global/ambient scope so TypeScript can resolve them during declaration emit.
 *
 * This file has no imports or exports, making all declarations ambient.
 */

// --- Core OMC types (from types.mjs) ---

type OmcIdentifier = {
    identifierScope: string;
    identifierValue: string;
    url?: string;
};

type OmcEntityType = string;

type OmcCustomData = Record<string, any>;

type OmcAnnotation = Record<string, any>;

type OmcTag = Record<string, any>;

type OmcInstanceInfo = Record<string, any>;

type OmcEntity = {
    schemaVersion?: string;
    identifier?: OmcIdentifier[];
    entityType?: OmcEntityType;
    name: string | null;
    description: string | null;
    customData: OmcCustomData | null;
    annotation: OmcAnnotation | null;
    tag: OmcTag | null;
    instanceInfo: OmcInstanceInfo | null;
    [key: string]: any;
};

type OmcJson = Array<OmcEntity> | { [key: string]: Array<OmcEntity> | OmcEntity };

// --- Module-specific types ---

/** Result of a difference comparison (from compare.mjs) */
type DiffResult = {
    original: OmcEntity;
    comparison: OmcEntity;
    diff: { [key: string]: { $remove: any } | { $create: any } | { $update: any } } | null;
};

/** Validation options (from validate.mjs) */
type ValidationOptions = {
    atomic: boolean;
    schemaVersion: string;
    errorResponse: string;
};

/** Entity model with edge/property methods (from entityModel.mjs) */
interface EntityModel extends OmcEntity {
    getBaseKeys(): Array<string>;
    getBaseProps(): { [key: string]: any };
    getIntrinsicKeys(): Array<string>;
    getIntrinsicProps(): { [key: string]: any };
    getContextKeys(): Array<string>;
    getContextProps(): { [key: string]: any };
}

/** In-memory OMC entity store (from omcSDK.mjs) */
type OmcStore = {
    cache: any;
    internalId(omcEntity: OmcEntity, options?: object): string | null;
    getInternalId(storeId: string): OmcEntity | null;
    get(omcId: OmcIdentifier, options?: object): OmcEntity | null;
    set(omc: OmcJson): any | null;
    remove(omc: OmcEntity, options?: object): any;
    removeWithEdges(omc: OmcEntity): any;
    replace(omc: OmcJson): any | null;
    reset(): OmcStore;
    exportModel(): Array<OmcEntity>;
    find(filter: object, options?: object): Array<OmcEntity> | null;
    intrinsicProps(identifier: OmcIdentifier): { [key: string]: any } | null;
    contextEdges(identifier: OmcIdentifier): { [key: string]: any } | null;
    identifier: {
        merge: Function;
    };
};

/** General configuration for entity types (from generalConfig.mjs) */
type OmcGeneralConfig = {
    [entityType: string]: {
        group: string;
        idPrefix: string;
        presentation: {
            entityColor: string;
            entityLabel: string;
            entityLabelSuffix?: (omc: OmcEntity) => string;
        };
    };
};

/** Simplified template describing the shape of a GraphQL query (from omcGraphQl/index.mjs) */
type QueryTemplate = { [key: string]: any };

/** Query variables to filter a GraphQL query (from queryBuilder.mjs) */
type QueryVariable = { [key: string]: any };
