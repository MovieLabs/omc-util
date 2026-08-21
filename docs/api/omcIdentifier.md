<a name="module_omcIdentifier"></a>

# omcIdentifier
Create, compare and merge the identifiers that give an OMC entity its identity.

An identifier is a `{ identifierScope, identifierValue }` pair and an entity may carry several,
so identity is a set-intersection question rather than an equality one — `idIsDuplicate` and
`hasMatching` are how it is asked. The rule the rest of the library leans on is that no two
entities in a model may share an identifier.

There are three ways to mint one, and the difference matters: `idCreate` generates a random
value, `idFromValue` wraps a value the caller already holds, and `idHash` hashes a seed so the
same source row always yields the same identifier — which is what lets a re-import update rather
than duplicate, and lets an edge point at an entity a later pass will build.


* [omcIdentifier](#module_omcIdentifier)
    * [.idOfScope(identifier, identifierScope)](#module_omcIdentifier.idOfScope) ⇒ <code>OmcIdentifier</code> \| <code>null</code>
    * [.idCreate(params)](#module_omcIdentifier.idCreate) ⇒ <code>OmcIdentifier</code>
    * [.idFromValue(params)](#module_omcIdentifier.idFromValue) ⇒ <code>OmcIdentifier</code>
    * [.idHash(params)](#module_omcIdentifier.idHash) ⇒ <code>OmcIdentifier</code>
    * [.idKey(identifier)](#module_omcIdentifier.idKey) ⇒ <code>string</code>
    * [.idCombinedForm(identifier, separator)](#module_omcIdentifier.idCombinedForm) ⇒ <code>string</code>
    * [.idIsDuplicate(targetId, sourceId)](#module_omcIdentifier.idIsDuplicate) ⇒ <code>boolean</code>
    * [.idMerge(targetId, mergeId)](#module_omcIdentifier.idMerge) ⇒ <code>Array.&lt;OmcIdentifier&gt;</code>
    * [.idRemove(targetId, removeId)](#module_omcIdentifier.idRemove) ⇒ <code>Array.&lt;OmcIdentifier&gt;</code>
    * [.hasMatching(targetIdentifier, matchIdentifier)](#module_omcIdentifier.hasMatching) ⇒ <code>Boolean</code>
    * [.find(omc, identifier)](#module_omcIdentifier.find) ⇒ <code>OmcEntity</code> \| <code>null</code>


* * *

<a name="module_omcIdentifier.idOfScope"></a>

## omcIdentifier.idOfScope(identifier, identifierScope) ⇒ <code>OmcIdentifier</code> \| <code>null</code>
OMC entities may have multiple identifiers, this returns the identifier of the requested scope if found

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>OmcIdentifier</code> \| <code>null</code> - - A single identifier if the scope is matched, null it not  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>Array.&lt;OmcIdentifier&gt;</code> | An array of OMC identifiers |
| identifierScope | <code>string</code> | The scope of the required identifierValue |

**Example**  
```js
idOfScope(
 [
    { identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt'},
    { identifierScope: 'labkoat.com', identifierValue: 'chr-bSvGGMtq55TRL8j'},
 ],
 'movielabs.com'
)
// returns { identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt'}
```

* * *

<a name="module_omcIdentifier.idCreate"></a>

## omcIdentifier.idCreate(params) ⇒ <code>OmcIdentifier</code>
Create a new OMC identifier with the requested scope and unique identifierValue with an optional prefix

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>OmcIdentifier</code> - An OMC identifier with the specified scope and new unique value  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.identifierScope | <code>string</code> | The scope of the identifier |
| [params.prefix] | <code>string</code> \| <code>null</code> | Optional prefix for the identifier value |
| [params.entityType] | <code>string</code> \| <code>null</code> | Uses a predefined prefix for the entityType [takes priority] |

**Example**  
```js
idCreate({ identifierScope: 'movielabs.com', entityType: 'Character' })
// returns {
//     identifierScope: 'movielabs.com',
//     identifierValue': 'chr-Yhq5EZz4zdQxgOt'
// }
```

* * *

<a name="module_omcIdentifier.idFromValue"></a>

## omcIdentifier.idFromValue(params) ⇒ <code>OmcIdentifier</code>
Build an OMC identifier around a value the caller already holds, applying the entityType's
prefix. Use this when identity is derived from something external and must stay readable in
the identifierValue — a content hash, a vendor's asset id, a filesystem key. Unlike
[idHash](idHash) the value is used verbatim, so it can still be read back off the identifier;
unlike [idCreate](idCreate) nothing is generated.

Two entityTypes given the same value stay distinct through their prefixes (e.g. an Asset and
its AssetStructure sharing one file hash become `ast-<value>` and `asts-<value>`), so a pair
built this way does not collide.

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>OmcIdentifier</code> - An OMC identifier wrapping the supplied value  
**Throws**:

- <code>Error</code> When no value is supplied — minting an identifier around a missing value
  would silently produce a colliding, meaningless identity


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.identifierScope | <code>string</code> | The scope of the identifier |
| params.value | <code>string</code> | The value used verbatim as the identifierValue body |
| [params.prefix] | <code>boolean</code> | Use the entityType's predefined prefix on the value |
| [params.entityType] | <code>string</code> \| <code>null</code> | Entity type, for the prefix |
| [params.schemaVersion] | <code>string</code> | Schema version for the prefix lookup |

**Example**  
```js
idFromValue({
    identifierScope: 'movielabs.com',
    value: '9e107d9d372bb6826bd81d3542a419d6',
    entityType: 'Asset',
    prefix: true,
})
// returns {
//     identifierScope: 'movielabs.com',
//     identifierValue: 'ast-9e107d9d372bb6826bd81d3542a419d6'
// }
```

* * *

<a name="module_omcIdentifier.idHash"></a>

## omcIdentifier.idHash(params) ⇒ <code>OmcIdentifier</code>
Create a stable, deterministic OMC identifier by hashing a seed value. The same seed always
produces the same identifierValue, so entities sharing a seed (e.g. a spreadsheet merge key)
de-duplicate and re-imports are idempotent. The entityType is folded into the hash so two
different types with the same seed stay distinct.

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>OmcIdentifier</code> - An OMC identifier whose value is stable for the given seed  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.identifierScope | <code>string</code> | The scope of the identifier |
| params.seed | <code>string</code> | The value hashed into a stable identifierValue |
| [params.prefix] | <code>boolean</code> | Use the entityType's predefined prefix on the value |
| [params.entityType] | <code>string</code> \| <code>null</code> | Entity type, for the prefix and the hash seed |
| [params.schemaVersion] | <code>string</code> | Schema version for the prefix lookup |

**Example**  
```js
idHash({ identifierScope: 'movielabs.com', seed: '2a', entityType: 'ProductionScene' })
// returns { identifierScope: 'movielabs.com', identifierValue: 'pscn-<stable hash>' }
```

* * *

<a name="module_omcIdentifier.idKey"></a>

## omcIdentifier.idKey(identifier) ⇒ <code>string</code>
Creates a globally unique key by combining the identifierScope and identifierValue of an OMC identifier

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>string</code> - A unique key  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>OmcIdentifier</code> | An OMC identifier |

**Example**  
```js
idKey({ identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt' })
// returns 'movielabs.com:chr-Yhq5EZz4zdQxgOt'
```

* * *

<a name="module_omcIdentifier.idCombinedForm"></a>

## omcIdentifier.idCombinedForm(identifier, separator) ⇒ <code>string</code>
Returns the combinedForm of an identifier which is the conjunction of its scope and value, this should be globally unique

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>string</code> - A unique key representing the combined form of the identifier  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>OmcIdentifier</code> | An OMC identifier |
| separator | <code>string</code> | An optional sting to be place between the scope and identifier |

**Example**  
```js
idCombinedForm({ identifierScope: 'movielabs.com', identifierValue: 'chr-Yhq5EZz4zdQxgOt' }, ':')
// returns 'movielabs.com:chr-Yhq5EZz4zdQxgOt'
```

* * *

<a name="module_omcIdentifier.idIsDuplicate"></a>

## omcIdentifier.idIsDuplicate(targetId, sourceId) ⇒ <code>boolean</code>
Test if an identifier from one entity already exists within a set of other entities

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>boolean</code> - Returns True when duplicate identifiers exist between the target and source identifiers  

| Param | Type | Description |
| --- | --- | --- |
| targetId | <code>Array.&lt;OmcIdentifier&gt;</code> | Set of target entities against which the source entity id's will be checked for matches |
| sourceId | <code>OmcIdentifier</code> | source entity, used to check against the target |


* * *

<a name="module_omcIdentifier.idMerge"></a>

## omcIdentifier.idMerge(targetId, mergeId) ⇒ <code>Array.&lt;OmcIdentifier&gt;</code>
Merge an identifier into an existing array of identifiers

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>Array.&lt;OmcIdentifier&gt;</code> - The merged set of identifiers  

| Param | Type |
| --- | --- |
| targetId | <code>Array.&lt;OmcIdentifier&gt;</code> | 
| mergeId | <code>OmcIdentifier</code> \| <code>Array.&lt;OmcIdentifier&gt;</code> | 


* * *

<a name="module_omcIdentifier.idRemove"></a>

## omcIdentifier.idRemove(targetId, removeId) ⇒ <code>Array.&lt;OmcIdentifier&gt;</code>
Remove an identifier from an existing array of identifiers

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>Array.&lt;OmcIdentifier&gt;</code> - The set with the identifier removed  

| Param | Type | Description |
| --- | --- | --- |
| targetId | <code>Array.&lt;OmcIdentifier&gt;</code> | The array of identifiers targeted for removal |
| removeId | <code>OmcIdentifier</code> | The identifier to be removed |


* * *

<a name="module_omcIdentifier.hasMatching"></a>

## omcIdentifier.hasMatching(targetIdentifier, matchIdentifier) ⇒ <code>Boolean</code>
Cross-check all identifiers in the targetIdentifier with those in the remove identifier
If any identifiers present in the targetIdentifier have a match in the removeIdentifier null is returned
indicating it should be removed

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>Boolean</code> - True if there are matching identifiers  

| Param | Type |
| --- | --- |
| targetIdentifier | <code>OmcEntity</code> \| <code>Array.&lt;OmcIdentifier&gt;</code> | 
| matchIdentifier | <code>OmcEntity</code> \| <code>Array.&lt;OmcIdentifier&gt;</code> | 


* * *

<a name="module_omcIdentifier.find"></a>

## omcIdentifier.find(omc, identifier) ⇒ <code>OmcEntity</code> \| <code>null</code>
Find an entity in a set of OMC entities by its identifier

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>OmcEntity</code> \| <code>null</code> - The matching entity or null  

| Param | Type | Description |
| --- | --- | --- |
| omc | <code>Array.&lt;OmcEntity&gt;</code> | Set of OMC entities to search |
| identifier | <code>OmcIdentifier</code> \| <code>Array.&lt;OmcIdentifier&gt;</code> | The identifier(s) to search for |


* * *
