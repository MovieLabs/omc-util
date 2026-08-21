<a name="module_omcEdges"></a>

# omcEdges
Read and write the relationships an entity holds.

OMC stores a relationship in one of two places, and which one is a schema fact rather than
something to infer: the general case is `edges.<predicate>.<TargetType>[]`, but some are named
properties on the entity itself (`Asset.AssetStructure`). Both are covered here, and both are
resolved through the edge table rather than by reading the shape of the data — which is also why
`edgeCreate` returns falsy for an edge the schema does not allow, instead of writing it.

The separation these functions draw is between an entity's own data and its references to other
entities. `getBaseProps` gives the former, `getIntrinsicProps` and `relatedEdges` the latter.


* [omcEdges](#module_omcEdges)
    * _static_
        * [.getBaseKeys(omcEntity)](#module_omcEdges.getBaseKeys) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getBaseProps(omcEntity)](#module_omcEdges.getBaseProps) ⇒ <code>Object.&lt;string, \*&gt;</code>
        * [.getContextKeys(omcEntity)](#module_omcEdges.getContextKeys) ⇒ <code>Array.&lt;string&gt;</code> \| <code>null</code>
        * [.getIntrinsicKeys(omcEntity)](#module_omcEdges.getIntrinsicKeys) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getIntrinsicProps(omcEntity)](#module_omcEdges.getIntrinsicProps) ⇒ <code>Object.&lt;string, \*&gt;</code>
        * [.removeEdge(omcEntity, identifier)](#module_omcEdges.removeEdge) ⇒ <code>OmcEntity</code>
        * [.intrinsicAllowed(entityType)](#module_omcEdges.intrinsicAllowed) ⇒ <code>Array.&lt;OmcEntityType&gt;</code>
        * [.edgesAllowed(entityType)](#module_omcEdges.edgesAllowed) ⇒ <code>Array.&lt;OmcEntityType&gt;</code>
    * _inner_
        * [~chkIdentifier()](#module_omcEdges..chkIdentifier)
        * [~edgeValid(params)](#module_omcEdges..edgeValid) ⇒ <code>Object</code> \| <code>null</code>
        * [~edgeCreate(params)](#module_omcEdges..edgeCreate)


* * *

<a name="module_omcEdges.getBaseKeys"></a>

## omcEdges.getBaseKeys(omcEntity) ⇒ <code>Array.&lt;string&gt;</code>
Return an array containing property keys that are present and part of the base entity

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>Array.&lt;string&gt;</code> - - An array of property names present in the entity  

| Param | Type |
| --- | --- |
| omcEntity | <code>OmcEntity</code> | 


* * *

<a name="module_omcEdges.getBaseProps"></a>

## omcEdges.getBaseProps(omcEntity) ⇒ <code>Object.&lt;string, \*&gt;</code>
Return an object containing just base entity properties and their values

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - - Base properties and values present on the entity  

| Param | Type |
| --- | --- |
| omcEntity | <code>OmcEntity</code> | 


* * *

<a name="module_omcEdges.getContextKeys"></a>

## omcEdges.getContextKeys(omcEntity) ⇒ <code>Array.&lt;string&gt;</code> \| <code>null</code>
If the entityType is a Context, return an array containing property keys that specific to that Context

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>Array.&lt;string&gt;</code> \| <code>null</code> - - An array of property names present on the entity, or null if not a Context  

| Param | Type |
| --- | --- |
| omcEntity | <code>OmcEntity</code> | 


* * *

<a name="module_omcEdges.getIntrinsicKeys"></a>

## omcEdges.getIntrinsicKeys(omcEntity) ⇒ <code>Array.&lt;string&gt;</code>
Return an array containing intrinsic property keys that are present on the entity

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>Array.&lt;string&gt;</code> - - An array of intrinsic property names present on the entity  

| Param | Type |
| --- | --- |
| omcEntity | <code>OmcEntity</code> | 


* * *

<a name="module_omcEdges.getIntrinsicProps"></a>

## omcEdges.getIntrinsicProps(omcEntity) ⇒ <code>Object.&lt;string, \*&gt;</code>
Recurses through an omcEntity and returns a flattened map of all the intrinsic properties
that have valid references

intrinsic props that are singletons will be coerced into an array

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  

| Param | Type | Description |
| --- | --- | --- |
| omcEntity | <code>OmcEntity</code> | The entity for which you want the intrinsic props |


* * *

<a name="module_omcEdges.removeEdge"></a>

## omcEdges.removeEdge(omcEntity, identifier) ⇒ <code>OmcEntity</code>
Remove an identifier representing the edge to another entity from anywhere it is included in the entity

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>OmcEntity</code> - The original entity with matching edges removed  

| Param | Type | Description |
| --- | --- | --- |
| omcEntity | <code>OmcEntity</code> | The entity from which the edge is to be removed |
| identifier | <code>OmcEntity</code> \| <code>OmcIdentifier</code> | The entity or the identifier of the edge to be removed |


* * *

<a name="module_omcEdges.intrinsicAllowed"></a>

## omcEdges.intrinsicAllowed(entityType) ⇒ <code>Array.&lt;OmcEntityType&gt;</code>
Returns an array of the entity types this entity can have an edge to as per the ontology

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>Array.&lt;OmcEntityType&gt;</code> - An Array of the entity types this type may have an edge to  

| Param | Type | Description |
| --- | --- | --- |
| entityType | <code>OmcEntityType</code> | The entityType for which you wish to know the entities it can have an edge to. |


* * *

<a name="module_omcEdges.edgesAllowed"></a>

## omcEdges.edgesAllowed(entityType) ⇒ <code>Array.&lt;OmcEntityType&gt;</code>
Returns an array of the entity types this entity can have an edge to as per the ontology

**Kind**: static method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>Array.&lt;OmcEntityType&gt;</code> - An Array of the entity types this type may have an edge to  

| Param | Type | Description |
| --- | --- | --- |
| entityType | <code>OmcEntityType</code> | The entityType for which you wish to know the entities it can have an edge to. |


* * *

<a name="module_omcEdges..chkIdentifier"></a>

## omcEdges~chkIdentifier()
Helper functions for edgeCreate

**Kind**: inner method of [<code>omcEdges</code>](#module_omcEdges)  

* * *

<a name="module_omcEdges..edgeValid"></a>

## omcEdges~edgeValid(params) ⇒ <code>Object</code> \| <code>null</code>
Tests if an edge between two entityTypes is valid as per OMC and returns that edge or null

**Kind**: inner method of [<code>omcEdges</code>](#module_omcEdges)  
**Returns**: <code>Object</code> \| <code>null</code> - - An array of the valid entityTypes the fromEntity may connect to  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.fromEntity | <code>OmcEntity</code> | The entity from which the edge is from |
| params.toEntity | <code>OmcEntity</code> | The entity from which the edge is to |
| params.forEntity | <code>OmcEntity</code> | If toEntity is a Context, this is the entity which the Context is related to |


* * *

<a name="module_omcEdges..edgeCreate"></a>

## omcEdges~edgeCreate(params)
Creates a new edge from one entity to another, based on the allowed edges for the entity
- Setting the 'inverse' property will also create the inverse edge in the toEntity if applicable
- Some entities have multiple properties where the same toEntity is allowed, using the intrinsicEdge property allows a specific property to be targeted

**Kind**: inner method of [<code>omcEdges</code>](#module_omcEdges)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.fromEntity | <code>OmcEntity</code> | The entity on which to create the new edge |
| params.toEntity | <code>OmcEntity</code> | The entity to which the edge should be created |
| params.forEntity | <code>OmcEntity</code> | The entity which a Context is for, when the fromEntity is a Context |
| params.intrinsicEdge | <code>Object</code> | Specify a specific edge, for entities that have multiple valid edge patterns, this denotes the specific one to use |
| params.inverse | <code>boolean</code> | Whether the inverse edge should also be set if there is one |


* * *
