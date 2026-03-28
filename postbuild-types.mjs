/**
 * Post-build step for type generation.
 *
 * 1. Renames .d.mts → .d.ts for broad IDE compatibility (WebStorm's JS
 *    resolver doesn't follow .d.mts via the TS language service for .mjs files)
 * 2. Strips .mjs extensions from import/export paths so they become
 *    extensionless (e.g. "./src/omc/omcIdentifier") — both WebStorm's
 *    built-in resolver and moduleResolution:"bundler" resolve these to .d.ts
 * 3. Copies globals.d.ts into types/ so consumers can load ambient types
 * 4. Prepends a /// <reference> directive to types/index.d.ts
 */

import { copyFileSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TYPES_DIR = 'types';
const GLOBALS_SRC = 'globals.d.ts';
const GLOBALS_DEST = join(TYPES_DIR, 'globals.d.ts');
const INDEX_DTS = join(TYPES_DIR, 'index.d.ts');
const REFERENCE = '/// <reference path="./globals.d.ts" />\n';

/**
 * Recursively find all files with a given extension
 * @param {string} dir - Directory to search
 * @param {string} ext - File extension to match (e.g. '.d.mts')
 * @returns {string[]} Array of full file paths
 */
function findFiles(dir, ext) {
    const results = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findFiles(fullPath, ext));
        } else if (entry.name.endsWith(ext)) {
            results.push(fullPath);
        }
    }
    return results;
}

// --- Step 1: Rename .d.mts → .d.ts ---
const dmtsFiles = findFiles(TYPES_DIR, '.d.mts');
for (const oldPath of dmtsFiles) {
    const newPath = oldPath.replace(/\.d\.mts$/, '.d.ts');
    renameSync(oldPath, newPath);
}

// --- Step 2: Strip .mjs extensions from import/export paths ---
const dtsFiles = findFiles(TYPES_DIR, '.d.ts');
for (const filePath of dtsFiles) {
    const content = readFileSync(filePath, 'utf8');
    const updated = content.replace(/(from\s+['"]\..*?)\.mjs(['"])/g, '$1$2');
    if (updated !== content) {
        writeFileSync(filePath, updated);
    }
}

// --- Step 3: Copy globals.d.ts into types/ ---
copyFileSync(GLOBALS_SRC, GLOBALS_DEST);

// --- Step 4: Prepend reference directive to index ---
const indexContent = readFileSync(INDEX_DTS, 'utf8');
if (!indexContent.startsWith(REFERENCE)) {
    writeFileSync(INDEX_DTS, REFERENCE + indexContent);
}
