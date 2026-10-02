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
 * Two more facts about the generated edge table (edgeTable.json, written by `npm run edges:build`)
 * are checked alongside, because they fail as silently: a type the table carries but the barrel
 * does not register has its edges dropped, and a table built against a different
 * schema from the one bundled here has `maxItems` the validator does not agree with.
 *
 * Differences are matched verbatim against an allow-list, in the same idiom as
 * edgeParity.js `--accept`, so a type that is deliberately in the schema ahead of the template
 * work is declared rather than invisible.
 *
 *   Usage: node test/omc-v3-0/registryParity.js [--allow <file>] [--schema <path>] [--propose]
 *       default allow-list: test/omc-v3-0/registryParity.allow.txt
 *
 * `--schema` judges a schema authored elsewhere against the registry bundled here, which is the
 * question asked before the schema is copied across: what will omcUtil need in order to carry it?
 * A path is resolved against the directory npm ran from, so OMC-Development can name its own file:
 *
 *   npm --prefix <omcUtil> run test:registry -- --schema OMC-JSON/OMC-JSON-v3.0.schema.json
 *
 * `--propose` adds the text each finding needs, ready to paste. It writes nothing: `group`,
 * `idPrefix` and `mergeKey` are decisions, not derivations, and the registry is deliberately not
 * generated — see the note above.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { schemaFingerprint } from '../../src/edgeBuild/fingerprint.js';
import { isCapitalized } from '../../src/mlHelpers/util.js';
import schemav30 from '../../src/omc/validation/schema/OMC-JSON-v3.0.schema.json' with { type: 'json' };
import { discriminatorValue, listEntities } from '../../src/templates/schemaDerive.js';
import edgeTable from '../../src/templates/v3-0/edgeTable.json' with { type: 'json' };
import { generalConfig } from '../../src/templates/v3-0/generalConfig.js';
import { entityTemplate } from '../../src/templates/v3-0/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const defaultAllowPath = join(here, 'registryParity.allow.txt');

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

const line = (s = '') => console.log(s);

/**
 * The schema under test. A path a person types resolves against the directory npm was run from,
 * the same rule as tools/edges/sources.js, so a relative path means what they meant by it.
 */
const schemaArg = argValue('--schema');
const schemaPath = schemaArg ? resolve(process.env.INIT_CWD || process.cwd(), schemaArg) : null;
if (schemaPath && !existsSync(schemaPath)) {
    console.error(`--schema not found: ${schemaPath}`);
    process.exit(1);
}
const schema = schemaPath ? JSON.parse(readFileSync(schemaPath, 'utf8')) : schemav30;
const schemaLabel = schemaPath || 'bundled src/omc/validation/schema/OMC-JSON-v3.0.schema.json';
const propose = process.argv.includes('--propose');

// ---- the four sources -------------------------------------------------------

/** Entity types the schema declares, found by their entityType discriminator. */
const schemaTypes = [...listEntities(schema).keys()].sort();

/**
 * Every capitalized, undeprecated discriminator in `$defs`, at both levels listEntities scans —
 * before it drops the ones nothing references. The difference between this and `schemaTypes` is
 * exactly the set of discriminated nodes no `$ref` points at.
 */
const discriminatedTypes = (() => {
    const found = new Set();
    const consider = (def) => {
        if (!def || typeof def !== 'object' || def.deprecated === true) return;
        const et = discriminatorValue(def);
        if (et && isCapitalized(et)) found.add(et);
    };
    Object.values(schema?.$defs || {}).forEach((def) => {
        if (!def || typeof def !== 'object') return;
        consider(def);
        if (def.properties && typeof def.properties === 'object') {
            Object.values(def.properties).forEach(consider);
        }
    });
    return [...found].sort();
})();

/**
 * The `rootEntity` enum: the schema's own list of instantiable entityTypes, used to dispatch a
 * bare entity onto its definition. It duplicates `$defs` by hand, so it drifts on its own.
 */
const enumTypes = [...(schema.$defs?.core?.properties?.rootEntity?.allOf?.[0]
    ?.properties?.entityType?.enum || [])].sort();

/** Types carrying a generalConfig entry — the group, idPrefix and presentation. */
const configTypes = Object.keys(generalConfig).sort();

/** Types the barrel registers, which is what every omcTemplate accessor reads. */
const registeredTypes = Object.keys(entityTemplate).filter(isCapitalized).sort();

/** Types the generated edge table carries rows for. */
const edgeTableTypes = Object.keys(edgeTable.table || {}).sort();

/**
 * Whether the edge table was built against the schema bundled here, by the fingerprint the edge
 * build records (src/edgeBuild/fingerprint.js).
 */
const bundledFingerprint = schemaFingerprint(schema);
const tableFingerprint = edgeTable.generated?.schema?.fingerprint ?? null;

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
        // The blind spot the other categories cannot see. listEntities reads a discriminated node
        // nothing references as an abstract base, so such a type is absent from schemaTypes:
        // ENUM-MISSING filters schemaTypes and ENUM-ORPHAN filters the enum, so neither can fire
        // and the type is reported nowhere. A genuine abstract base belongs in the allow-list.
        category: 'SCHEMA-UNREFERENCED',
        why: 'has an entityType discriminator in $defs but no $ref points at it — read as an abstract base, so it is not an entity; add its slot in core.rootObject (and collectionObject if it may be an edge target)',
        types: discriminatedTypes.filter(not(schemaTypes)),
    },
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
    {
        // The reverse of UNADOPTED, and the direction a deprecation arrives from: the schema drops a
        // type and the registry keeps it. `shape()` then has nothing to derive, so the type is
        // offered by allEntityTypes and allSchemaGroups, reaches the query builder and the UI, and
        // cannot validate. `test/mergeKeys.js` catches it only where the type has a mergeKey.
        category: 'UNDECLARED',
        why: 'registered or configured but absent from $defs — nothing can be derived for it',
        types: [...new Set([...registeredTypes, ...configTypes])].filter(not(schemaTypes)),
    },
    {
        category: 'EDGES-UNREGISTERED',
        why: 'the edge table has rows for it but the barrel does not register it — its edges are dropped',
        types: edgeTableTypes.filter(not(registeredTypes)),
    },
    {
        // Not a type, but the same kind of disagreement: edges:build writes edgeTable.json and the schema
        // together; a schema copied in without a rebuild leaves maxItems out of step.
        category: 'EDGES-SCHEMA',
        why: 'edgeTable.json was built against a different schema from the one bundled — rebuild with npm run edges:build',
        types: tableFingerprint === bundledFingerprint ? [] : [`built-from ${tableFingerprint ?? 'unknown'}`],
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
line(`  schema: ${schemaLabel}`);
line(`  $defs ${schemaTypes.length}  enum ${enumTypes.length}  `
    + `generalConfig ${configTypes.length}  registered ${registeredTypes.length}`);

let failures = 0;
/** Unallowed findings, kept so --propose can say what each one needs. */
const outstanding = [];
checks.forEach(({ category, why, types }) => {
    if (!types.length) {
        console.log(`  ✓ ${category}: none — ${why}`);
        return;
    }
    line(`\n  ${category} (${types.length}) — ${why}`);
    types.forEach((type) => {
        const entry = `${category} ${type}`;
        const ok = allowed.has(entry);
        if (!ok) {
            failures += 1;
            outstanding.push({ category, type });
        }
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
line(`  edge table: ${edgeTable.generated?.rows ?? '?'} rows, generated by ${edgeTable.generated?.by ?? '?'}`);
line('    Where the table and the JSON Schema disagree is `npm run edges:check`.');
line(`  empty edge table (${noEdges.length}): ${noEdges.join(', ') || 'none'}`);
line('    Creatable and editable, but with no relationships: the publication carries no predicate');
line('    for it, and fMam omits the edges field entirely for such a type.');

// ===== PROPOSE (--propose; prints, never writes) =============================

/** Which `$defs` bucket a type sits under, for the `$ref` a slot needs. */
const bucketOf = ((type) => {
    const hit = Object.entries(schema?.$defs || {})
        .find(([, def]) => def?.properties && Object.keys(def.properties).includes(type));
    return hit ? hit[0] : null;
});

/** What each finding needs, as text to apply by hand. */
const proposals = {
    'SCHEMA-UNREFERENCED': (type) => {
        const bucket = bucketOf(type) || '<Bucket>';
        return [
            '  core.properties.rootObject.properties — add the slot that makes it an entity:',
            `      "${type}": { "$ref": "#/$defs/${bucket}/properties/${type}" }`,
            '  core.properties.collectionObject.properties — add the same, if it may be an edge target.',
            '  Until one $ref points at it, listEntities reads it as an abstract base and no other',
            '  check can see it. If it IS an abstract base, allow-list it instead:',
            `      SCHEMA-UNREFERENCED ${type}   # abstract base, intentionally not instantiable`,
        ];
    },
    'ENUM-MISSING': (type) => [
        `  In ${schemaLabel}`,
        ...(schemaPath
            ? []
            : [
                '  — which is omcUtil\'s own copy, overwritten by a build from the authoring repo, so',
                '  make this change in the authored schema rather than here —',
            ]),
        '  at $defs.core.properties.rootEntity.allOf[0].properties.entityType.enum, add:',
        '',
        `      "${type}"`,
        '',
        '  A hand-maintained duplicate of $defs. Without it omcValidate fails with an enum error',
        '  naming every other type, which reads as the entity being wrong rather than the list.',
    ],
    'UNCONFIGURED': (type) => proposals.UNADOPTED(type),
    'UNREGISTERED': (type) => proposals.UNADOPTED(type),
    'EDGES-UNREGISTERED': (type) => proposals.UNADOPTED(type),
    'UNADOPTED': (type) => {
        const groups = [...new Set(Object.values(generalConfig)
            .map((entry) => entry?.group).filter(Boolean))].sort();
        const bucket = bucketOf(type);
        return [
            '  src/templates/v3-0/generalConfig.js — add this entry:',
            '',
            `      ${type}: {`,
            '          group: \'\',',
            '          idPrefix: \'\',',
            '          mergeKey: [],',
            '          presentation: {',
            `              header: { label: '${type}' },`,
            '              propRows: [\'label\'],',
            '          },',
            '      },',
            '',
            `  group     REQUIRED — a type without one is dropped from every group listing.${
                bucket ? ` The schema files this under $defs.${bucket}.` : ''}`,
            `            Existing groups: ${groups.join(', ') || '(none)'}`,
            '  idPrefix  appears in identifier values, so keep it short and readable',
            '  mergeKey  [] unless a property really is unique within a project and may stand in',
            '            for identity when merging sources',
            '  propRows  a string is read straight off the entity, so a name that is not a real',
            '            property renders N/A on every node; reach into one with a function, as',
            '            ProductionScene does. Copying a sibling\'s presentation brings the',
            '            sibling\'s property names with it — check them against this entity.',
            '',
            `  src/templates/v3-0/${bucket ? bucket.toLowerCase() : '<group>'}/${type}.js — the `
            + 'template file, carrying the graphQl template fMam\'s schema must match.',
            `  src/templates/v3-0/index.js — import that exact file and add ${type} to the barrel:`,
            '',
            `      import ${type} from './${bucket ? bucket.toLowerCase() : '<group>'}/${type}.js';`,
            '',
            '  The barrel is what every omcTemplate accessor reads, so until it imports the type',
            '  the type reaches no consumer and nothing reports a problem. This check compares',
            '  names only: an import bound to a sibling\'s file still reads as registered here.',
        ];
    },
    'UNDECLARED': (type) => [
        `  The schema has dropped ${type} but the registry still carries it, so shape() has nothing`,
        '  to derive while allEntityTypes and allSchemaGroups still offer it. Remove from:',
        `      src/templates/v3-0/generalConfig.js        the ${type} entry`,
        '      src/templates/v3-0/index.js                the import and barrel entry',
        `      src/templates/v3-0/<group>/${type}.js      the template file`,
        '  Then rebuild the edge table, and check fMam does not still declare it.',
    ],
};

if (propose && outstanding.length) {
    line('');
    line('=== PROPOSED CHANGES (review and apply by hand — nothing is written) ===');
    outstanding.forEach(({ category, type }) => {
        const build = proposals[category];
        line('');
        line(`--- ${category} ${type} ---`);
        if (!build) {
            line('  No proposal for this category; see the explanation above.');
            return;
        }
        build(type).forEach(line);
    });
    line('');
    line('Order matters across repos: release omc-util, bump fMam\'s manifest and commit its');
    line('lockfile, then add fMam\'s GraphQL modules. edgeTable() has no optional chaining, so a');
    line('type the installed omc-util does not know throws at import and fMam dies at startup.');
} else if (outstanding.length) {
    line('');
    line('Re-run with --propose for the text each finding needs.');
}

// ===== RESULT ================================================================
line('');
if (failures) {
    console.error(`REGISTRY GATE FAILED (${failures} unallowed difference`
        + `${failures === 1 ? '' : 's'}).`);
    console.error(`Register the type, or declare the difference in ${allowPath}.`);
    process.exit(1);
}
line('REGISTRY GATE PASSED. The report above is for review, not a failure.');
