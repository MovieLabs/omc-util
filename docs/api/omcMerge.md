<a name="module_omcMerge"></a>

# omcMerge
Merge OMC entities, and answer what merging one into another would change.

A merge never removes, so only two things can happen to the entity being merged into: it gains a
value it did not have, or it meets a value it disagrees with. That is why `mergeChanges` — not a
structural diff — is the tool for "does this record carry new information?". A diff is symmetric
and reports absence as readily as contribution, so a record that is a strict subset of what is
already held reads as different while contributing nothing.

Merging is identity-aware throughout: entities that describe different things are refused rather
than combined, and arrays are matched on what their items are rather than on position, so the
same edge written as a bare reference on one side and an expanded entity on the other is one
edge and not two.


* [omcMerge](#module_omcMerge)
    * [~pathRoot(path)](#module_omcMerge..pathRoot) ⇒ <code>string</code>
    * [~typeCategory(value)](#module_omcMerge..typeCategory) ⇒ <code>string</code>
    * [~deepMerge(existing, incoming, [options], [path])](#module_omcMerge..deepMerge) ⇒ <code>object</code>
    * [~mergeEntity(omc1, omc2, [options])](#module_omcMerge..mergeEntity) ⇒ <code>OmcEntity</code> \| <code>false</code>
    * [~mergeChanges(existing, incoming, [options])](#module_omcMerge..mergeChanges) ⇒ <code>MergeChanges</code>
    * [~MergeChanges](#module_omcMerge..MergeChanges) : <code>Object</code>


* * *

<a name="module_omcMerge..pathRoot"></a>

## omcMerge~pathRoot(path) ⇒ <code>string</code>
The top-level property a dotted path belongs to.

`identifier[0].url` answers to `identifier`, `edges.has.Scene[1]` to `edges`. Splitting on the
first `.` or `[` is enough — OMC property names contain neither.

Exported because the paths in [MergeChanges](MergeChanges) are this module's format, so a consumer
grouping them by property would otherwise have to restate that format from outside.

**Kind**: inner method of [<code>omcMerge</code>](#module_omcMerge)  
**Returns**: <code>string</code> - The top-level property name, or `''` for an empty path  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | A path as reported in `MergeChanges.added` / `MergeChanges.updated` |

**Example**  
```js
pathRoot('AssetStructure[0].assetStructureType'); // 'AssetStructure'
```

* * *

<a name="module_omcMerge..typeCategory"></a>

## omcMerge~typeCategory(value) ⇒ <code>string</code>
Get the type category of a value for conflict detection

**Kind**: inner method of [<code>omcMerge</code>](#module_omcMerge)  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 


* * *

<a name="module_omcMerge..deepMerge"></a>

## omcMerge~deepMerge(existing, incoming, [options], [path]) ⇒ <code>object</code>
Deep merge two objects, traversing the entire structure and merging at the leaves.

- Recursively merges nested objects
- Arrays are compared without regard to order; existing order is preserved
- Keyed object arrays (`identifier`, `customData`, `annotation`, `tag`) merge on their key fields
- Relationship arrays merge on the **referenced identifier** (see mergeReferenceArray), so the
  same edge expressed as a bare reference and as a nested entity collapses to one
- Existing data is preserved unless incoming data overwrites it
- Type conflicts (e.g., string vs object) throw a TypeError, unless existing is null

**Kind**: inner method of [<code>omcMerge</code>](#module_omcMerge)  
**Returns**: <code>object</code> - - The merged object  
**Throws**:

- <code>TypeError</code> If a type conflict is detected between existing and incoming values, or if
  both sides declare an entityType or schemaVersion and they disagree


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| existing | <code>object</code> |  | The existing object (its data is preserved by default) |
| incoming | <code>object</code> |  | The incoming object to merge |
| [options] | <code>object</code> | <code>{}</code> | Merge options |
| [options.nullOverwrite] | <code>boolean</code> | <code>false</code> | When true, null in incoming replaces existing values |
| [options.prefer] | <code>&#x27;existing&#x27;</code> \| <code>&#x27;incoming&#x27;</code> | <code>&#x27;incoming&#x27;</code> | Which side wins when both hold a   value for the same property. Note this decides conflicts only: a property `existing` does not   have is filled from `incoming` either way, since that is a gap rather than a disagreement. |
| [options.exclude] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Top-level keys that keep their `existing` value   whatever `incoming` says. Top-level only, deliberately: excluding `entityType` at any depth   would stop a bare reference merging with the expanded entity for the same thing. |
| [options.emptyAsNull] | <code>boolean</code> | <code>false</code> | Treat `[]` and `{}` as null on both sides, and   write null in their place. Absent, null and empty all say "nothing is known", so an empty   container never wins over a populated one and `[]` against `{}` is not a type conflict. |
| [options.schemaVersion] | <code>string</code> |  | Schema version used to recognise relationship keys.   `mergeEntity` supplies it from the entities themselves; without it relationship arrays fall   back to structural comparison. |
| [path] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Internal: tracks the current property path for error messages |


* * *

<a name="module_omcMerge..mergeEntity"></a>

## omcMerge~mergeEntity(omc1, omc2, [options]) ⇒ <code>OmcEntity</code> \| <code>false</code>
Merge two OMC entities, reading the schema version off the entities themselves.

Two entities that describe different things are not merged: differing `entityType`, or a
`schemaVersion` both declare and disagree on, returns `false` rather than producing a record
that is half one thing and half another. A version mismatch is a migration to run, not a merge
to resolve. `schemaVersion` declared on one side only is not a conflict.

**Kind**: inner method of [<code>omcMerge</code>](#module_omcMerge)  
**Returns**: <code>OmcEntity</code> \| <code>false</code> - The merged entity, or false when the two cannot be merged  
**Throws**:

- <code>TypeError</code> As deepMerge, including an identity mismatch on a nested reference


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| omc1 | <code>OmcEntity</code> |  | The existing entity |
| omc2 | <code>OmcEntity</code> |  | The incoming entity |
| [options] | <code>object</code> | <code>{}</code> | Merge options, as deepMerge |


* * *

<a name="module_omcMerge..mergeChanges"></a>

## omcMerge~mergeChanges(existing, incoming, [options]) ⇒ <code>MergeChanges</code>
Would merging `incoming` into `existing` change `existing` — and where?

The merge-semantics answer to "does this record carry new information?", and deliberately
ASYMMETRIC where a structural diff is symmetric. A record that is a strict subset of `existing`
carries nothing: a merge would not remove the surplus, so nothing changes. Only two things can
change `existing` — a value it did not have (`added`) and a value it had but disagrees with
(`updated`). There is no third category, because merge never removes.

Because the merge itself decides, the OMC conventions come along for free: identifier,
customData, annotation and tag are keyed on their key fields rather than compared whole;
relationship arrays are keyed on the REFERENCED identifier, so the same edge written as a bare
reference on one side and an expanded entity on the other is one edge, not two; and object key
order is irrelevant.

`prefer` decides who wins a conflict, and therefore what counts as a change:
  - `'incoming'` (default) — incoming wins, so `added` and `updated` both change `existing`
  - `'existing'` — existing wins every conflict, so ONLY `added` can change it

**Kind**: inner method of [<code>omcMerge</code>](#module_omcMerge)  
**Throws**:

- <code>TypeError</code> As mergeEntity — a type conflict, or an identity mismatch nested inside


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| existing | <code>OmcEntity</code> |  | The entity that would be changed |
| incoming | <code>OmcEntity</code> |  | The entity being merged in |
| [options] | <code>object</code> | <code>{}</code> | Merge options, passed through to mergeEntity |
| [options.prefer] | <code>&#x27;existing&#x27;</code> \| <code>&#x27;incoming&#x27;</code> | <code>&#x27;incoming&#x27;</code> | Which side wins a conflict |
| [options.exclude] | <code>Array.&lt;string&gt;</code> |  | Top-level keys neither merged nor reported. Defaults to   `omcTemplate.recordKeys()`; extend it as `[...omcTemplate.recordKeys(), ...yourKeys]`. |
| [options.emptyAsNull] | <code>boolean</code> | <code>true</code> | Treat `[]` and `{}` as null. Absent, empty and   null all say "nothing is known", so none of them is a contribution over another. |


* * *

<a name="module_omcMerge..MergeChanges"></a>

## omcMerge~MergeChanges : <code>Object</code>
The result of asking what merging one entity into another would change.

**Kind**: inner typedef of [<code>omcMerge</code>](#module_omcMerge)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| merged | <code>OmcEntity</code> \| <code>false</code> | The merged entity; false when the two cannot be merged |
| added | <code>Array.&lt;string&gt;</code> | Dotted paths the merge contributes that `existing` lacked |
| updated | <code>Array.&lt;string&gt;</code> | Dotted paths where the merge takes a value `existing` disagrees with |
| changed | <code>boolean</code> | Whether applying `merged` in place of `existing` would change it |
| status | <code>&#x27;merged&#x27;</code> \| <code>&#x27;incompatible&#x27;</code> \| <code>&#x27;no-entity&#x27;</code> | Why an empty result is empty |


* * *
