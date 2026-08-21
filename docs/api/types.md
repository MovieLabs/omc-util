<a name="OMC"></a>

# OMC : <code>object</code>
Type definitions for the Ontology for Media Creation

**Kind**: global namespace  

* [OMC](#OMC) : <code>object</code>
    * [.OmcIdentifier](#OMC.OmcIdentifier) : <code>Object</code>
    * [.OmcEntityType](#OMC.OmcEntityType) : <code>string</code>
    * [.OmcCustomData](#OMC.OmcCustomData) : <code>Object</code>
    * [.OmcAnnotation](#OMC.OmcAnnotation) : <code>Object</code>
    * [.OmcTag](#OMC.OmcTag) : <code>Object</code>
    * [.OmcInstanceInfo](#OMC.OmcInstanceInfo) : <code>Object</code>
    * [.OmcEntity](#OMC.OmcEntity) : <code>Object</code>
    * [.OmcJson](#OMC.OmcJson) : <code>Array.&lt;OmcEntity&gt;</code> \| <code>Object.&lt;string, (Array.&lt;OmcEntity&gt;\|OmcEntity)&gt;</code>
    * [.OmcStore](#OMC.OmcStore) : <code>Object</code>


* * *

<a name="OMC.OmcIdentifier"></a>

## OMC.OmcIdentifier : <code>Object</code>
An identifier uniquely identifies an entity within a particular scope.

**Kind**: static typedef of [<code>OMC</code>](#OMC)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| identifierScope | <code>string</code> | The scope of the identifier |
| identifierValue | <code>string</code> | The value of the identifier |
| [combinedForm] | <code>string</code> | The conjunction of identifierScope & identifierValue, which should be globally unique |
| [url] | <code>string</code> | A URL for the identifier |


* * *

<a name="OMC.OmcEntityType"></a>

## OMC.OmcEntityType : <code>string</code>
Declaration of what type of OMC entity this instance represents.

**Kind**: static typedef of [<code>OMC</code>](#OMC)  

* * *

<a name="OMC.OmcCustomData"></a>

## OMC.OmcCustomData : <code>Object</code>
A user defined set of custom data in the payload of the instance, used where the formal schema lacks required properties.

**Kind**: static typedef of [<code>OMC</code>](#OMC)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> \| <code>null</code> | Indicates the set or system in which the custom data is relevant or defined. |
| namespace | <code>string</code> \| <code>null</code> | The namespace used by the custom data. |
| schema | <code>string</code> \| <code>null</code> | URL for the schema used by the custom data. |
| value | <code>\*</code> \| <code>null</code> | The user defined custom data. |


* * *

<a name="OMC.OmcAnnotation"></a>

## OMC.OmcAnnotation : <code>Object</code>
Human readable commentary, explanation, or information.

**Kind**: static typedef of [<code>OMC</code>](#OMC)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| author | <code>string</code> \| <code>null</code> | Who wrote or added this annotation |
| title | <code>string</code> \| <code>null</code> | A title for the note or annotation. |
| text | <code>string</code> \| <code>null</code> | The text of the note or annotation. |


* * *

<a name="OMC.OmcTag"></a>

## OMC.OmcTag : <code>Object</code>
A short string from a particular set, used for categorization and description.

**Kind**: static typedef of [<code>OMC</code>](#OMC)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> \| <code>null</code> | An indication of the set or system in which the tag values are relevant or defined. |
| value | <code>Array.&lt;string&gt;</code> \| <code>null</code> | A set of tags taken from the domain. |


* * *

<a name="OMC.OmcInstanceInfo"></a>

## OMC.OmcInstanceInfo : <code>Object</code>
Properties that describe information about this particular instance of an entity

**Kind**: static typedef of [<code>OMC</code>](#OMC)  

* * *

<a name="OMC.OmcEntity"></a>

## OMC.OmcEntity : <code>Object</code>
A single instance of an OMC entity

**Kind**: static typedef of [<code>OMC</code>](#OMC)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [schemaVersion] | <code>string</code> | Describes the version of OMC-JSON schema that was used to create this instance. |
| [identifier] | <code>Array.&lt;OmcIdentifier&gt;</code> |  |
| [entityType] | <code>OmcEntityType</code> |  |
| name | <code>string</code> \| <code>null</code> | A name for the entity, this is primarily for human consumption in things like user interfaces. It should not be considered a canonical name |
| description | <code>string</code> \| <code>null</code> | A brief description of the entity, primarily for human consumption |
| customData | <code>Array.&lt;OmcCustomData&gt;</code> \| <code>null</code> | A array of OmcCustomData |
| annotation | <code>Array.&lt;OmcAnnotation&gt;</code> \| <code>null</code> | An array of OmcAnnotation |
| tag | <code>Array.&lt;OmcTag&gt;</code> \| <code>null</code> |  |
| instanceInfo | <code>OmcInstanceInfo</code> \| <code>null</code> |  |
| key | <code>\*</code> | Properties specific to this instance of the entityType |


* * *

<a name="OMC.OmcJson"></a>

## OMC.OmcJson : <code>Array.&lt;OmcEntity&gt;</code> \| <code>Object.&lt;string, (Array.&lt;OmcEntity&gt;\|OmcEntity)&gt;</code>
A valid OMC data structure

**Kind**: static typedef of [<code>OMC</code>](#OMC)  

* * *

<a name="OMC.OmcStore"></a>

## OMC.OmcStore : <code>Object</code>
An in-memory store of OMC entities with methods for managing them

**Kind**: static typedef of [<code>OMC</code>](#OMC)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| internalId | <code>function</code> | Return the internal cache identifier for an entity |
| getInternalId | <code>function</code> | Get an entity by its internal cache identifier |
| get | <code>function</code> | Retrieve an entity from the cache by its OMC identifier |
| set | <code>function</code> | Add entities to the cache |
| remove | <code>function</code> | Remove an entity from the cache |
| removeWithEdges | <code>function</code> | Remove an entity and clean up edges referencing it |
| replace | <code>function</code> | Replace entities in the cache |
| reset | <code>function</code> | Clear the cache and return the store |
| exportModel | <code>function</code> | Export all cached entities as an array |
| find | <code>function</code> | Find entities in the cache matching a filter |
| subscribe | <code>function</code> | Register a listener called after any mutation; returns an unsubscribe function |
| getVersion | <code>function</code> | Return a counter that changes on every mutation, for cheap change detection |
| intrinsicProps | <code>function</code> | Get intrinsic properties for an entity |
| contextEdges | <code>function</code> | Get context edges for an entity |
| identifier | <code>Object</code> | Identifier utilities |


* * *
