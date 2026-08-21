<a name="module_omcCompare"></a>

# omcCompare
Compare two Omc Entities and return a description of the differences between the two

This comparison is symmetric, which makes it the wrong tool for "does the comparison entity
carry anything new?". `$remove` reports a property the *original* holds and the comparison
lacks — absence, not information — so an entity that is a strict subset of the original still
produces a non-empty diff. Use [mergeChanges](mergeChanges) for that question: it answers with merge
semantics, where the only possible outcomes are a value gained and a value disagreed with.


* [omcCompare](#module_omcCompare)
    * _static_
        * [.omcCompare(params)](#module_omcCompare.omcCompare) ⇒ <code>DiffResult</code>
    * _inner_
        * [~DiffResult](#module_omcCompare..DiffResult) : <code>Object</code>


* * *

<a name="module_omcCompare.omcCompare"></a>

## omcCompare.omcCompare(params) ⇒ <code>DiffResult</code>
Compares two OMC-JSON entities and returns the differences

If the two entities are no different, having the same properties and values, the diff property will be null in the response

If there are differences the diff property will contain an Object with just the properties that are different,
objects are compared without concern for the order of keys/properties.

The value of the properties contain an action such as $create or $remove that describes what you would need to do
to the original to make it equal with the comparison.

Primitive values are compared directly to one another
$remove - The property does not exist in the comparison and should be removed from the original.
$create - The property does not exist in the original and should be created.
$update - The property exists in both, but should be updated in the original

Arrays are compared, but ordering is not considered, a direct comparison of each value is made.
i.e. the two arrays ['1', '2'] and ['2', '1'] are considered equal.
$remove - The elements in the response should be removed from the corresponding array in the original.
$create - The elements in the response should be added to the corresponding array in the original.

Arrays of objects require the objects to be exactly alike to not be considered different.
In the case where two objects have the same key, but a different value, the entire object is considered
different, one would be removed, the other created.
i.e. in this example [{ a: '1'}, { b: '1' }] and [{ a: '1'}, { b: '2' }], the object with 'a' is considered the same
in both, and there is no action, the object 'b' is different, { b: '1' } would be removed and { b: '2' } created.

**Kind**: static method of [<code>omcCompare</code>](#module_omcCompare)  
**Returns**: <code>DiffResult</code> - The result of the comparison  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.original | <code>OmcEntity</code> | The source OMC entity |
| params.comparison | <code>OmcEntity</code> | The OMC entity to compare against the original |


* * *

<a name="module_omcCompare..DiffResult"></a>

## omcCompare~DiffResult : <code>Object</code>
Result of a difference comparison

**Kind**: inner typedef of [<code>omcCompare</code>](#module_omcCompare)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| original | <code>OmcEntity</code> | The original OMC entity |
| comparison | <code>OmcEntity</code> | The entity to which the original was compared |
| diff | <code>Object.&lt;string, ({$remove: \*}\|{$create: \*}\|{$update: \*})&gt;</code> \| <code>null</code> | null if same, or Object describing the difference |


* * *
