# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

> Cross-repo context — how omc-util is shared, and the OMC knowledge this library encodes — is in
> the parent `MovieLabs-POC/CLAUDE.md`, which loads alongside this file.

---

## What this is

**omcUtil** (package `omc-util`) is a shared ES module library for working with OMC-JSON — the
**Ontology for Media Creation**, MovieLabs' standard data format for media production metadata. It
provides entity manipulation, schema validation, migration, source→OMC mapping, GraphQL query
building, and an in-memory entity SDK.

Currently **v1.4.0**. Plain `.js` ESM throughout — there are **no `.mjs` files**. Entry point
`index.js`; type declarations under `types/`.

**Not published to any registry.** Consumers install straight from the git repo by tag, e.g.
`git+https://github.com/MovieLabs/omc-util.git#semver:^1.4.0`, and work against a local checkout
with `npm link`, which never touches their manifest.

This library is intended to be published publicly, and is consumed by Labkoat-Portal, Labkoat-fMam,
Labkoat-API and Data-Pipeline. **Treat every change as additive** unless you have checked each one.

---

## Commands

```bash
npm run docs            # Markdown API reference → docs/api/
npm run build:types     # .d.ts declarations via tsc → types/
npm run release:check   # build:types + every gate below

npm run test:mergerefs    # relationship-array merge guard
npm run test:mergechanges # mergeChanges behaviour
npm run test:cleanentity  # cleanEntity behaviour
npm run test:validate     # omcValidate across the three accepted OMC shapes
npm run test:mergekeys    # mergeKey / shape guard
npm run test:mapping      # omcMapping engine
npm run test:derive       # schema-derivation parity (deriveParity + deriveLinkml + mergeKeys)
npm run test:registry     # the four places an entity type must agree
npm run edges:coverage    # the edge definitions against what the schema declares
npm run edges:inverse     # every edge's inverse resolves, and fMam can write it
npm run edges:missing     # what the parked edges.js holds that the publication does not
npm run edges:parity      # TRANSITIONAL — the built table against a snapshot of edges.js
npm run derive:dump       # dump derived facts, for eyeballing
```

There is no unified test runner. The `test:*` scripts are standalone node scripts that exit non-zero
on failure; `npm test` is a placeholder that just fails. Nothing is wired to CI — this repo has no
workflow.

**The edge table is what the Edge Editor published, and nothing else.**
`src/templates/v3-0/edgeDefinitions.json` is that publication; drop in a fresh export and the
shipped table follows. `edges.js` is **parked**: it is the hand-written set the tool was seeded
from, it reaches nothing on the path to the shipped table, and `buildEdgeTable` has no default
definitions so nothing can fall back to it by omission. `npm run edges:missing` lists what it
still holds that the publication does not — the worklist for the tool, not a fallback.

**The `edges:*` checks read what the Edge Editor produces.** With no arguments they try a running
API (`OMC_EDGES_URL`, or localhost:8080, with `LABKOAT_TOKEN` as the bearer — the route is
authenticated), then `test/omc-v3-0/omc-edges.json`, which is the name the Edge Editor's UI gives
its export and where to drop it. If neither is there they fail rather than substituting anything.
The export's age is printed with it, and it is gitignored: it is a snapshot of live state, so
commit one only if you want a fixed reference. `--candidate` takes a URL, a document or a module.

**A live source reports; only a fixed one gates.** Live content changes between runs, so a failure
would mean somebody edited an edge, not that the commit is wrong — and the accept files describe
`edges.js`, so they are not consulted for a live source. That is the intended direction of travel:
the published document becomes the table, and these checks are what it has to pass before it can.

`--shipped` is the subject `release:check` gates on: the union, which is what consumers are
handed. `--static` is the seed alone, which since the cut-over is a component of what ships rather
than what ships.

`edges:parity` is **transitional and deliberately not in `release:check`**. Its baseline is a
snapshot of the hand-written `edges.js`, so it drifts by design as the schema moves; it is for
seeing what a change moved, not for holding a line. Delete it once the published document is the
table. The document is fetched with `GET /api/vocab/v1/edges/publish?format=json` (authenticated),
or generated with no service in the path by `Labkoat-API/src/vocabulary/edges/generate.js`; nothing
refreshes it on its own, so a check is only ever as current as the file it is given.

---

## Architecture

### Public API (`index.js`)

| Export | Module | Purpose |
|---|---|---|
| `omcTemplate` | `src/templates/index.js` | **The schema oracle.** Everything a consumer must ask rather than derive — see below |
| `omcCompare` | `src/omc/omcCompare.js` | Deep-diff two entities → `{$create, $remove, $update}` |
| `omcMerge` | `src/omc/omcMerge.js` | `deepMerge`, `mergeEntity`, `mergeChanges` — merging, and "does this carry new information?" |
| `omcEdges` | `src/omc/omcEdges.js` | `edgeCreate`, `edgeValid`, `removeEdge`, and the base/intrinsic/context key splits |
| `omcFind` | `src/omc/omcFind.js` | Filter entities by nested criteria |
| `omcIdentifier` | `src/omc/omcIdentifier.js` | `idCreate`, `idHash`, `idFromValue`, `idKey`, `idMerge`, `idCombinedForm`, … |
| `omcTransform` | `src/omc/omcTransform.js` | `toArray`, `toObject`, `unEmbed`, `deDuplicate`, `cleanEntity` |
| `omcMapping` | `src/omc/omcMapping/` | Source rows → OMC through a declarative template |
| `omcMigrate` | `src/omc/migration/omcMigrate.js` | Migrate entities across schema versions |
| `omcValidate` | `src/omc/validation/omcValidate.js` | Validate against the bundled JSON Schemas (via `ajv`) |
| `omcGraphQl` | `src/omc/omcGraphQl/` | Build GraphQL queries from entity templates |
| `omcSDK` | `src/omcModel/omcSDK.js` | In-memory entity cache with a `subscribe`/`getVersion` observer |
| `entityModel` | `src/omcModel/entityModel.js` | Prototype model extending entities with edge/property methods |

`package.json` also declares an `exports` subpath map (`omc-util/merge`, `/identifier`, `/sdk`, …)
so a consumer can import one module without pulling the index.

### Directory layout

```
index.js                     # public surface
types.js                     # global JSDoc typedefs (NOT types.mjs)
src/
├── omc/                     # stateless utilities
│   ├── omcCompare.js  omcEdges.js  omcFind.js  omcIdentifier.js
│   ├── omcMerge.js    omcTransform.js
│   ├── omcGraphQl/          # queryBuilder, queryUtil, graphQlSnippets
│   ├── omcMapping/          # mapRow, createRun, check, entity, shapedValue
│   ├── migration/           # omcMigrate + v2-0tov2-6, v2-6tov2-8, v2-8tov3-0
│   └── validation/          # omcValidate + schema/*.json (v2.0–v3.0, + LinkML)
├── omcModel/                # omcSDK.js, entityModel.js — the stateful layer
├── templates/               # the schema oracle
│   ├── index.js             # omcTemplate — assembles per-version tables
│   ├── schemaDerive.js      # derives shapes/facts from a JSON Schema
│   ├── schemaFacts.js       # build-time cardinality extraction
│   ├── v2-8/                # hand-authored templates, by domain
│   └── v3-0/                #   asset, infrastructure, mediaCreation,
│                            #   participant, task, utility
└── mlHelpers/util.js        # internal helpers; excluded from docs and types
test/                        # test data + the standalone test scripts
docs/api/                    # generated Markdown reference
types/                       # generated + committed .d.ts
claude/                      # JSDoc review notes (not shipped)
```

### Key concepts

**`omcTemplate` is the point of the library.** It answers, per `{ schemaVersion, entityType }`:
`edgeTable`, `shape`, `presentation`, `schemaGroup`, `allSchemaGroups`, `idPrefix`, `mergeKey`,
`allEntityTypes`, `graphQl`, `graphQlEntities`, `inverseEdge`, plus the version-agnostic
`versionLabel`, `isRelationshipKey`, `referenceTemplate`, `metaKeys` and `recordKeys`. Consumers ask
these rather than restating them. `generalConfig`, `inverseEdges`, `edgeTable` and `graphQlTemplate`
are **not** top-level exports — they are reached through `omcTemplate`.

**Versions.** Templates exist for v2-8 (serving v2.1, v2.6 and v2.8) and v3-0. Schemas are bundled
for v2.0, v2.1, v2.6, v2.8, v3.0 and LinkML.

**Shape is derived, not hand-written, for v2.8 and v3.0.** `schemaDerive.js` walks the bundled JSON
Schema; legacy versions fall back to the hand-authored template shape. Cardinality comes from
`schemaFacts.js` at build time, so template and schema cannot drift.

**Intrinsic vs base properties.** Capitalized property keys are relationships; lowercase are data.
Ask `omcTemplate.isRelationshipKey({ key })` — do not reimplement the convention.

**omcSDK cache.** An in-memory store keyed by identifier, handling de-duplication, identifier
mapping and edge cleanup on removal. It wraps entities in `entityModel` prototypes.

**Graceful nulls.** `presentation`, `schemaGroup`, `shape` and `referenceTemplate` return `null`
rather than throwing for an unknown schema version or entityType. Consumers routinely ask about
entities loaded from *other* schema versions, and a throw there takes down a render.

---

## Hard rules

**omcUtil owns OMC knowledge; consumers must never restate it.** Entity types, edge keys,
cardinality, identifier prefixes, schema-version URLs used to branch, conventions like "a capitalised
key is a relationship" — all of it is maintained here, in exactly one place. If a consumer needs a
fact it cannot ask for, add the accessor here rather than hardcoding it there.

**omcUtil stays framework-agnostic — never React-aware.** Where reactivity is needed, expose a plain
observer (`omcSDK.subscribe` / `getVersion`) and let consumers adapt it.

**omcUtil does not own what a consumer does with its own data.** The test is: *would this answer be
the same for every consumer of the schema?* If yes it belongs here; if it depends on the shape or
provenance of a particular dataset, it does not. (This is why the Portal's `resolveContext` must
stay in the Portal.)

**Treat every change as additive.** Consumers pick up releases independently, and Data-Management
holds a vendored copy that gets nothing.

**An entity type must be registered, not just declared.** The schema, the schema's own `rootEntity`
enum, `generalConfig` and the v3-0 barrel all have to agree, and three of the four is the easy
mistake — the type then reaches no consumer, silently. `npm run test:registry` compares them.
**The full procedure — all four places, what the schema derives versus what is hand-authored, the
edge-path rule that decides whether an entity validates, and fMam's boot-order constraint — is in
the `omc-entity-type` skill. Read it before adding or changing an entity type or an edge.**

---

## Releasing

`types/` is **committed**, and there is deliberately no `prepare` hook — a git install must not have
to run `tsc`, which would drag the full typescript devDependency into consumers' Docker builds. That
means declarations only refresh when someone runs `build:types`, so they can drift from source.

```bash
npm run release:check          # regenerate types + run the guards
git add -A && git commit       # types/ changes must be committed BEFORE versioning
npm version minor              # bumps package.json, commits, creates tag vX.Y.Z
git push --follow-tags
```

Consumers then `npm update omc-util` and commit their lockfile.

### Traps

- **`files` in `package.json` is an allow-list**, and it applies to git installs too — it is what
  keeps `test/` and `docs/` out of what consumers download. **Any new top-level directory consumers
  need at runtime must be added there, or it silently will not ship.**
- **A tag is not "latest".** The consumer's lockfile pins an exact commit; picking up a new release
  is deliberately two steps.
- Consumers record git deps as `git+ssh://` in their lockfile however they are declared, so images
  rely on npm's HTTPS fallback. Do not "fix" a consumer's Dockerfile to `npm ci` on that basis.

---

## Code style

ESLint flat config (`eslint.config.js`) with Airbnb-inspired rules:

- 4-space indentation, single quotes, always semicolons, trailing commas in multiline
- `prefer-const`, `no-var`, `prefer-template`, `prefer-arrow-callback`
- Import ordering: builtin → external → internal → parent → sibling → index, alphabetized, newlines
  between groups
- Unused vars are warnings (prefix unused args with `_`)

### JSDoc conventions

- Types are defined in `types.js` and resolved globally by JSDoc — do **not** use
  `@typedef {import('./path').Type}` (TypeScript-only syntax; it breaks JSDoc v4)
- No blank lines between closing `*/` and the function declaration (breaks JetBrains IDE association)
- Use `@returns`, not `@return`
- Namespace hierarchy: `OMC` for types, `OmcUtil` for the library, an `@module` tag per file
- Public interfaces must reach the TypeScript build; mark internals `@ignore` or exclude them —
  not `@private`, which `-a all` still emits
