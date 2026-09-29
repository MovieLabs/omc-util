/**
 * What the parked edges.js still holds that the publication does not.
 *
 * The shipped table comes from the Edge Editor alone (see src/templates/v3-0/edgeTable.js), so
 * anything the hand-written seed carried and the tool has not modelled is simply gone from the
 * library. That is the point — a half-and-half table could not be reasoned about — but it means
 * the gap has to be visible, and this is the worklist: every row the seed builds that the
 * publication does not, grouped so it can be worked through in the tool.
 *
 * The reverse direction is reported too. A row the publication builds and the seed never had is
 * new modelling, and a row whose fields disagree is worth a look before the seed is deleted for
 * good.
 *
 * Reports only; it never fails. The seed is not a standard to meet — some of what it holds is
 * wrong, which is why edgeCoverage exists — so a difference here is a question, not a defect.
 *
 *   Usage: node test/omc-v3-0/edgeMissing.js [--out <file>]
 */

import { writeFileSync } from 'node:fs';

import { buildEdgeTable } from '../../src/templates/v3-0/buildEdgeTable.js';
import { edgeDefinitions as seedDefinitions } from '../../src/templates/v3-0/edges.js';
import { publishedDefinitions, publishedInfo } from '../../src/templates/v3-0/edgeTable.js';
import { LEGACY_SUPPLEMENTAL, inverseEdgesFrom } from '../../src/templates/v3-0/inverseEdges.js';

const PARTITIONS = ['intrinsic', 'edges', 'cxtEdges'];
const FIELDS = ['predicate', 'allowed', 'type', 'maxItems', 'inverse', 'inversePath'];

const argValue = (name) => {
    const at = process.argv.indexOf(name);
    return at === -1 ? null : process.argv[at + 1];
};

const out = [];
const say = (text = '') => out.push(text);

/** Every row of a built table, keyed `<EntityType>.<partition> <path>`. */
const rowsOf = ((table) => {
    const rows = new Map();
    Object.entries(table).forEach(([entityType, partitions]) => {
        PARTITIONS.forEach((partition) => {
            Object.entries(partitions[partition] || {}).forEach(([path, entry]) => {
                rows.set(`${entityType}.${partition} ${path}`, entry);
            });
        });
    });
    return rows;
});

const published = rowsOf(buildEdgeTable(publishedDefinitions).table);
const seed = rowsOf(buildEdgeTable(seedDefinitions).table);

const onlySeed = [...seed.keys()].filter((key) => !published.has(key)).sort();
const onlyPublished = [...published.keys()].filter((key) => !seed.has(key)).sort();
const differing = [...published.keys()].filter((key) => seed.has(key))
    .map((key) => {
        const changed = FIELDS.filter((field) => (
            JSON.stringify(published.get(key)[field] ?? null) !== JSON.stringify(seed.get(key)[field] ?? null)
        ));
        return changed.length ? { key, changed } : null;
    })
    .filter(Boolean);

/** A row's verb, for grouping: the predicate of an `edges.*` path, or the property itself. */
const verbOf = ((key) => {
    const path = key.split(' ')[1];
    return path.startsWith('edges.') ? path.split('.')[1] : '(intrinsic)';
});

say('# What the parked edges.js holds and the publication does not');
say('');
say(`Publication: view ${publishedInfo.viewId ?? '?'}, ${publishedInfo.edges ?? '?'} edges / `
    + `${publishedInfo.rows ?? '?'} rows. Built: ${published.size} table rows.`);
say(`Seed (edges.js, parked): ${seed.size} table rows.`);
say('');
say('The shipped table is the publication alone, so everything under MISSING is absent from the');
say('library until the Edge Editor models it.');
say('');

say(`## MISSING — in the seed, not in the publication (${onlySeed.length})`);
say('');
PARTITIONS.forEach((partition) => {
    const rows = onlySeed.filter((key) => key.split(' ')[0].endsWith(`.${partition}`));
    if (!rows.length) return;
    say(`### ${partition} (${rows.length})`);
    say('');
    const byVerb = new Map();
    rows.forEach((key) => byVerb.set(verbOf(key), [...(byVerb.get(verbOf(key)) || []), key]));
    [...byVerb.entries()].sort((a, b) => b[1].length - a[1].length).forEach(([verb, keys]) => {
        say(`- **${verb}** (${keys.length})`);
        keys.forEach((key) => {
            const entry = seed.get(key);
            say(`    - \`${key}\` -> [${(entry.allowed || []).join(', ')}]`
                + `${entry.inverse ? `, inverse \`${entry.inverse}\`` : ''}`);
        });
    });
    say('');
});

say(`## NEW — in the publication, not in the seed (${onlyPublished.length})`);
say('');
onlyPublished.forEach((key) => say(`- \`${key}\` -> [${(published.get(key).allowed || []).join(', ')}]`));
say('');

say(`## CONFLICTING — both build the row, with different fields (${differing.length})`);
say('');
if (!differing.length) say('_None._');
differing.forEach(({ key, changed }) => {
    say(`- \`${key}\``);
    changed.forEach((field) => say(`    - ${field}: seed \`${JSON.stringify(seed.get(key)[field] ?? null)}\``
        + ` -> published \`${JSON.stringify(published.get(key)[field] ?? null)}\``));
});
say('');

const publishedInverses = inverseEdgesFrom(publishedDefinitions);
const seedInverses = inverseEdgesFrom(seedDefinitions);
const lostInverses = Object.keys(seedInverses).filter((predicate) => !publishedInverses[predicate]);
const lostSupplemental = Object.keys(LEGACY_SUPPLEMENTAL).filter((predicate) => !publishedInverses[predicate]);

say(`## INVERSES the publication does not answer for (${lostInverses.length + lostSupplemental.length})`);
say('');
say('fMam asks `omcTemplate.inverseEdge()` per predicate and skips silently when it gets nothing,');
say('so a predicate missing here means the reverse edge is never written.');
say('');
lostInverses.forEach((predicate) => say(`- \`${predicate}\` -> \`${seedInverses[predicate]}\` (from the seed)`));
lostSupplemental.forEach((predicate) => say(`- \`${predicate}\` -> \`${LEGACY_SUPPLEMENTAL[predicate]}\``
    + ' (from the old hand-written supplemental map)'));

const report = `${out.join('\n')}\n`;
const target = argValue('--out');
if (target) {
    writeFileSync(target, report);
    console.log(`Wrote ${target}`);
    console.log(`${onlySeed.length} missing, ${onlyPublished.length} new, ${differing.length} conflicting, `
        + `${lostInverses.length + lostSupplemental.length} inverses unanswered`);
} else {
    console.log(report);
}
