/**
 * Guard: a model remembers the identifiers its source does not have, so a loader asks once, and
 * forgets one as soon as an entity carrying it is stored, or all of them on reset.
 *
 *   Usage: node test/missing.js
 */

import { omcSDK } from '../index.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

let failures = 0;
const check = ((label, cond) => {
    if (cond) {
        console.log(`  ✓ ${label}`);
        return;
    }
    failures += 1;
    console.error(`  ✗ ${label}`);
});

const id = ((value) => ({ identifierScope: 'test', identifierValue: value }));
const model = omcSDK();

console.log('missing');
check('nothing is missing until it is marked', !model.isMissing(id('a')));
model.markMissing([{ identifier: [id('a')] }, id('b')]);
check('a marked reference is missing', model.isMissing({ identifier: [id('a')] }));
check('so is a marked bare identifier', model.isMissing(id('b')));
check('a reference is missing only when every identifier it carries is',
    !model.isMissing({ identifier: [id('a'), id('c')] }));
model.set([{ entityType: 'Slate', schemaVersion, identifier: [id('a')], name: 'arrived' }]);
check('storing an entity that carries one forgets it', !model.isMissing(id('a')));
check('and leaves the others', model.isMissing(id('b')));
model.reset();
check('reset forgets them all', !model.isMissing(id('b')));

if (failures) {
    console.error(`missing: ${failures} failed`);
    process.exit(1);
}
console.log('missing: OK');
