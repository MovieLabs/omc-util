/**
 * Guard: the v3.0 graphQl templates ask for the relationships the edge table declares.
 *
 * The templates are hand-authored and the edge table is generated, so nothing else compares them.
 * For every entity type this reports:
 *   - MISSING  an intrinsic edge the template does not ask for. An edge inside a property the
 *              template fetches whole (`assetStructureProperties: null`) is asked for, and passes.
 *   - MEMBERS  an edge whose listed target types, in `properties` or `inlineFragment`, are not
 *              the ones the edge table allows.
 *   - UNKNOWN  a capitalised template key that is not an intrinsic edge at that path.
 *
 * A difference that is intended goes in the allow-list, verbatim, with a note saying why.
 *
 *   Usage: node test/omc-v3-0/graphQlEdges.js [--allow <file>]
 *       default allow-list: test/omc-v3-0/graphQlEdges.allow.txt
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { omcTemplate } from '../../index.js';
import { isCapitalized, isPlainObject } from '../../src/mlHelpers/util.js';

const here = dirname(fileURLToPath(import.meta.url));
const allowFlag = process.argv.indexOf('--allow');
const allowPath = allowFlag === -1 ? join(here, 'graphQlEdges.allow.txt') : process.argv[allowFlag + 1];
const allowed = new Set(existsSync(allowPath)
    ? readFileSync(allowPath, 'utf8').split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
    : []);

const schemaVersion = omcTemplate.versions().at(-1);
const sorted = (list) => [...list].sort().join(', ');

/**
 * The template's value at a path: `found` is false when the path is not asked for, and `inBag`
 * is true when a property on the way is fetched whole, which brings the rest with it.
 */
function valueAt(template, segments) {
    let cursor = template;
    for (const segment of segments) {
        if (cursor === null) return { found: true, inBag: true };
        if (!isPlainObject(cursor) || !Object.hasOwn(cursor, segment)) return { found: false };
        cursor = cursor[segment];
    }
    return { found: true, value: cursor };
}

/** Every capitalised key in a template, with its dotted path, outside `edges` and `Context`. */
function relationshipKeys(template, path = []) {
    if (!isPlainObject(template)) return [];
    return Object.entries(template).flatMap(([key, value]) => {
        if (!path.length && (key === 'edges' || key === 'Context')) return [];
        return isCapitalized(key) ? [[...path, key].join('.')] : relationshipKeys(value, [...path, key]);
    });
}

const findings = [];
omcTemplate.allEntityTypes({ schemaVersion }).forEach((entityType) => {
    const { properties, inlineFragment } = omcTemplate.graphQl({ entityType, schemaVersion });
    const { intrinsic = {} } = omcTemplate.edgeTable({ entityType, schemaVersion }) ?? {};
    const edgePaths = new Set();

    Object.values(intrinsic).forEach((edge) => {
        edgePaths.add(edge.path);
        const asked = valueAt(properties, edge.pathSegments);
        if (!asked.found) {
            findings.push(`MISSING ${entityType} ${edge.path}`);
            return;
        }
        // A list of target types is only written out for a union; a single target is a bare key.
        [asked, valueAt(inlineFragment, edge.pathSegments)].forEach(({ value }) => {
            if (isPlainObject(value) && sorted(Object.keys(value)) !== sorted(edge.allowed)) {
                findings.push(`MEMBERS ${entityType} ${edge.path}`);
            }
        });
    });

    relationshipKeys(properties)
        .filter((path) => !edgePaths.has(path))
        .forEach((path) => findings.push(`UNKNOWN ${entityType} ${path}`));
});

const unique = [...new Set(findings)];
const failures = unique.filter((finding) => !allowed.has(finding));
const stale = [...allowed].filter((entry) => !unique.includes(entry));

failures.forEach((finding) => console.error(`  ✗ ${finding}`));
stale.forEach((entry) => console.error(`  ✗ allow-list entry no longer found: ${entry}`));
if (failures.length || stale.length) {
    console.error(`\n${failures.length + stale.length} failed`);
    process.exit(1);
}
console.log(`graphQlEdges: all passed (${allowed.size} allowed)`);
