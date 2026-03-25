/**
 * Post-build step for type generation.
 *
 * `tsc --emitDeclarationOnly` emits one declaration file per source file in the
 * program, not just for the package's public API. Because the root entrypoint
 * re-exports config modules that in turn import many internal templates, type
 * generation fans out into low-value declaration files for those internals.
 *
 * 1. Copies globals.d.ts into types/ so consumers can load it
 * 2. Prepends a /// <reference> directive to types/index.d.mts so
 *    TypeScript automatically loads the ambient types for consumers
 * 3. Removes declaration files that are not reachable from the package's
 *    public type entrypoints
 */

import {
    copyFileSync,
    existsSync,
    readdirSync,
    readFileSync,
    rmdirSync,
    unlinkSync,
    writeFileSync,
} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const PACKAGE_JSON = 'package.json';
const TYPES_DIR = 'types';
const GLOBALS_SRC = 'globals.d.ts';
const GLOBALS_DEST = path.join(TYPES_DIR, 'globals.d.ts');
const INDEX_DTS = path.join(TYPES_DIR, 'index.d.mts');
const REFERENCE = '/// <reference path="./globals.d.ts" />\n';
const DECLARATION_FILE_PATTERN = /\.d\.(?:cts|mts|ts)$/;
const MODULE_TO_DECLARATION_EXT = new Map([
    ['.cjs', '.d.cts'],
    ['.cts', '.d.cts'],
    ['.mjs', '.d.mts'],
    ['.mts', '.d.mts'],
    ['.js', '.d.ts'],
    ['.ts', '.d.ts'],
]);
const compilerOptions = loadCompilerOptions();
// Reuse TypeScript's own resolver so the prune step follows the same
// NodeNext rules that declaration emit used to produce the graph.
const moduleResolutionHost = ts.createCompilerHost(compilerOptions);

// Copy globals.d.ts into types/
copyFileSync(GLOBALS_SRC, GLOBALS_DEST);

// Prepend reference directive to the generated entry point
const content = readFileSync(INDEX_DTS, 'utf8');
if (!content.startsWith(REFERENCE)) {
    writeFileSync(INDEX_DTS, REFERENCE + content);
}

pruneUnreachableTypeArtifacts();

function pruneUnreachableTypeArtifacts() {
    // Seed the walk with the package's public type entrypoints, then keep
    // only declarations that are reachable from that surface area.
    const entryFiles = collectPublicTypeEntrypoints()
        .map((file) => path.resolve(file))
        .filter((file) => existsSync(file));
    const reachableFiles = collectReachableDeclarations(entryFiles);

    listTypeArtifacts(path.resolve(TYPES_DIR)).forEach((file) => {
        if (!reachableFiles.has(file)) {
            unlinkSync(file);
        }
    });

    pruneEmptyDirectories(path.resolve(TYPES_DIR));
}

function collectPublicTypeEntrypoints() {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'));
    const entryFiles = new Set();

    const addTarget = (target) => {
        const declarationTarget = packageTargetToDeclaration(target);
        if (declarationTarget) {
            entryFiles.add(declarationTarget);
        }
    };

    // `exports` entries can be plain strings, arrays of fallback targets, or
    // conditional export objects such as `{ types, import, default }`.
    const visitExportTarget = (target) => {
        if (!target) return;

        if (typeof target === 'string') {
            addTarget(target);
            return;
        }

        if (Array.isArray(target)) {
            target.forEach(visitExportTarget);
            return;
        }

        if (typeof target === 'object') {
            if (typeof target.types === 'string') {
                addTarget(target.types);
            }

            Object.entries(target)
                .filter(([key]) => key !== 'types')
                .forEach(([, value]) => visitExportTarget(value));
        }
    };

    if (typeof pkg.types === 'string') {
        addTarget(pkg.types);
    }

    visitExportTarget(pkg.exports);

    return [...entryFiles];
}

function packageTargetToDeclaration(target) {
    if (typeof target !== 'string') return null;

    const normalizedTarget = target.startsWith('./') ? target.slice(2) : target;
    if (DECLARATION_FILE_PATTERN.test(normalizedTarget)) {
        return normalizedTarget;
    }

    // Export targets point at runtime files, while the prune pass needs the
    // corresponding emitted declaration file as a graph root.
    const extension = path.posix.extname(normalizedTarget);
    const declarationExtension = MODULE_TO_DECLARATION_EXT.get(extension);
    if (!declarationExtension) {
        return null;
    }

    return path.posix.join(
        TYPES_DIR,
        `${normalizedTarget.slice(0, -extension.length)}${declarationExtension}`,
    );
}

function collectReachableDeclarations(entryFiles) {
    const reachableFiles = new Set();
    const pendingFiles = [...entryFiles];

    while (pendingFiles.length > 0) {
        const currentFile = pendingFiles.pop();
        if (!currentFile || reachableFiles.has(currentFile)) {
            continue;
        }

        reachableFiles.add(currentFile);

        const currentContent = readFileSync(currentFile, 'utf8');

        extractDeclarationReferences(currentContent).forEach((reference) => {
            const resolvedReference = resolveDeclarationReference(currentFile, reference);
            if (resolvedReference && !reachableFiles.has(resolvedReference)) {
                pendingFiles.push(resolvedReference);
            }
        });
    }

    return reachableFiles;
}

function extractDeclarationReferences(content) {
    // `preProcessFile` misses `export * as ns from "./file.mjs"`, which this
    // package uses in the root entrypoint. Walk the real AST instead.
    const sourceFile = ts.createSourceFile(
        'types.d.mts',
        content,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
    );
    const references = sourceFile.referencedFiles.map(({ fileName }) => ({
        kind: 'path',
        specifier: fileName,
    }));

    const visit = (node) => {
        if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
            // Matches `import ... from "x"` and both `export ... from "x"`
            // and `export * as ns from "x"` forms.
            const specifier = node.moduleSpecifier;
            if (specifier && ts.isStringLiteral(specifier)) {
                references.push({
                    kind: 'module',
                    specifier: specifier.text,
                });
            }
        } else if (ts.isImportEqualsDeclaration(node)) {
            // Matches legacy `import foo = require("x")` style declarations.
            const reference = node.moduleReference;
            if (ts.isExternalModuleReference(reference)
                && reference.expression
                && ts.isStringLiteral(reference.expression)
            ) {
                references.push({
                    kind: 'module',
                    specifier: reference.expression.text,
                });
            }
        } else if (ts.isImportTypeNode(node)
            && ts.isLiteralTypeNode(node.argument)
            && ts.isStringLiteral(node.argument.literal)
        ) {
            // Matches inline type imports such as `import("x").SomeType`.
            references.push({
                kind: 'module',
                specifier: node.argument.literal.text,
            });
        }

        ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return references;
}

function resolveDeclarationReference(fromFile, reference) {
    if (reference.kind === 'module') {
        // Module references come from import/export syntax and need full
        // TypeScript resolution so `.mjs` specifiers map back to emitted
        // `.d.mts` files under NodeNext rules.
        const resolvedModule = ts.resolveModuleName(
            reference.specifier,
            fromFile,
            compilerOptions,
            moduleResolutionHost,
        ).resolvedModule;

        return resolvedModule?.resolvedFileName || null;
    }

    // Triple-slash path references bypass module resolution and point directly
    // at another declaration file on disk.
    const resolvedPath = path.resolve(path.dirname(fromFile), reference.specifier);
    return existsSync(resolvedPath) ? resolvedPath : null;
}

function listTypeArtifacts(dir) {
    if (!existsSync(dir)) {
        return [];
    }

    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return listTypeArtifacts(fullPath);
        }

        return DECLARATION_FILE_PATTERN.test(entry.name) ? [fullPath] : [];
    });
}

function pruneEmptyDirectories(dir) {
    readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        if (entry.isDirectory()) {
            pruneEmptyDirectories(path.join(dir, entry.name));
        }
    });

    if (dir !== path.resolve(TYPES_DIR) && readdirSync(dir).length === 0) {
        rmdirSync(dir);
    }
}

function loadCompilerOptions() {
    // Reuse the repo's actual compiler options so resolution stays aligned
    // with the declaration emit configuration.
    const configPath = ts.findConfigFile('.', ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
        return defaultCompilerOptions();
    }

    const readResult = ts.readConfigFile(configPath, ts.sys.readFile);
    if (readResult.error) {
        throw new Error(ts.formatDiagnostic(readResult.error, createDiagnosticHost()));
    }

    const parsedConfig = ts.parseJsonConfigFileContent(
        readResult.config,
        ts.sys,
        path.dirname(configPath),
    );

    if (parsedConfig.errors.length > 0) {
        throw new Error(
            ts.formatDiagnostics(parsedConfig.errors, createDiagnosticHost()),
        );
    }

    return parsedConfig.options;
}

function defaultCompilerOptions() {
    return {
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
    };
}

function createDiagnosticHost() {
    return {
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: () => process.cwd(),
        getNewLine: () => '\n',
    };
}
