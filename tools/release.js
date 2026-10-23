/**
 * Cut a release: bump the version, rebuild the edge table so it carries the new version, run
 * release:check, commit the rebuilt table, then make the version commit and tag. It stops at the
 * first thing that fails, and before tagging confirms `main` really moved: a git operation in a
 * Dropbox-synced checkout has updated the files without moving the branch.
 *
 * Pushing is left to the person releasing; the command is printed at the end.
 *
 *   npm run release -- minor        (or major, patch)
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const level = process.argv[2];
if (!['major', 'minor', 'patch'].includes(level)) {
    console.error('Usage: npm run release -- <major|minor|patch>');
    process.exit(1);
}

/** Run a command, showing its output; throws when it fails. */
const run = ((command) => execSync(command, { stdio: 'inherit' }));

/** A command's output, trimmed. */
const read = ((command) => execSync(command, { encoding: 'utf8' }).trim());

const fail = ((message) => {
    console.error(`release: ${message}`);
    process.exit(1);
});

if (read('git rev-parse --abbrev-ref HEAD') !== 'main') fail('release from main');
if (read('git status --porcelain')) fail('the working tree has changes; commit or stash them first');
const start = read('git rev-parse HEAD');

run(`npm version ${level} --no-git-tag-version`);
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
run('npm run edges:build');
run('npm run release:check');
run('git checkout package.json package-lock.json');
if (read('git status --porcelain')) {
    run('git add -A');
    run(`git commit -m "Restamp edge table for ${version}"`);
}
run(`npm version ${level} -m "%s"`);

const head = read('git rev-parse HEAD');
const tagged = read(`git rev-parse v${version}^{commit}`);
if (head === start || head !== tagged || read('git rev-parse main') !== head) {
    fail(`main is at ${head.slice(0, 7)} but v${version} is ${tagged.slice(0, 7)}; check git log before pushing`);
}
console.log(`\nreleased v${version} at ${head.slice(0, 7)}. Push with:\n  git push --follow-tags origin main`);
