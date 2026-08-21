<a name="module_omcFind"></a>

# omcFind
Find entities that match a set of criteria passed in the filter


* [omcFind](#module_omcFind)
    * [~isMatch()](#module_omcFind..isMatch)
    * [~omcFind(arr, template, [options])](#module_omcFind..omcFind) ⇒ <code>Array.&lt;OmcEntity&gt;</code>


* * *

<a name="module_omcFind..isMatch"></a>

## omcFind~isMatch()
Check if a value matches a template value.
- Primitives: strict equality
- Arrays in template: at least one template element must match at least one element in the target
- Objects: all template keys must match recursively

**Kind**: inner method of [<code>omcFind</code>](#module_omcFind)  

* * *

<a name="module_omcFind..omcFind"></a>

## omcFind~omcFind(arr, template, [options]) ⇒ <code>Array.&lt;OmcEntity&gt;</code>
Find all objects in an array that match a template.
Only fields present in the template are compared.

**Kind**: inner method of [<code>omcFind</code>](#module_omcFind)  
**Returns**: <code>Array.&lt;OmcEntity&gt;</code> - - All matching objects  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>Array.&lt;OmcEntity&gt;</code> |  | Array of JSON objects to search |
| template | <code>Object</code> |  | Template object defining the match criteria |
| [options] | <code>Object</code> |  | Options |
| [options.normalize] | <code>boolean</code> | <code>false</code> | Trim whitespace and compare strings case-insensitively |

**Example**  
```js
// Find all NarrativeScene entities
omcFind(data, { entityType: 'NarrativeScene' });
```
**Example**  
```js
// Find characters named "Phoebe"
omcFind(data, { entityType: 'Character', characterName: { fullName: 'Phoebe' } });
```
**Example**  
```js
// Find entities with a specific identifier
omcFind(data, { identifier: [{ identifierScope: 'movielabs.com' }] });
```

* * *
