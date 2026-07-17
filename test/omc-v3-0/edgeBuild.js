/**
 * Standalone preview of the consolidated edge build (edges.js / buildEdgeTable.js).
 *
 * Node-only — deliberately kept OUT of the package entry (src/templates/v3-0/index.js)
 * so the browser bundle (Vite consumers of `omc-util`) never pulls in node builtins.
 *
 *   node test/omc-v3-0/edgeBuild.js            # full generated edgeTable as JSON
 *   node test/omc-v3-0/edgeBuild.js Character  # one entity's edgeTable
 */

import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';

const { table, collisions } = buildEdgeTable();
const only = process.argv[2];

console.log(JSON.stringify(only ? { [only]: table[only] } : table, null, 2));
console.warn(`\n[edge build preview] ${collisions.length} key collision(s)`);
collisions.forEach((c) => console.warn(`  ! ${c}`));
