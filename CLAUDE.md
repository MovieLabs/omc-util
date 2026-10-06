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

This library is intended to be published publicly, and is consumed by Labkoat-Portal, Labkoat-fMam
and Labkoat-API (whose `pipelines/` resolve its copy). **Treat every change as additive** unless
you have checked each one.

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
npm run test:registry     # the four places an entity type must agree, + the edge table's schema
npm run test:edgebuild    # bundled table = the build of its input; runtime install/reset round trip
npm run edges:check       # build the edges and report findings (--from, --api, --schema)
npm run edges:build       # gate, then write edgeTable.json (+ schema with --schema)
npm run derive:dump       # dump derived facts, for eyeballing
```

There is no unified test runner. The `test:*` scripts are standalone node scripts that exit non-zero
on failure; `npm test` is a placeholder that just fails. Nothing is wired to CI — this repo has no
workflow.

**The edge table is generated in one place and served in another.**

- **Serving** — `src/templates/`. `src/templates/v3-0/edgeTable.json` is the bundled default: the
  per-entity rows and the flat inverse map. **Do not edit it by hand.** A consumer may serve a
  different table at runtime with `omcTemplate.setEdgeTable({ schemaVersion, artifact, source })`,
  undo it with `resetEdgeTable`, ask `edgeTableSource` which is being served, and observe either with
  `omcTemplate.subscribe` / `getVersion` (the omcSDK observer shape). Installing replaces the
  version's entry in `versionTemplates` with one built from the bundled templates, so every accessor
  that reads edges follows it and a reset is exact; nothing else in the templates changes.
- **Generation** — `src/edgeBuild/`, exported as `omc-util/edge-build`. `buildEdgeArtifact(document,
  { schema })` turns the Edge Editor's publication (`GET /api/vocab/v1/edges/publish?format=json`)
  into an artifact of the same shape as `edgeTable.json`, with the coverage and inverse findings.
  Pure and browser-safe (it reads caps through `schemaFacts`, entities through `schemaDerive`), so the
  same code serves the CLI and a client trying a live publication. Never gates.
- **The CLI** — `tools/edges/`, node-only and outside `files`. `npm run edges:check` reports;
  `npm run edges:build` gates on `tools/edges/accept/*.txt` and, on a pass, writes
  `edgeTable.json`, the schema when `--schema` names one, and `tools/edges/input/omc-edges.json` (the
  document it was built from, which `test:edgebuild` rebuilds and compares). Sources: `--from
  <file|url>`, `--api` (`OMC_EDGES_URL`, `LABKOAT_TOKEN`), default the saved input. Paths resolve
  against `INIT_CWD`, so OMC-Development runs it in place:
  `npm --prefix ../../MovieLabs-POC/omcUtil run edges:build -- --schema OMC-JSON/OMC-JSON-v3.0.schema.json --from <export>`.

The table records a fingerprint of the schema it was built against (`src/edgeBuild/fingerprint.js`),
and `test:registry` fails (`EDGES-SCHEMA`) if that is not the schema bundled here: the rows'
`maxItems` were read from it. Copying a schema in by hand without rebuilding is what that catches.

Nothing supplements the publication. A relationship the tool has not modelled is absent from the
table rather than filled in from elsewhere, and the coverage check is where a gap shows.

**Placement belongs to the pairing, not the verb.** One verb reaches some ranges under
`edges.<verb>.*` and others as a named property — `has` does both — so a `connects` group states its
`placement` where it differs from the predicate's usual one, the same way it states a `path`. An
intrinsic relationship has no predicate in OMC-JSON, only a path, so its row carries the real
lower-case verb; the generator used to capitalise it to keep the two placements from colliding in a
publication keyed by predicate, and dropped every row that disagreed.

**`cxtEdges` is a v2.8 partition and is empty in v3.0** — the publication models neither `hasCxt`
nor `cxtFor`, and `Context` is not in the v3.0 table at all. Settled, not a gap.

**`edgeCreate` refuses a full slot, and writes nothing when it does.** The cap is `maxItems` on the
edge table, and it applies to the reverse as much as the forward side: `Realization.RealizationOf`
admits one reference, so a second NarrativeObject connected to the same Realization is refused even
though the forward slot has room. `edgeRefusal` takes the same parameters and returns the reason —
side, path, `maxItems`, `held`, and `holdsTarget` where the reference is already there. Every caller
already treated a falsy return as "not written", so refusing needs nothing of them; a caller with a
user to inform asks `edgeRefusal` as well.

**Ask for an inverse with `inverseEdgeFor`, not `inverseEdge`.** It takes the domain as well as the
edge and answers with an `InverseEdge` — bucket, path, segments and the cap on the slot — which is
what every row already carries. A flat map keyed by predicate alone cannot say that a reverse is an
intrinsic property (`memberOf` ↔ `assetStructureProperties.assetGroup.Member`), that a `connects`
group overrides it (`usedIn` inverts to `realizationOf` in general but to `uses` from Asset), or that
two pairs share a verb. The edge build's inverse check counts the pairs the two disagree on and gates
on an accept file that empties when fMam reads the accessor; `inverseEdge` is `@deprecated` and kept
until then.

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
so a consumer can import one module without pulling the index. `omc-util/edge-build` is reachable only that way: the
edge generator, kept off the main entry so a consumer that only reads edges never loads it.

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
│   └── v3-0/                #   asset, infrastructure, mediaCreation, participant, task,
│                            #   utility; edgeTable.json (generated — the bundled default)
├── edgeBuild/               # generation: publication → edge table (omc-util/edge-build)
└── mlHelpers/util.js        # internal helpers; excluded from docs and types
test/                        # test data + the standalone test scripts
tools/edges/                 # edges:check / edges:build CLI, accept files, last input (not shipped)
docs/api/                    # generated Markdown reference
types/                       # generated + committed .d.ts
claude/                      # JSDoc review notes (not shipped)
```

### Key concepts

**`omcTemplate` is the point of the library.** It answers, per `{ schemaVersion, entityType }`:
`edgeTable`, `shape`, `presentation`, `schemaGroup`, `allSchemaGroups`, `idPrefix`, `mergeKey`,
`allEntityTypes`, `graphQl`, `graphQlEntities`, `inverseEdge`, `inverseEdgeFor`, plus the version-agnostic
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
