/**
 * Post-build step for type generation.
 *
 * With .js source files, tsc emits .d.ts with .js import paths directly.
 * This script only needs to:
 * 1. Copy globals.d.ts into types/ so consumers can load ambient types
 * 2. Prepend a /// <reference> directive to types/index.d.ts
 */

import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TYPES_DIR = 'types';
const GLOBALS_SRC = 'globals.d.ts';
const GLOBALS_DEST = join(TYPES_DIR, 'globals.d.ts');
const INDEX_DTS = join(TYPES_DIR, 'index.d.ts');
const REFERENCE = '/// <reference path="./globals.d.ts" />\n';

// --- Step 1: Copy globals.d.ts into types/ ---
copyFileSync(GLOBALS_SRC, GLOBALS_DEST);

// --- Step 2: Prepend reference directive to index ---
const indexContent = readFileSync(INDEX_DTS, 'utf8');
if (!indexContent.startsWith(REFERENCE)) {
    writeFileSync(INDEX_DTS, REFERENCE + indexContent);
}
