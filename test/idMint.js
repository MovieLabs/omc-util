/**
 * Guard: `idMint`, the one identifier minter.
 *
 * The same value always mints the same identifier; the prefix comes from the entityType and is
 * added after the value, never hashed into it; `hash: false` keeps the value readable.
 *
 *   Usage: node test/idMint.js
 */

import { idMint } from '../src/omc/omcIdentifier.js';
import { hashId } from '../src/mlHelpers/util.js';

let failures = 0;
const check = ((what, ok) => {
    if (ok) console.log(`  ✓ ${what}`);
    else {
        failures += 1;
        console.error(`  ✗ ${what}`);
    }
});

const scope = 'movielabs.com';

console.log('=== idMint ===');
const a = idMint({ identifierScope: scope, value: 'wwdoat|1-1', entityType: 'ProductionScene' });
const b = idMint({ identifierScope: scope, value: 'wwdoat|1-1', entityType: 'ProductionScene' });
check('the same value mints the same identifier', a.identifierValue === b.identifierValue);
check('the prefix is added after the hash of the value alone', a.identifierValue === `pscn-${hashId('wwdoat|1-1')}`);
check('the scope is kept', a.identifierScope === scope);

const asset = idMint({ identifierScope: scope, value: 'take-1.mov', entityType: 'Asset' });
const structure = idMint({ identifierScope: scope, value: 'take-1.mov', entityType: 'AssetStructure' });
check('two types from one value differ by prefix only', asset.identifierValue !== structure.identifierValue
    && asset.identifierValue.split('-').slice(1).join('-') === structure.identifierValue.split('-').slice(1).join('-'));

check('no entityType, no prefix', idMint({ identifierScope: scope, value: 'x' }).identifierValue === hashId('x'));

const md5 = '9e107d9d372bb6826bd81d3542a419d6';
check('hash: false keeps the value readable', idMint({
    identifierScope: scope, value: md5, hash: false, entityType: 'Asset',
}).identifierValue === `ast-${md5}`);
check('hash: false with no type is the value as given', idMint({
    identifierScope: 'frame.io', value: 'abc', hash: false,
}).identifierValue === 'abc');

const r1 = idMint({ identifierScope: scope, entityType: 'Character' });
const r2 = idMint({ identifierScope: scope, entityType: 'Character' });
check('no value mints a random, prefixed value', r1.identifierValue.startsWith('chr-') && r1.identifierValue !== r2.identifierValue);
check('an empty value counts as none', idMint({ identifierScope: scope, value: '' }).identifierValue.length === 15);
check('a missing scope falls back to example.com', idMint({ value: 'x' }).identifierScope === 'example.com');

if (failures) {
    console.error(`\nidMint: ${failures} problem(s)`);
    process.exit(1);
}
console.log('\nidMint: OK');
