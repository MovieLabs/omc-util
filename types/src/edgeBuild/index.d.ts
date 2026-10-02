/**
 * Build an edge-table artifact from a published edge document.
 *
 * Refuses (throws) only a document that is not edge definitions. Everything else — a relationship
 * the schema declares that the publication lacks, an inverse fMam cannot write — comes back as
 * `findings`, for the caller to show or to gate on. Nothing here gates: the CLI does, with its
 * accept files, because building there is the decision to ship.
 *
 * @param {Object} document - The published edge document (`GET /api/vocab/v1/edges/publish?format=json`)
 * @param {Object} [options]
 * @param {Object} [options.schema] - The OMC v3.0 JSON Schema to read caps from and check against;
 *   defaults to the one bundled with omc-util
 * @param {string} [options.label] - What to call the document in an error
 * @param {boolean} [options.check=true] - Run the checks; false skips them for speed
 * @returns {EdgeBuildResult}
 * @throws {Error} When the document holds nothing shaped like edge definitions
 *
 * @example
 * import { buildEdgeArtifact } from 'omc-util/edge-build';
 * const { artifact, findings } = buildEdgeArtifact(published);
 * omcTemplate.setEdgeTable({ schemaVersion, artifact, source: 'live: edges/publish' });
 */
export function buildEdgeArtifact(document: any, { schema, label, check }?: {
    schema?: any;
    label?: string;
    check?: boolean;
}): EdgeBuildResult;
export namespace checks {
    export { coverage };
    export { inverse };
}
declare namespace _default {
    export { buildEdgeArtifact };
    export { checks };
    export { schemaFingerprint };
}
export default _default;
/**
 * What `buildEdgeArtifact` returns.
 */
export type EdgeBuildResult = {
    /**
     * - The table, ready for `omcTemplate.setEdgeTable` or to be
     * written as `edgeTable.json`
     */
    artifact: EdgeTableArtifact;
    /**
     * - Per check (`coverage`, `inverse`),
     * per kind, the findings; empty when built with `check: false`
     */
    findings: {
        [x: string]: {
            [x: string]: string[];
        };
    };
    /**
     * - Two definitions that claimed one storage path
     */
    collisions: string[];
    /**
     * - The publication's edge definitions, as read
     */
    definitions: any;
    /**
     * - Rows in the table
     */
    rows: number;
    /**
     * - Rows the RDF model names a property for
     */
    rdfNamed: number;
};
import * as coverage from './checks/coverage.js';
import * as inverse from './checks/inverse.js';
import { definitionsFrom } from './definitions.js';
import { edgeTableFrom } from './assemble.js';
import { rowKeys } from './assemble.js';
import { schemaFingerprint } from './fingerprint.js';
export { definitionsFrom, edgeTableFrom, rowKeys, schemaFingerprint };
//# sourceMappingURL=index.d.ts.map