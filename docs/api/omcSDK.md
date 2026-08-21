<a name="module_omcSDK"></a>

# omcSDK
Creates a document model for OMC


* [omcSDK](#module_omcSDK)
    * _static_
        * [.subscribe(listener)](#module_omcSDK.subscribe) ⇒ <code>function</code>
        * [.getVersion()](#module_omcSDK.getVersion) ⇒ <code>number</code>
        * [.set(omc)](#module_omcSDK.set) ⇒ <code>Array.&lt;OmcEntity&gt;</code> \| <code>null</code>
        * [.remove(omc, options)](#module_omcSDK.remove)
        * [.removeWithEdges(omc)](#module_omcSDK.removeWithEdges)
        * [.internalId(omcEntity, options)](#module_omcSDK.internalId)
        * [.omcSDK()](#module_omcSDK.omcSDK) ⇒ <code>OmcStore</code>
    * _inner_
        * [~replace(omc)](#module_omcSDK..replace) ⇒ <code>\*</code> \| <code>null</code>
        * [~get(omcId, options)](#module_omcSDK..get) ⇒ <code>OmcEntity</code>


* * *

<a name="module_omcSDK.subscribe"></a>

## omcSDK.subscribe(listener) ⇒ <code>function</code>
Subscribe to cache mutations. The listener is called after any of `set`, `replace`,
`remove`, `removeWithEdges` or `reset` changes the store.

The listener takes no arguments — it is a signal that the store moved, not a diff.
Read the new state back through `exportModel` / `get` / `find`, and pair with
[getVersion](getVersion) when a cheap change-token is needed.

**Kind**: static method of [<code>omcSDK</code>](#module_omcSDK)  
**Returns**: <code>function</code> - Unsubscribe; safe to call more than once  

| Param | Type |
| --- | --- |
| listener | <code>function</code> | 

**Example**  
```js
const stop = model.subscribe(() => render(model.exportModel()));
stop();
```

* * *

<a name="module_omcSDK.getVersion"></a>

## omcSDK.getVersion() ⇒ <code>number</code>
A counter incremented on every store mutation — a cheap change-token that changes
exactly when the store does.

**Kind**: static method of [<code>omcSDK</code>](#module_omcSDK)  

* * *

<a name="module_omcSDK.set"></a>

## omcSDK.set(omc) ⇒ <code>Array.&lt;OmcEntity&gt;</code> \| <code>null</code>
Set, or create, new entities in the store

Entities are normalized on the way in (see [cleanEntity](cleanEntity)), so nothing reading the store
ever has to ask which spelling of "empty" it is looking at.

Returns **what the store now holds**, not what was handed in. Those differ in two ways that
matter: the stored copy is normalized, and on an identifier collision `add` keeps the entity
already there. A caller that carries its own copy onward — into change history, or a save
payload — would otherwise be carrying something the store disagrees with.

**Kind**: static method of [<code>omcSDK</code>](#module_omcSDK)  
**Returns**: <code>Array.&lt;OmcEntity&gt;</code> \| <code>null</code> - The stored entities, or null for bad input  

| Param | Type |
| --- | --- |
| omc | <code>OmcJson</code> | 


* * *

<a name="module_omcSDK.remove"></a>

## omcSDK.remove(omc, options)
Remove OMC entities that exist in the internal cache

**Kind**: static method of [<code>omcSDK</code>](#module_omcSDK)  

| Param | Type |
| --- | --- |
| omc | <code>OmcEntity</code> | 
| options | <code>Object</code> | 


* * *

<a name="module_omcSDK.removeWithEdges"></a>

## omcSDK.removeWithEdges(omc)
Remove OMC entities that exist in the internal cache

**Kind**: static method of [<code>omcSDK</code>](#module_omcSDK)  

| Param | Type |
| --- | --- |
| omc | <code>OmcEntity</code> | 


* * *

<a name="module_omcSDK.internalId"></a>

## omcSDK.internalId(omcEntity, options)
Return the internal identifier used by the cache, this can be useful for applications using the Model
as this will serve as a single identifier that is already mapped to omc identifiers.

**Kind**: static method of [<code>omcSDK</code>](#module_omcSDK)  

| Param | Type |
| --- | --- |
| omcEntity | <code>OmcEntity</code> | 
| options | <code>Object</code> | 


* * *

<a name="module_omcSDK.omcSDK"></a>

## omcSDK.omcSDK() ⇒ <code>OmcStore</code>
**Kind**: static method of [<code>omcSDK</code>](#module_omcSDK)  

* * *

<a name="module_omcSDK..replace"></a>

## omcSDK~replace(omc) ⇒ <code>\*</code> \| <code>null</code>
Set or add an entity to the cache

**Kind**: inner method of [<code>omcSDK</code>](#module_omcSDK)  

| Param | Type |
| --- | --- |
| omc | <code>OmcJson</code> | 


* * *

<a name="module_omcSDK..get"></a>

## omcSDK~get(omcId, options) ⇒ <code>OmcEntity</code>
Get an entity stored in the cache

**Kind**: inner method of [<code>omcSDK</code>](#module_omcSDK)  

| Param | Type |
| --- | --- |
| omcId | <code>OmcIdentifier</code> | 
| options |  | 


* * *
