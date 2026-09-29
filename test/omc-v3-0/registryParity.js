/**
 * Guard: a v3.0 entity type appears in every place that has to know about it.
 *
 * A type is only real to this library once four independent places agree, and nothing else
 * compares them:
 *   - the JSON Schema `$defs`, which says the entity exists
 *   - the schema's own `rootEntity` entityType enum, a hand-maintained duplicate of that list
 *   - generalConfig, which supplies the group, idPrefix and presentation the schema cannot
 *   - the v3-0 barrel, whose imports are what `entityTemplate` — and therefore every public
 *     accessor — is built from
 *
 * Three of the four were done when the Production entities were added: the types were absent
 * from `allSchemaGroups`, so the Portal's edit sidebar had nothing to draw, and separately a
 * well-formed CaptureEvent failed validation because the enum had not been extended. Each
 * symptom pointed somewhere other than the omission.
 *
 * The registry is deliberately NOT derived from the schema. Deriving it would turn an absent
 * type into one that appears and then throws at whichever accessor is reached first, and a
 * shipped library is entitled to assume its own bundled data is correct. This check belongs to
 * development instead, which is why it is a script and not a runtime guard.
 *
 * Differences are matched verbatim against an allow-list, in the same idiom as
 * edgeParity.js `--accept`, so a type that is deliberately in the schema ahead of the template
 * work is declared rather than invisible.
 *
 *   Usage: node test/omc-v3-0/registryParity.js [--allow <file>]
 *       default allow-list: test/omc-v3-0/registryParity.allow.txt
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isCapitalized } from '../../src/mlHelpers/util.js';
import schemav30 from '../../src/omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import { listEntities } from '../../src/templates/schemaDerive.js';
import { shippedEdgeTable } from '../../src/templates/v3-0/edgeTable.js';
import { generalConfig } from '../../src/templates/v3-0/generalConfig.js';
import { entityTemplate } from '../../src/templates/v3-0/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const defaultAllowPath = join(here, 'registryParity.allow.txt');

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

const line = (s = '') => console.log(s);

// ---- the four sources -------------------------------------------------------

/** Entity types the schema declares, found by their entityType discriminator. */
const schemaTypes = [...listEntities(schemav30).keys()].sort();

/**
 * The `rootEntity` enum: the schema's own list of instantiable entityTypes, used to dispatch a
 * bare entity onto its definition. It duplicates `$defs` by hand, so it drifts on its own.
 */
const enumTypes = [...(schemav30.$defs?.core?.properties?.rootEntity?.allOf?.[0]
    ?.properties?.entityType?.enum || [])].sort();

/** Types carrying a generalConfig entry — the group, idPrefix and presentation. */
const configTypes = Object.keys(generalConfig).sort();

/** Types the barrel registers, which is what every omcTemplate accessor reads. */
const registeredTypes = Object.keys(entityTemplate).filter(isCapitalized).sort();

// ---- differences ------------------------------------------------------------

const not = (list) => {
    const set = new Set(list);
    return (type) => !set.has(type);
};

/**
 * Each check is one difference category: a label, the finding, and why it matters. A line is
 * `<CATEGORY> <EntityType>` so an allow-list entry is readable on its own.
 */
const checks = [
    {
        category: 'ENUM-MISSING',
        why: 'declared in $defs but absent from the rootEntity enum — the entity cannot validate',
        types: schemaTypes.filter(not(enumTypes)),
    },
    {
        // Also fires for a type that IS under $defs but that nothing references: listEntities
        // reads an unreferenced discriminated node as an abstract base, so a new entity still
        // needs its slot in rootObject/collectionObject before it counts as instantiable.
        category: 'ENUM-ORPHAN',
        why: 'in the rootEntity enum but not an instantiable entity — absent from $defs, or there but referenced by nothing',
        types: enumTypes.filter(not(schemaTypes)),
    },
    {
        category: 'UNREGISTERED',
        why: 'has a generalConfig entry but the barrel does not import it — reaches no consumer',
        types: configTypes.filter(not(registeredTypes)),
    },
    {
        category: 'UNCONFIGURED',
        why: 'registered but has no generalConfig group — allSchemaGroups drops it silently',
        types: registeredTypes.filter((type) => !generalConfig[type]?.group),
    },
    {
        // Reported only when generalConfig is silent too: a type that HAS a config entry is
        // plainly meant to be registered, and UNREGISTERED already says so more precisely.
        category: 'UNADOPTED',
        why: 'declared in $defs but neither configured nor registered — allow-list it while adoption is pending',
        types: schemaTypes.filter(not(registeredTypes)).filter(not(configTypes)),
    },
];

const allowPath = argValue('--allow') || defaultAllowPath;
const allowed = new Set(existsSync(allowPath)
    ? readFileSync(allowPath, 'utf8').split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter((entry) => entry && !entry.startsWith('#'))
    : []);

// ===== GATE ==================================================================
line('=== REGISTRY GATE ===');
line(`  $defs ${schemaTypes.length}  enum ${enumTypes.length}  `
    + `generalConfig ${configTypes.length}  registered ${registeredTypes.length}`);

let failures = 0;
checks.forEach(({ category, why, types }) => {
    if (!types.length) {
        console.log(`  ✓ ${category}: none — ${why}`);
        return;
    }
    line(`\n  ${category} (${types.length}) — ${why}`);
    types.forEach((type) => {
        const entry = `${category} ${type}`;
        const ok = allowed.has(entry);
        if (!ok) failures += 1;
        console.log(`    ${ok ? '=' : '!'} ${entry}`);
    });
});

// ===== REPORT (informational — not a gate) ===================================
line('');
line('=== REPORT (informational — not a gate) ===');

const noGraphQl = registeredTypes.filter((type) => !entityTemplate[type].graphQl);
const noEdges = registeredTypes.filter((type) => {
    const table = entityTemplate[type].edgeTable || {};
    return !Object.keys(table.intrinsic || {}).length && !Object.keys(table.edges || {}).length;
});

line(`  no graphQl template (${noGraphQl.length}): ${noGraphQl.join(', ') || 'none'}`);
line('    A type with no graphQl template still reaches graphQlEntities, so the query builder');
line('    will offer it. fMam must know the type before a query for it can succeed.');
const { rows: shippedRows } = shippedEdgeTable();
line(`  shipped edge table: ${shippedRows} rows, every one from the publication`);
line('    edges.js is parked and reaches nothing here. `npm run edges:missing` lists what it');
line('    still holds that the publication does not.');
line(`  empty edge table (${noEdges.length}): ${noEdges.join(', ') || 'none'}`);
line('    Creatable and editable, but with no relationships: edges.js carries no predicate for');
line('    it, and fMam omits the edges field entirely for such a type.');

// ===== RESULT ================================================================
line('');
if (failures) {
    console.error(`REGISTRY GATE FAILED (${failures} unallowed difference`
        + `${failures === 1 ? '' : 's'}).`);
    console.error(`Register the type, or declare the difference in ${allowPath}.`);
    process.exit(1);
}
line('REGISTRY GATE PASSED. The report above is for review, not a failure.');
