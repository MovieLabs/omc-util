<a name="module_omcIdentifier"></a>

# omcIdentifier
Create, compare and merge the identifiers that give an OMC entity its identity.

An identifier is a `{ identifierScope, identifierValue }` pair and an entity may carry several,
so identity is a set-intersection question rather than an equality one — `idIsDuplicate` and
`hasMatching` are how it is asked. The rule the rest of the library leans on is that no two
entities in a model may share an identifier.

`idMint` mints one: random, hashed from a value, or a value used as given.


* [omcIdentifier](#module_omcIdentifier)
    * [.idOfScope(identifier, identifierScope)](#module_omcIdentifier.idOfScope) ⇒ <code>OmcIdentifier</code> \| <code>null</code>
    * [.idUrls(identifier)](#module_omcIdentifier.idUrls) ⇒ <code>Array.&lt;{identifierScope: string, identifierValue: string, url: string}&gt;</code>
    * [.idMint(params)](#module_omcIdentifier.idMint) ⇒ <code>OmcIdentifier</code>
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

<a name="module_omcIdentifier.idUrls"></a>

## omcIdentifier.idUrls(identifier) ⇒ <code>Array.&lt;{identifierScope: string, identifierValue: string, url: string}&gt;</code>
The identifiers that carry a URL resolving them, typically a link to the entity in the system its
scope names. The URL is returned as written; whether it is safe to follow is the caller's to
decide.

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  
**Returns**: <code>Array.&lt;{identifierScope: string, identifierValue: string, url: string}&gt;</code> - One entry per
  identifier with a non-blank `url`, in the entity's order; empty when there are none  

| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>OmcEntity</code> \| <code>OmcIdentifier</code> \| <code>Array.&lt;OmcIdentifier&gt;</code> | An entity, or its identifiers |

**Example**  
```js
idUrls({
    identifier: [
        { identifierScope: 'labkoat.com', identifierValue: 'chr-bSvGGMtq55TRL8j' },
        { identifierScope: 'imdb.com', identifierValue: 'ch0000001', url: 'https://www.imdb.com/character/ch0000001/' },
    ],
})
// returns [{ identifierScope: 'imdb.com', identifierValue: 'ch0000001', url: 'https://www.imdb.com/character/ch0000001/' }]
```

* * *

<a name="module_omcIdentifier.idMint"></a>

## omcIdentifier.idMint(params) ⇒ <code>OmcIdentifier</code>
Mint an OMC identifier. The one minter: what varies is where the value comes from.

- **No `value`**: a random value.
- **`value`, `hash` true (the default)**: the value hashed (cyrb53, base-36), so the same value
  always yields the same identifier. Re-imports update rather than duplicate, and an edge can
  point at an entity a later pass builds.
- **`value`, `hash` false**: the value used as given, so it can be read back off the identifier
  (a content hash, a source system's own id).

The entityType's prefix is added after the value whenever `entityType` is given, and never
otherwise. Every entity type has its own prefix, so two types minted from one value stay
distinct without the type being hashed in.

**Kind**: static method of [<code>omcIdentifier</code>](#module_omcIdentifier)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  |  |
| params.identifierScope | <code>string</code> |  | The scope of the identifier |
| [params.value] | <code>string</code> |  | What the identifier is minted from; random when absent |
| [params.hash] | <code>boolean</code> | <code>true</code> | Hash `value` rather than use it as given |
| [params.entityType] | <code>string</code> \| <code>null</code> |  | Adds this type's prefix |
| [params.schemaVersion] | <code>string</code> |  | Schema version for the prefix lookup |

**Example**  
```js
idMint({ identifierScope: 'movielabs.com', value: 'wwdoat|1-1', entityType: 'ProductionScene' })
// returns { identifierScope: 'movielabs.com', identifierValue: 'pscn-<stable hash>' }

idMint({ identifierScope: 'movielabs.com', value: '9e107d9d372bb6826bd81d3542a419d6', hash: false, entityType: 'Asset' })
// returns { identifierScope: 'movielabs.com', identifierValue: 'ast-9e107d9d372bb6826bd81d3542a419d6' }
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
