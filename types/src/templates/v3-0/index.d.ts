/** Where the bundled table came from: the `generated` block of edgeTable.json. */
export const edgeTableGenerated: {
    by: string;
    note: string;
    publication: {
        format: string;
        version: number;
        viewId: string;
        edges: number;
        rows: number;
        verbs: number;
        properties: number;
        classes: number;
    };
    schema: {
        $id: string;
        fingerprint: string;
    };
    rows: number;
    rdfNamed: number;
};
/**
 * The inverse map, as published. Typed as a map rather than inferred from the JSON, so the
 * declarations do not restate the predicates and change with every edge.
 */
export const inverseEdges: {
    [x: string]: string;
};
import { graphQlSnippets } from './graphQlSnippets.js';
export const entityTemplate: {};
export { graphQlSnippets };
//# sourceMappingURL=index.d.ts.map