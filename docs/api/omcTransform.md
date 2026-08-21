<a name="module_omcTransform"></a>

# omcTransform
A set of methods for transforming and manipulating OMC-JSON


* [omcTransform](#module_omcTransform)
    * [.deDuplicate(omc)](#module_omcTransform.deDuplicate) ⇒ <code>OmcJson</code>
    * [.toObject(omc)](#module_omcTransform.toObject) ⇒ <code>OmcJson</code>
    * [.toArray(omc)](#module_omcTransform.toArray) ⇒ <code>OmcJson</code>
    * [.unEmbed(omc)](#module_omcTransform.unEmbed) ⇒ <code>OmcJson</code>
    * [.cleanEntity(omcEntity)](#module_omcTransform.cleanEntity) ⇒ <code>OmcEntity</code>


* * *

<a name="module_omcTransform.deDuplicate"></a>

## omcTransform.deDuplicate(omc) ⇒ <code>OmcJson</code>
De-Duplicate a set of entities based on their shared identifiers

**Kind**: static method of [<code>omcTransform</code>](#module_omcTransform)  

| Param | Type | Description |
| --- | --- | --- |
| omc | <code>OmcJson</code> | Valid Omc-Json |


* * *

<a name="module_omcTransform.toObject"></a>

## omcTransform.toObject(omc) ⇒ <code>OmcJson</code>
Convert Omc-Json from an array or single instance to the OMC object(map) format

**Kind**: static method of [<code>omcTransform</code>](#module_omcTransform)  

| Param | Type | Description |
| --- | --- | --- |
| omc | <code>OmcJson</code> | Valid Omc-Json |


* * *

<a name="module_omcTransform.toArray"></a>

## omcTransform.toArray(omc) ⇒ <code>OmcJson</code>
Convert Omc-Json array from the object(map) format

**Kind**: static method of [<code>omcTransform</code>](#module_omcTransform)  
**Returns**: <code>OmcJson</code> - - Omc-Json in the Array format  

| Param | Type | Description |
| --- | --- | --- |
| omc | <code>OmcJson</code> | Valid Omc-Json |


* * *

<a name="module_omcTransform.unEmbed"></a>

## omcTransform.unEmbed(omc) ⇒ <code>OmcJson</code>
Creates flattened Omc-Json with an array of single entities
Nested entities in the original OmsJson are removed and replaced with references

**Kind**: static method of [<code>omcTransform</code>](#module_omcTransform)  
**Returns**: <code>OmcJson</code> - - Omc-Json with all nested entities replaced with a reference and the entities at the top level of the array  

| Param | Type | Description |
| --- | --- | --- |
| omc | <code>OmcJson</code> | Valid Omc-Json |


* * *

<a name="module_omcTransform.cleanEntity"></a>

## omcTransform.cleanEntity(omcEntity) ⇒ <code>OmcEntity</code>
Normalize an entity so that everything absent is expressed the same way — as null.

OMC data arrives from spreadsheets, form fields, GraphQL responses and hand-edited JSON, and each
of them says "nothing here" differently: `''`, `[]`, `{}`, an object of nulls, or the property
simply missing. Left alone those differences are indistinguishable from content — an empty string
merges over a real value, an empty array reads as an answer, and comparing two entities that hold
the same information reports a difference. One spelling for absence removes all of that.

Applied to every entity entering [omcSDK](omcSDK), so consumers of the store never have to ask
which spelling they are looking at.

Returns a new entity; the original is never modified, and nested values are rebuilt rather than
shared, so a caller still holding the input keeps it intact.

**Kind**: static method of [<code>omcTransform</code>](#module_omcTransform)  
**Returns**: <code>OmcEntity</code> - A new entity with every absence expressed as null  

| Param | Type | Description |
| --- | --- | --- |
| omcEntity | <code>OmcEntity</code> | The entity to normalize |

**Example**  
```js
cleanEntity({ label: 'Scene 4', name: '', creativeWorkTitle: [{ titleName: '  ' }] });
// { label: 'Scene 4', name: null, creativeWorkTitle: null }
```

* * *
