/**
 * Guard: a query brings back every edge an entity holds, and the store keeps them.
 * Unsaved changes are the exception: an entity named in `keep` is not changed by a load.
 *
 * Two halves, because either one alone loses edges:
 *   - queryBuilder asks for each `edges` relationship of every expanded entity, as a reference,
 *     from the bundled edge table (the one fMam builds its SDL from).
 *   - omcSDK.set merges an entity it already holds with the incoming copy, so edges a later query
 *     brings are added; the stored copy wins a disagreement.
 *
 *   Usage: node test/queryEdges.js
 */

import { omcEdges, omcGraphQl, omcSDK, omcTemplate } from '../index.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

let failures = 0;
const check = ((label, cond, detail = '') => {
    if (cond) {
        console.log(`  ✓ ${label}`);
        return;
    }
    failures += 1;
    console.error(`  ✗ ${label}   ${detail}`);
});

/** The query with whitespace collapsed, so assertions read as one line. */
const build = ((args) => omcGraphQl.queryBuilder({ schemaVersion, variables: { project: 'p' }, ...args })
    .replace(/\s+/g, ' '));

console.log('queryBuilder');
{
    const q = build({ entityType: 'NarrativeWardrobe' });
    check('a full entity asks for its edges as references',
        q.includes('edges { neededBy { Character { identifier {...idFields} } }'));

    const nested = build({
        entityType: 'Character',
        template: { edges: { needs: { NarrativeWardrobe: 'NarrativeWardrobe' } } },
    });
    check('an edge the query names is expanded', nested.includes('NarrativeWardrobe { ...baseEntity'));
    check('the expanded entity asks for its own edges, the inverse included',
        /NarrativeWardrobe \{ \.\.\.baseEntity[^]*neededBy \{ Character \{ identifier \{\.\.\.idFields\}/.test(nested));
    check('naming one edge keeps the others the entity holds',
        nested.includes('needs { Effect { identifier {...idFields} }'));

    omcTemplate.setEdgeTable({ schemaVersion, artifact: { table: {}, inverseEdges: {} }, source: 'test' });
    const installed = build({ entityType: 'NarrativeWardrobe' });
    omcTemplate.resetEdgeTable({ schemaVersion });
    check('an installed edge table does not change what is asked for', installed === q);

    const legacy = build({ entityType: 'Character', schemaVersion: 'https://movielabs.com/omc/json/schema/v2.8' });
    check('a version with no edges bucket asks for none', !legacy.includes('edges {'));
}

console.log('omcSDK.set');
{
    const id = ((v) => [{ identifierScope: 'labkoat', identifierValue: v }]);
    const character = {
        schemaVersion, entityType: 'Character', identifier: id('cha-1'), label: 'Edited',
    };
    const wardrobe = {
        schemaVersion, entityType: 'NarrativeWardrobe', identifier: id('nwd-1'), label: 'Coat',
    };
    const model = omcSDK();
    model.set([character]);
    model.set([wardrobe]);
    const stored = model.set([{
        ...character,
        label: 'From server',
        description: 'Filled',
        edges: {
            needs: {
                NarrativeWardrobe: [{
                    ...wardrobe,
                    edges: { neededBy: { Character: [{ identifier: id('cha-1') }] } },
                }],
            },
        },
    }]);
    const c = model.get(id('cha-1'));
    const w = model.get(id('nwd-1'));
    check('an edge reaches an entity already held', c.edges?.needs?.NarrativeWardrobe?.length === 1);
    check('its inverse reaches the other entity', w.edges?.neededBy?.Character?.length === 1);
    check('the stored value wins a disagreement', c.label === 'Edited');
    check('a value the stored copy lacked is filled', c.description === 'Filled');
    check('the merged entity keeps the model methods', typeof c.getBaseKeys === 'function');
    check('set returns what the store holds after the merge', stored.includes(c) && stored.includes(w));

    const other = { schemaVersion, entityType: 'Effect', identifier: id('cha-1') };
    model.set([other]);
    check('an entity of another type at the same identifier is not merged in',
        model.get(id('cha-1')).entityType === 'Character');
}

console.log('omcSDK.set with keep');
{
    const id = ((v) => [{ identifierScope: 'labkoat', identifierValue: v }]);
    const wardrobeRef = { identifier: id('nwd-1') };
    const character = {
        schemaVersion, entityType: 'Character', identifier: id('cha-1'), label: 'Ann',
    };
    const serverCopy = { ...character, description: 'From server', edges: { needs: { NarrativeWardrobe: [wardrobeRef] } } };
    const deleted = { schemaVersion, entityType: 'Effect', identifier: id('eff-1') };

    const model = omcSDK();
    model.set([character]); // the edge was deleted locally, so the stored copy lacks it
    const stored = model.set([serverCopy, deleted], { keep: [character, deleted] });
    const c = model.get(id('cha-1'));
    check('a kept entity does not get back an edge removed locally', !c.edges);
    check('a kept entity is not filled from the incoming copy', c.description === undefined);
    check('a kept entity the store no longer holds is not added', model.get(id('eff-1')) === null);
    check('set returns the kept entity as stored, and leaves out the absent one',
        stored.length === 1 && stored[0] === c);
    check('keep accepts a bare identifier array', (() => {
        model.set([serverCopy], { keep: [id('cha-1')] });
        return !model.get(id('cha-1')).edges;
    })());
    model.set([serverCopy]);
    check('without keep the same load merges', model.get(id('cha-1')).edges?.needs?.NarrativeWardrobe?.length === 1);
}

console.log('omcEdges.getIntrinsicProps');
{
    const ref = ((v) => ({ identifier: [{ identifierScope: 'labkoat', identifierValue: v }] }));
    const props = omcEdges.getIntrinsicProps({
        entityType: 'Character',
        edges: { needs: { Effect: [ref('e1')] }, informs: { Effect: [ref('e2')], Asset: [ref('a1')] } },
    });
    check('references to one type under two predicates are both kept', props.Effect?.length === 2);
    check('other types are unaffected', props.Asset?.length === 1);
}

console.log(failures ? `\nqueryEdges: ${failures} FAILED` : '\nqueryEdges: OK');
if (failures) process.exit(1);
