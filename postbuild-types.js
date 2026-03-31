/**
 * Post-build step for type generation.
 *
 * With .js source files, tsc emits .d.ts with .js import paths directly.
 * This script:
 * 1. Copies globals.d.ts into types/ so consumers can load ambient types
 * 2. Prepends a /// <reference> directive to types/index.d.ts
 * 3. Generates a root index.d.ts sidecar that mirrors index.js exports
 *    with paths adjusted to point into the types/ directory
 */

import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TYPES_DIR = 'types';
const GLOBALS_SRC = 'globals.d.ts';
const GLOBALS_DEST = join(TYPES_DIR, 'globals.d.ts');
const INDEX_DTS = join(TYPES_DIR, 'index.d.ts');
const ROOT_DTS = 'index.d.ts';
const REFERENCE = '/// <reference path="./globals.d.ts" />\n';

// --- Step 1: Copy globals.d.ts into types/ ---
copyFileSync(GLOBALS_SRC, GLOBALS_DEST);

// --- Step 2: Prepend reference directive to types/index.d.ts ---
const indexContent = readFileSync(INDEX_DTS, 'utf8');
if (!indexContent.startsWith(REFERENCE)) {
    writeFileSync(INDEX_DTS, REFERENCE + indexContent);
}

// --- Step 3: Generate root index.d.ts sidecar for IDE compatibility ---
// IDEs (WebStorm, etc.) prioritize sidecar .d.ts files next to .js files
// over the "types" field in package.json when indexing node_modules packages.
// We read types/index.d.ts and rewrite each relative path from ./src/... to ./types/src/...
// so the root sidecar directly references each individual .d.ts file.
const typesIndex = readFileSync(INDEX_DTS, 'utf8');
const rootDts = typesIndex.replace(
    /\/\/\/ <reference path="\.\/globals\.d\.ts" \/>/,
    '/// <reference path="./globals.d.ts" />',
).replace(
    /from ["']\.\/src\//g,
    'from "./types/src/',
);
writeFileSync(ROOT_DTS, rootDts);
