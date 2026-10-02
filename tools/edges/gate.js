/**
 * Judge a check's findings and print them.
 *
 * **Consequence decides, not recency.** A finding blocks when acting on it produces invalid OMC,
 * and warns when it does not. That line is a property of the finding, declared by the check as
 * `severity[kind]`, and it is the only thing that can refuse a build:
 *
 *   blocking  the table would mint entities `omcValidate` rejects — an intrinsic edge at a path
 *             the schema does not declare, a target or a cap the schema disagrees with. v3.0 sets
 *             `unevaluatedProperties: false`, so such an entity fails as a whole.
 *   warning   the output is valid but incomplete or unrecorded — an edge the publication has not
 *             caught up with, a predicate the schema does not declare. The shared edges block is
 *             `additionalProperties: true`, so these validate silently.
 *
 * There is no way to accept a blocking finding. A rule saying a broken build is acceptable would
 * assert something false, and nothing downstream would be any less broken for it.
 *
 * The baseline file is for reading, not for permission. It records which warnings have been seen,
 * so a new one stands out from a known one — useful because the cause and the urgency differ, and
 * that is what decides when it gets fixed. It cannot make anything pass or fail, so an entry that
 * no longer occurs is deleted on sight rather than reported: pruning a line that grants nothing
 * discards no decision, which is why this cannot rot.
 *
 * @module tools/edges/gate
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const line = (s = '') => console.log(s);

/** Comment and blank lines are kept on a rewrite; only findings are compared. */
const readBaseline = ((path) => {
    if (!existsSync(path)) return { entries: new Set(), lines: [] };
    const lines = readFileSync(path, 'utf8').split(/\r?\n/);
    const entries = new Set(lines
        .map((entry) => entry.trim())
        .filter((entry) => entry && !entry.startsWith('#')));
    return { entries, lines };
});

/** Rewrite the baseline without the findings that no longer occur, keeping its prose. */
const prune = ((path, lines, gone) => {
    const kept = lines.filter((raw) => {
        const entry = raw.trim();
        if (!entry || entry.startsWith('#')) return true;
        return !gone.has(entry);
    });
    writeFileSync(path, kept.join('\n'));
});

/**
 * Print one check's result and count what blocks.
 *
 * @param {{name: string, run: function, severity?: Object<string,string>}} check
 * @param {Object} subject - What the check reads
 * @param {{label: string, acceptPath: string, gate: boolean, write?: boolean}} options
 * @returns {{failing: number, warnings: number, fresh: string[], pruned: string[]}}
 */
export function judge(check, subject, {
    label, acceptPath, gate, write = true,
}) {
    const { findings, summary, report } = check.run(subject);
    const severity = check.severity || {};
    const { entries: known, lines } = readBaseline(acceptPath);
    const occurring = new Set();

    line(`=== ${check.name} ${gate ? 'GATE' : 'CHECK'} ===`);
    line(`  source: ${label}`);
    summary.forEach((entry) => line(`  ${entry}`));

    let failing = 0;
    let warnings = 0;
    const fresh = [];

    Object.entries(findings).forEach(([kind, entries]) => {
        const blocks = severity[kind] === 'blocking';
        if (!entries.length) {
            line(`  ✓ ${kind}: none`);
            return;
        }
        line(`\n  ${kind} (${entries.length}) — ${blocks ? 'BLOCKING: invalid OMC' : 'warning'}`);
        entries.forEach((entry) => {
            const full = `${kind} ${entry}`;
            occurring.add(full);
            if (blocks) {
                failing += 1;
                line(`    ✖ ${full}`);
                return;
            }
            warnings += 1;
            const isNew = !known.has(full);
            if (isNew) fresh.push(full);
            line(`    ${isNew ? 'NEW ' : '  · '} ${full}`);
        });
    });

    if (report.length) {
        line('\n  --- report (informational) ---');
        report.forEach((entry) => line(`  ${entry}`));
    }

    // Warnings only; a blocking kind is never recorded, because it is never carried forward.
    const warnable = new Set([...occurring].filter((entry) => {
        const kind = Object.keys(findings).find((k) => entry.startsWith(`${k} `));
        return severity[kind] !== 'blocking';
    }));
    const pruned = [...known].filter((entry) => !warnable.has(entry));
    if (pruned.length && write) {
        prune(acceptPath, lines, new Set(pruned));
    }

    line('');
    if (fresh.length) {
        line(`  ${fresh.length} new warning${fresh.length === 1 ? '' : 's'} since the last run `
            + '— worth knowing why now, not necessarily worth fixing now.');
    }
    if (pruned.length) {
        line(`  ${pruned.length} warning${pruned.length === 1 ? '' : 's'} `
            + `${pruned.length === 1 ? 'has' : 'have'} stopped occurring`
            + `${write ? ' and been removed from the baseline' : ''}.`);
    }

    if (failing) {
        const plural = failing === 1 ? '' : 's';
        console.error(`${check.name} ${gate ? 'GATE FAILED' : 'WOULD REFUSE A BUILD'}: ${failing} `
            + `blocking finding${plural}. These mint entities omcValidate rejects, so there is `
            + 'nothing to accept — fix the edge in the Edge Editor, or fix the schema.');
    } else {
        line(`${check.name}: nothing blocking`
            + `${warnings ? `, ${warnings} warning${warnings === 1 ? '' : 's'} outstanding` : ''}.`);
    }
    line('');
    return {
        failing, warnings, fresh, pruned,
    };
}
