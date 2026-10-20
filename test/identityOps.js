/**
 * Guard: replacing an entity's identifier. `omcEdges.replaceReference` re-points references to the
 * old identifier, wherever an entity keeps them; `omcSDK.reidentify` swaps the identifiers while
 * keeping the internal id.
 *
 *   Usage: node test/identityOps.js
 */

import { omcEdges, omcIdentifier, omcSDK } from '../index.js';

let failures = 0;
const check = ((what, ok) => {
    if (ok) console.log(`  ✓ ${what}`);
    else {
        failures += 1;
        console.error(`  ✗ ${what}`);
    }
});

const V3 = 'https://movielabs.com/omc/json/schema/v3.0';
const S = 'movielabs.com';
const id = ((value, scope = S) => ({ identifierScope: scope, identifierValue: value }));
const keys = ((refs) => (refs ?? []).flatMap((ref) => ref.identifier.map(omcIdentifier.idKey)));

console.log('=== replaceReference ===');
const { fromEntity: slate } = omcEdges.edgeCreate({
    fromEntity: { entityType: 'Slate', schemaVersion: V3, identifier: [id('slt-1')] },
    toEntity: { entityType: 'ProductionScene', schemaVersion: V3, identifier: [id('pscn-old')] },
    intrinsicEdge: 'edges.for.ProductionScene',
});
const moved = omcEdges.replaceReference(slate, id('pscn-old'), id('pscn-new'));
check('a reference to the old identifier points at the new one', JSON.stringify(keys(moved.edges.for.ProductionScene)) === JSON.stringify([`${S}:pscn-new`]));
check('the original is not changed', JSON.stringify(keys(slate.edges.for.ProductionScene)) === JSON.stringify([`${S}:pscn-old`]));
check('nothing to replace returns the same object', omcEdges.replaceReference(slate, id('pscn-other'), id('pscn-new')) === slate);

const both = {
    ...slate,
    edges: { for: { ProductionScene: [{ identifier: [id('pscn-old'), id('pscn-new')] }] } },
};
check('a reference already carrying the new one loses the old one only',
    JSON.stringify(keys(omcEdges.replaceReference(both, id('pscn-old'), id('pscn-new')).edges.for.ProductionScene)) === JSON.stringify([`${S}:pscn-new`]));

const asset = { entityType: 'Asset', schemaVersion: V3, identifier: [id('ast-1')], Asset: { identifier: [id('pscn-old')] } };
check('a single (non-array) reference is replaced too',
    JSON.stringify(omcEdges.replaceReference(asset, id('pscn-old'), id('pscn-new')).Asset.identifier) === JSON.stringify([id('pscn-new')]));

console.log('=== reidentify ===');
const model = omcSDK();
model.set([{ entityType: 'ProductionScene', schemaVersion: V3, identifier: [id('pscn-old'), id('Y', 'com.yamdu.app')] }]);
const before = model.get({ identifier: [id('pscn-old')] });
const internal = model.internalId(before);
const after = model.reidentify(before, { ...before, identifier: [id('pscn-new'), id('Y', 'com.yamdu.app')] });
check('the internal id is kept', model.internalId(after) === internal && model.getInternalId(internal) === after);
check('the new identifier resolves to it', model.get({ identifier: [id('pscn-new')] }) === after);
check('the dropped identifier no longer resolves', model.get({ identifier: [id('pscn-old')] }) === null);
check('one that stays still resolves', model.get({ identifier: [id('Y', 'com.yamdu.app')] }) === after);
check('the model holds one entity', model.exportModel().length === 1);

if (failures) {
    console.error(`\nidentityOps: ${failures} problem(s)`);
    process.exit(1);
}
console.log('\nidentityOps: OK');
