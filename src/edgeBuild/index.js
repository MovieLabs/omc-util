/**
 * Edge build: turns the Edge Editor's published edge document into the edge table omc-util serves.
 *
 * Generation is kept apart from serving. `src/templates` only reads a built table — the bundled
 * `v3-0/edgeTable.json`, or one installed at runtime with `omcTemplate.setEdgeTable`. This module
 * builds one, and it is the only thing that does: the CLI (`npm run edges:build`) writes its output
 * as the bundled default, and a client holding a live publication installs its output directly.
 * Both get the same artifact from the same code.
 *
 * Pure and browser-safe: no filesystem, no network. Reach it as `omc-util/edge-build`, so a consumer
 * that only reads the table never loads it.
 *
 * @module edgeBuild
 * @memberof OmcUtil
 */

import schemav30 from '../omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };

import { edgeTableFrom, rowKeys } from './assemble.js';
import * as coverage from './checks/coverage.js';
import * as inverse from './checks/inverse.js';
import { definitionsFrom } from './definitions.js';
import { schemaFingerprint } from './fingerprint.js';

/**
 * What `buildEdgeArtifact` returns.
 *
 * @memberof OmcUtil
 * @typedef {Object} EdgeBuildResult
 * @property {EdgeTableArtifact} artifact - The table, ready for `omcTemplate.setEdgeTable` or to be
 *   written as `edgeTable.json`
 * @property {Object.<string, Object.<string, string[]>>} findings - Per check (`coverage`, `inverse`),
 *   per kind, the findings; empty when built with `check: false`
 * @property {string[]} collisions - Two definitions that claimed one storage path
 * @property {Object} definitions - The publication's edge definitions, as read
 * @property {number} rows - Rows in the table
 * @property {number} rdfNamed - Rows the RDF model names a property for
 */

/** The checks, by name: each has `name` and `run(subject) → { findings, summary, report }`. */
export const checks = { coverage, inverse };

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
export function buildEdgeArtifact(document, { schema = schemav30, label = 'the document', check = true } = {}) {
    const built = edgeTableFrom(document, schema, label);
    const findings = {};
    if (check) {
        Object.entries(checks).forEach(([key, module]) => {
            findings[key] = module.run({ ...built, schema }).findings;
        });
    }

    const artifact = {
        generated: {
            by: 'omc-util edge-build',
            note: 'Generated — do not edit. Rebuild from the Edge Editor export: npm run edges:build.',
            publication: document?.generated ?? null,
            // The table's maxItems were read from this schema; omc-util compares it with the schema
            // it bundles, so the two are delivered together.
            schema: { $id: schema?.$id ?? null, fingerprint: schemaFingerprint(schema) },
            rows: built.rows,
            rdfNamed: built.rdfNamed,
        },
        table: built.table,
        inverseEdges: built.inverseEdges,
    };

    return {
        artifact,
        findings,
        collisions: built.collisions,
        definitions: built.definitions,
        rows: built.rows,
        rdfNamed: built.rdfNamed,
        rdfUnmatched: built.rdfUnmatched,
    };
}

export {
    definitionsFrom, edgeTableFrom, rowKeys, schemaFingerprint,
};

export default { buildEdgeArtifact, checks, schemaFingerprint };
