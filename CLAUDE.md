# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**omcUtil** is a shared ES module library for working with OMC-JSON (Ontology for Media Creation) — the standard data format for media production metadata. It provides utilities for entity manipulation, schema validation, migration, GraphQL query building, and an in-memory entity SDK.

Published as `omc-util` on npm. Uses `.mjs` extensions throughout. Entry point: `index.mjs`, type definitions: `types.mjs`.

## Commands

```bash
npm run jsdoc         # Generate JSDoc docs (output: docs/jsdoc/)
npm run build:types   # Generate .d.ts declarations via tsc (output: types/)
```

No test suite is configured (`npm test` is a placeholder).

## Code Style

ESLint flat config (`eslint.config.js`) with Airbnb-inspired rules:
- 4-space indentation, single quotes, always semicolons, trailing commas in multiline
- `prefer-const`, `no-var`, `prefer-template`, `prefer-arrow-callback`
- Import ordering: builtin > external > internal > parent > sibling > index, alphabetized, newlines between groups
- Unused vars are warnings (prefix unused args with `_`)

## Architecture

### Public API (index.mjs)

All exports are organized into namespaced modules:

| Export | Module | Purpose |
|--------|--------|---------|
| `omcCompare` | `src/omc/compare.mjs` | Deep-diff two entities → `{$create, $remove, $update}` |
| `omcEdges` | `src/omc/edges.mjs` | Extract edges/relationships; distinguish base vs intrinsic (capitalized) properties |
| `omcFind` | `src/omc/find.mjs` | Filter entities by nested criteria |
| `omcMigrate` | `src/omc/migrate.mjs` | Migrate entities across schema versions (v2.0 → v2.6 → v2.x) |
| `omcTransform` | `src/omc/transform.mjs` | `toArray`, `toObject`, `unEmbed`, `deDuplicate` |
| `omcIdentifier` | `src/omc/omcIdentifier.mjs` | Create, merge, find, match identifiers (uses `nanoid`) |
| `omcGraphQl` | `src/omc/omcGraphQl/` | Build GraphQL queries from entity templates |
| `omcValidate` | `src/omc/validate.mjs` | Validate against JSON schemas (v2.0–v2.8, via `ajv`) |
| `omcSDK` | `src/omcModel/omcSDK.mjs` | In-memory entity cache with add/remove/retrieve/transform |
| `entityModel` | `src/omcModel/entityModel.mjs` | Prototype model extending entities with edge/property methods |
| `generalConfig` | `src/config/generalConfig.mjs` | Entity metadata: colors, labels, ID prefixes |
| `graphQlTemplate` | `src/config/v2-8/` | Entity template definitions for GraphQL |
| `inverseEdges` | `src/config/v2-8/inverseEdges.mjs` | Bidirectional edge mappings (e.g., `needs` ↔ `neededBy`) |
| `edgeTable` | `src/config/v2-8/entityEdges.mjs` | Complete edge/relationship definitions per entity type |

### Key Architectural Concepts

**Entity structure**: Every OMC entity has base properties (`schemaVersion`, `identifier`, `entityType`, `name`, `description`, `annotation`, `tag`, `customData`, `instanceInfo`) plus entity-specific properties.

**Intrinsic vs base properties**: Capitalized property keys (e.g., `Context`, `Depiction`, `Asset`) are "intrinsic" — they represent edges/relationships to other entities. Lowercase keys are base or entity-specific data. The `omcEdges` module uses this convention to separate structural relationships from data.

**Entity templates** (`src/config/v2-8/`): Each entity type has a template defining its `properties`, `intrinsicProps` (edge metadata with type, path, allowed targets, bidirectionality), `edges` (predicate → allowed entity types), `graphQl` (filterable fields), and `idPrefix`.

**omcSDK cache**: Maintains an in-memory store keyed by identifier. Handles de-duplication, identifier mapping, and edge cleanup on entity removal. Wraps entities in `entityModel` prototypes to add convenience methods.

**Context entities**: Special entity type for expressing relationships. Contains a `ForEntity` reference (subject) and edge predicates pointing to related entities. The `inverse()` function generates reverse relationships.

### Directory Layout

- `src/omc/` — Core stateless utilities (compare, edges, find, identifier, migrate, transform, validate)
- `src/omc/omcGraphQl/` — GraphQL query builder (`queryBuilder`, `queryUtil`, `graphQlSnippets`)
- `src/omc/migration/` — Schema migration implementations (`v2-0tov2-6.mjs`, `v2-6tov2-x.mjs`)
- `src/omcModel/` — Stateful entity model and SDK
- `src/config/` — Entity configuration, templates, and edge definitions
- `src/config/v2-8/` — v2.8 schema templates organized by domain (asset, infrastructure, mediaCreation, participant, task, utility)
- `src/mlHelpers/` — Internal helpers (`makeArray`, `isPlainObject`, `deepSpread`, etc.) — excluded from JSDoc and type generation
- `src/schema/` — JSON Schema files for validation (v2.0, v2.1, v2.6, v2.8)
- `test/` — Test data organized by schema version

## JSDoc Conventions

- Types are defined in `types.mjs` and resolved globally by JSDoc — do **not** use `@typedef {import('./path').Type}` (that's TypeScript-only syntax and breaks JSDoc v4)
- No blank lines between closing `*/` and function declarations (breaks JetBrains IDE association)
- Use `@returns` not `@return`
- Namespace hierarchy: `OMC` for types, `OmcUtil` for the library, individual `@module` tags per file
