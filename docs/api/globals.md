<a name="versionSchemas"></a>

# versionSchemas
The schema behind each version, for facts the hand-authored templates don't carry.

**Kind**: global constant  

* * *

<a name="derivedShapeVersions"></a>

# derivedShapeVersions
Versions whose entity shape is derived from the JSON Schema (see schemaDerive). Legacy
 versions fall back to the hand-authored template shape.

**Kind**: global constant  

* * *

<a name="edgeTables"></a>

# edgeTables
v2.8 edge tables — frozen snapshot.

v2.8 previously derived these by walking the inline `$edge` markers embedded in each
entity's hand-authored shape template. The shape is now derived from the JSON Schema,
so those templates were retired; this file preserves the exact edge output they produced.

**Kind**: global constant  

* * *

<a name="generalConfig"></a>

# generalConfig : [<code>OmcGeneralConfig</code>](#OmcGeneralConfig)
**Kind**: global constant  

* * *

<a name="inverseEdges"></a>

# inverseEdges
A table describing the inverse of all edges

**Kind**: global constant  

* * *

<a name="generalConfig"></a>

# generalConfig : [<code>OmcGeneralConfig</code>](#OmcGeneralConfig)
**Kind**: global constant  

* * *

<a name="validation"></a>

# validation
If you allow for named Object classes in the edge structure, you would have to define every one of these in JSON-schema,
along with the entity types they connect to. The alternative is to allow a completely permissive relationship structure,
i.e. if you use {*} for the predicate it becomes a list of all entity types, but that would mean you could name an
edge for a Character, but nest any entity class in the JSON.
- This also potentially limits people to extend the use of JSON, it gets harder to implement your own edges, or collections
etc, these would fail validation.

This creates a problem in graphQl, as you would need to have every query use an inline fragment for every nested entity,
this almost negates any point of using graphQl, or you maintain the constraint in graphQl and generate types from the
validation tables.

Using the pattern name in the OMC-JSON loses you semantic expressiveness in the JSON itself (constraints can still
be applied in a validator, and the information is encoded in the referenced entity). You could still find a way to include
some of the semantics in documentation, i.e. you talk about a Concept that uses the edgeBundle pattern.

How do you handle self-referencing, i.e. are you constraining what types of Collections certain Collections can include?

How are you constraining Context, since some of the constraints are about what type of entity the Context is for

**Kind**: global constant  

* * *

<a name="migrateContextProperties"></a>

# migrateContextProperties(contextProperties, contextType) ⇒ <code>Object</code> \| <code>null</code>
Move a Context's properties into the sub-type slot v3.0 expects.

`contextProperties` is the container in both versions, and stays where it is. What changed is
that v3.0 added a level inside it, keyed by the context's sub-type:

```
v2.6/v2.8   contextProperties: { shootDay: 1, shootDate: '2026-01-23' }
v3.0        contextProperties: { shootDay: { shootDay: 1, shootDate: '2026-01-23' } }
```

The schemas show the same definition relocated rather than redefined: v2.6 has
`contextProperties` → `anyOf` → `$ref …/$defs/shootDay`, while v3.0 has `contextProperties` →
`properties.shootDay` → the same `$ref`, and `$defs/shootDay` is identical between them. So
nothing is renamed and no value is converted — `shootDay` is typed `string | number | null` in
both, and a number stays a number. A wrapper is inserted, and that is all.

`shootDay` therefore appears twice at different levels: the outer is the slot name, the inner is
the day number.

Applied whatever the sub-type. v3.0 sets `additionalProperties: true` on `contextProperties`, so
a type the schema does not describe still validates, and a sub-type added later needs no change
here. Note the caller defaults a missing `contextType` to `'context'`, so a Context that declares
no type nests under a slot of that name — meaningless, but harmless, and not worth a special
case.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>null</code> - The v3.0 form, or the input untouched when there is nothing to do  

| Param | Type | Description |
| --- | --- | --- |
| contextProperties | <code>Object</code> \| <code>null</code> | The v2.x properties, if any |
| contextType | <code>string</code> | The context's sub-type, which names the slot |


* * *

<a name="setEdgesFromContext"></a>

# setEdgesFromContext(omc) ⇒ <code>OmcEntity</code>
Hoist edges carried on resolved Context entities onto the entity itself.

In v2.x edges for an entity were carried on a Context (e.g. features, has,
for). v3.x moves those edges directly onto the entity's `edges` property.
This helper expects `omc.Context` to already contain fully-resolved Context
entities (the client inlines them before calling migrate). Any item without
an entityType is treated as an unresolved reference and skipped.

Non-edge Context metadata (schemaVersion, entityType, identifier, name,
description, contextType, contextCategory, ForEntity) is stripped; whatever
remains on the Context is, by definition, an edge. When multiple Contexts
contribute edges they are deep-merged into a single `edges` object, and
merged on top of any pre-existing `edges` property on the entity.

**Kind**: global function  

| Param | Type |
| --- | --- |
| omc | <code>OmcEntity</code> | 


* * *

<a name="migrateIntrinsicToEdge"></a>

# migrateIntrinsicToEdge(omc, targetProp, entityType) ⇒ <code>\*</code>
For properties where we removed an intrinsic edge and replaced it with a regular edge, we need
to create the edge in one direction

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| omc | <code>OmcJson</code> |  |
| targetProp | <code>string</code> | This is the property name for the intrinsic edge and target entity type |
| entityType | <code>string</code> | The targets entityType, which may be different from targetProp value |


* * *

<a name="migrateName"></a>

# migrateName()
Populate the new name property on entities where it did not previously exist

**Kind**: global function  

* * *

<a name="migrateShape"></a>

# migrateShape()
The reference shape for some properties has been changed from a singleton to an array of references

**Kind**: global function  

* * *

<a name="migrateVersion"></a>

# migrateVersion()
Migrate the version information if there is any

**Kind**: global function  

* * *

<a name="migrateProvenance"></a>

# migrateProvenance()
Migrate Provenance, by creating a new entity.

**Kind**: global function  

* * *

<a name="OmcGeneralConfig"></a>

# OmcGeneralConfig
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | A broad grouping for the entity as it is used in the Ontology |
| idPrefix | <code>string</code> | A shortened prefix that can be used with the identifierValue |
| presentation | <code>Object</code> | Presentation configuration for UI's |
| presnetation.color | <code>string</code> | A color for representing the entity in UI's and charts |
| presentation.entityLabel | <code>string</code> | A entityLabel when displaying the entity in UI's and charts |
| presentation.entityLabelSuffix | <code>function</code> | A function for displaying a suffix to the entityLabel based on an instance |


* * *

<a name="OmcGeneralConfig"></a>

# OmcGeneralConfig
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| group | <code>string</code> | A broad grouping for the entity as it is used in the Ontology |
| idPrefix | <code>string</code> | A shortened prefix that can be used with the identifierValue |
| [mergeKey] | <code>Array.&lt;string&gt;</code> | Property path(s) whose value(s) can be treated as unique   within a project, so they can substitute for an identifier when combining data from multiple   sources into one canonical instance (matching an existing entity, or deterministically minting   an id). An ordered composite key; omit or leave empty when the entity type has no merge key. |
| presentation | <code>Object</code> | Presentation configuration for UI's |
| presnetation.color | <code>string</code> | A color for representing the entity in UI's and charts |
| presentation.entityLabel | <code>string</code> | A entityLabel when displaying the entity in UI's and charts |
| presentation.entityLabelSuffix | <code>function</code> | A function for displaying a suffix to the entityLabel based on an instance |


* * *
