/**
 * Guard: idUrls returns exactly the identifiers that carry a URL.
 *
 * An entity, a bare identifier and an identifier array are all accepted, as elsewhere in
 * omcIdentifier. A missing, null, blank or non-string `url` is no URL.
 *
 *   Usage: node test/idUrls.js
 */

import { idUrls } from '../src/omc/omcIdentifier.js';

let failures = 0;
const pass = ((msg) => console.log(`  ✓ ${msg}`));
const fail = ((msg) => {
    failures += 1;
    console.error(`  ✗ ${msg}`);
});
const check = ((condition, msg) => (condition ? pass(msg) : fail(msg)));
const same = ((a, b) => JSON.stringify(a) === JSON.stringify(b));

const plain = { identifierScope: 'labkoat.com', identifierValue: 'chr-1' };
const linked = { identifierScope: 'imdb.com', identifierValue: 'ch1', url: 'https://www.imdb.com/character/ch1/' };
const linkedOut = { identifierScope: 'imdb.com', identifierValue: 'ch1', url: 'https://www.imdb.com/character/ch1/' };

console.log('idUrls');
check(same(idUrls({ entityType: 'Character', identifier: [plain, linked] }), [linkedOut]), 'an entity: only the identifier with a url');
check(same(idUrls([linked, plain]), [linkedOut]), 'an identifier array');
check(same(idUrls(linked), [linkedOut]), 'a bare identifier');
check(same(idUrls({ identifier: [plain] }), []), 'no url: empty');
check(same(idUrls({ identifier: [{ ...plain, url: null }] }), []), 'a null url is no url');
check(same(idUrls({ identifier: [{ ...plain, url: '   ' }] }), []), 'a blank url is no url');
check(same(idUrls({ identifier: [{ ...plain, url: 42 }] }), []), 'a non-string url is no url');
check(same(idUrls({ identifier: [{ ...linked, url: ' https://x.test/a ' }] })[0].url, 'https://x.test/a'), 'the url is trimmed');
check(same(idUrls({ identifier: [{ ...linked, combinedForm: 'urn:x' }] }), [linkedOut]), 'only scope, value and url are returned');
check(same(idUrls(null), []) && same(idUrls(undefined), []), 'nothing in: empty');

if (failures) {
    console.error(`\n${failures} failure(s)`);
    process.exit(1);
}
console.log('\nidUrls: all checks passed');
