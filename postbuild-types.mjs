/**
 * Post-build step for type generation.
 *
 * 1. Copies globals.d.ts into types/ so consumers can load it
 * 2. Prepends a /// <reference> directive to types/index.d.mts so
 *    TypeScript automatically loads the ambient types for consumers
 */

import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const GLOBALS_SRC = 'globals.d.ts';
const GLOBALS_DEST = 'types/globals.d.ts';
const INDEX_DTS = 'types/index.d.mts';
const REFERENCE = '/// <reference path="./globals.d.ts" />\n';

// Copy globals.d.ts into types/
copyFileSync(GLOBALS_SRC, GLOBALS_DEST);

// Prepend reference directive to the generated entry point
const content = readFileSync(INDEX_DTS, 'utf8');
if (!content.startsWith(REFERENCE)) {
    writeFileSync(INDEX_DTS, REFERENCE + content);
}
