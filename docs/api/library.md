<a name="OmcUtil"></a>

# OmcUtil : <code>object</code>
A set of utilities useful when using OMC-JSON

**Kind**: global namespace  

* [OmcUtil](#OmcUtil) : <code>object</code>
    * [.omcTemplate](#OmcUtil.omcTemplate) : <code>OmcTemplate</code>
    * [.EntityConfiguration](#OmcUtil.EntityConfiguration) : <code>Object</code>
    * [.EntityTemplate](#OmcUtil.EntityTemplate) : <code>Object</code>
    * [.PropertyTemplate](#OmcUtil.PropertyTemplate)
    * [.EdgeTemplate](#OmcUtil.EdgeTemplate)
    * [.GraphQlTemplate](#OmcUtil.GraphQlTemplate) : <code>Object</code>
    * [.TemplateQuery](#OmcUtil.TemplateQuery) : <code>Object</code>
    * [.EdgeTable](#OmcUtil.EdgeTable) : <code>Object</code>
    * [.PresentationHeader](#OmcUtil.PresentationHeader) : <code>Object</code>
    * [.PresentationProps](#OmcUtil.PresentationProps) : <code>Array.&lt;string, function()&gt;</code>
    * [.Presentation](#OmcUtil.Presentation) : <code>Object</code>
    * [.SchemaGroups](#OmcUtil.SchemaGroups) : <code>Object.&lt;string, Array.&lt;OmcEntityType&gt;&gt;</code>
    * [.OmcTemplate](#OmcUtil.OmcTemplate) : <code>Object</code>


* * *

<a name="OmcUtil.omcTemplate"></a>

## OmcUtil.omcTemplate : <code>OmcTemplate</code>
Methods returning templated values based on the schema version

**Kind**: static constant of [<code>OmcUtil</code>](#OmcUtil)  

* * *

<a name="OmcUtil.EntityConfiguration"></a>

## OmcUtil.EntityConfiguration : <code>Object</code>
**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| schemaGroup | <code>string</code> |  |
| idPrefix | <code>string</code> |  |
| mergeKey | <code>Array.&lt;string&gt;</code> | Property path(s) unique within a project, usable as an identity substitute (see OmcTemplate.mergeKey). `[]` when the type has none. |
| presentation | <code>Object</code> |  |
| template | <code>EntityTemplate</code> |  |
| graphQl | <code>GraphQlTemplate</code> |  |


* * *

<a name="OmcUtil.EntityTemplate"></a>

## OmcUtil.EntityTemplate : <code>Object</code>
**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| property | <code>Object.&lt;string, PropertyTemplate&gt;</code> | The properties of the entity |


* * *

<a name="OmcUtil.PropertyTemplate"></a>

## OmcUtil.PropertyTemplate
**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type for this property (JSON-Schema syntax) |
| mergeKey | <code>boolean</code> | Set for properties that act as merge keys. |


* * *

<a name="OmcUtil.EdgeTemplate"></a>

## OmcUtil.EdgeTemplate
**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | How the reference is STORED on the source entity ('array' | 'object').   This is a storage shape, NOT a cardinality cap — in v3.0 every edge is stored as an array.   Use `maxItems` to ask "at most one?". |
| maxItems | <code>number</code> \| <code>undefined</code> | Cardinality cap from the JSON Schema; `undefined` means   uncapped. Derived at build time (see schemaFacts.js) so it cannot drift from the schema. |
| allowed | <code>Array.&lt;string&gt;</code> | The entity types allowed for this edge |
| path | <code>string</code> | The path on this entity (source) that the edge is stored |
| predicate | <code>string</code> | The predicate (RDF property family) this edge belongs to |
| bucket | <code>&#x27;edges&#x27;</code> \| <code>&#x27;intrinsic&#x27;</code> | Which partition the edge is stored in |
| pathSegments | <code>Array.&lt;string&gt;</code> | `path` pre-split, so consumers never split it themselves |
| containerSegments | <code>Array.&lt;string&gt;</code> | The object path that must exist before the reference   can be written: `pathSegments` minus its final segment (the range type for `edges.*` paths, or   the property name for an intrinsic one). `[]` for a top-level intrinsic property. |
| relativePath | <code>string</code> | `path` minus the bucket prefix (e.g. `hasCxt.Context`);   equal to `path` for intrinsic edges |
| inverse | <code>string</code> | The path on the target entity that carries the inverse edge |
| omcPredicate | <code>string</code> | The formal predicate for this edge, from RDF model |


* * *

<a name="OmcUtil.GraphQlTemplate"></a>

## OmcUtil.GraphQlTemplate : <code>Object</code>
**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| properties | <code>Object</code> | The properties that can be queried |
| filter | <code>Object</code> \| <code>null</code> | Properties that accept a graphQl filter |
| inlineFragment | <code>Object</code> \| <code>null</code> | Supplemental inline fragments needed on properties |


* * *

<a name="OmcUtil.TemplateQuery"></a>

## OmcUtil.TemplateQuery : <code>Object</code>
Parameters passed in to request template details

**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| schemaVersion | <code>string</code> | The schema version key (e.g., "v1.0.0") |
| entityType | <code>string</code> | The entity type key (e.g., "Asset", "Person") |


* * *

<a name="OmcUtil.EdgeTable"></a>

## OmcUtil.EdgeTable : <code>Object</code>
The details for all edges on a given entityType

**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| edges | <code>Object.&lt;OmcEntityType, EdgeTemplate&gt;</code> | Descriptions of the regular edges |
| intrinsic | <code>Object.&lt;OmcEntityType, EdgeTemplate&gt;</code> | Descriptions of the intrinsic edges |
| cxtEdges | <code>Object.&lt;OmcEntityType, EdgeTemplate&gt;</code> | Descriptions of the edges allowed in related Context |


* * *

<a name="OmcUtil.PresentationHeader"></a>

## OmcUtil.PresentationHeader : <code>Object</code>
Properties to be used when rendering the header section for an entity

**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| backgroudColor | <code>string</code> | Background color for header when rendering the entity as node or in a UI |
| fontColor | <code>string</code> | Font color for header when rendering the entity as node or in a UI |
| entityLabel | <code>string</code> | A label for the entityType |
| entityLabelSuffix | <code>function</code> | A suffix for use with the label, generally it's type (subclass) |


* * *

<a name="OmcUtil.PresentationProps"></a>

## OmcUtil.PresentationProps : <code>Array.&lt;string, function()&gt;</code>
Provides a set of suggested properties to display when rendering a node
Either the string indicating the property key, or a function that will return a string

**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  

* * *

<a name="OmcUtil.Presentation"></a>

## OmcUtil.Presentation : <code>Object</code>
A set of consistent values and methods useful when presenting an entity in a UI

**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type |
| --- | --- |
| header | <code>PresentationHeader</code> | 
| propRows | <code>PresentationProps</code> | 


* * *

<a name="OmcUtil.SchemaGroups"></a>

## OmcUtil.SchemaGroups : <code>Object.&lt;string, Array.&lt;OmcEntityType&gt;&gt;</code>
Schema groups with all the entities that belong in that group

**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  

* * *

<a name="OmcUtil.OmcTemplate"></a>

## OmcUtil.OmcTemplate : <code>Object</code>
**Kind**: static typedef of [<code>OmcUtil</code>](#OmcUtil)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| edgeTable | <code>function</code> | Returns the edge table definition for the given schema version and entity type. |
| shape | <code>function</code> | The entity's data shape derived from the JSON Schema (v2.8+), carrying `$type`, `$maxItems`, `$default`, `$required` and `$controlledValues` inline per property; edges (see edgeTable) and instanceInfo are excluded. Falls back to the hand-authored template for legacy versions; null when the entityType is unknown. |
| presentation | <code>function</code> | Returns the presentation details for an entityType, or null if the schema version or entityType is unknown. |
| versionLabel | <code>function</code> | The human-readable label for a schema version URL, e.g. 'v3.0'. Second argument is the fallback returned when there is no version (default 'unknown'). |
| isRelationshipKey | <code>function</code> | True when `key` names an entity reference (a relationship) rather than a data property. |
| referenceTemplate | <code>function</code> | The shape template of an entity reference (its identifier array), or null if the schema version is unknown. Required fields (identifierScope, identifierValue) are marked `$required`. |
| schemaGroup | <code>function</code> | Returns a group name for which the entityType belongs. |
| allSchemaGroups | <code>function</code> | Returns all entities in schema by their group |
| idPrefix | <code>function</code> | Returns a standard prefix for an entityType that can be used for identifierValue. |
| mergeKey | <code>function</code> | The property path(s) whose value(s) are unique within a project for this entityType, usable as an identity substitute when merging data from multiple sources. An ordered composite key; `[]` when the type has no merge key. |
| allEntityTypes | <code>function</code> | All entityTypes for this schema version |
| graphQl | <code>function</code> | Templates for construction graphQl queries using queryBuiler |
| graphQlEntities | <code>function</code> | An array of entityTypes that are available in the graphql schema for this version |
| metaKeys | <code>function</code> | The top-level envelope keys that do not identify an entity: the envelope (identifier, schemaVersion, entityType), the edge buckets (edges, Context) and the free-form extension keys (customData, annotation, tag). Excludes label/description/instanceInfo, which are data. Use it to skip non-identifying keys when treating an entity's own data as identity. |
| recordKeys | <code>function</code> | The keys that describe the record rather than the entity's data: schemaVersion and entityType. A subset of metaKeys answering a different question — identifier, edges, customData, annotation and tag all carry information, so they are not included. Use it to keep encoding drift out of a data-level comparison. |


* * *
