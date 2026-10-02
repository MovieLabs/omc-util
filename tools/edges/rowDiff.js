/**
 * Which table rows a change moves, printed — so a publication that quietly loses half the table
 * cannot pass unremarked.
 *
 * @module tools/edges/rowDiff
 */

import { rowKeys } from '../../src/edgeBuild/index.js';

/**
 * @param {Object|null} before - The table being replaced, or null when there is none
 * @param {Object} after - The table replacing it
 * @returns {{removed: string[], added: string[]}}
 */
export function printRowDiff(before, after) {
    const was = rowKeys(before);
    const now = rowKeys(after);
    const wasSet = new Set(was);
    const nowSet = new Set(now);
    const removed = was.filter((key) => !nowSet.has(key));
    const added = now.filter((key) => !wasSet.has(key));

    console.log(`  table rows ${was.length} -> ${now.length}`);
    // Nothing to compare with: every row is new, and listing them all says nothing.
    if (!before) return { removed, added };
    const show = ((title, list) => {
        if (!list.length) return;
        console.log(`\n  rows this ${title} (${list.length})`);
        list.forEach((key) => console.log(`    ${key.replace(/\|/g, '  ')}`));
    });
    show('removes', removed);
    show('adds', added);
    if (!removed.length && !added.length) console.log('  no row moves; the change is in the fields, if any');
    return { removed, added };
}
