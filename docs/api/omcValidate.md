<a name="module_omcValidate"></a>

# omcValidate
Validate OMC JSON against the schema


* [omcValidate](#module_omcValidate)
    * [module.exports(omc, [options])](#exp_module_omcValidate--module.exports) ⏏
        * _static_
            * [.omcValidate(omc, options)](#module_omcValidate--module.exports.omcValidate) ⇒ <code>Array.&lt;ValidationResult&gt;</code>
        * _inner_
            * [~ValidationOptions](#module_omcValidate--module.exports..ValidationOptions) : <code>Object</code>
            * [~ValidationResult](#module_omcValidate--module.exports..ValidationResult) : <code>Object</code>


* * *

<a name="exp_module_omcValidate--module.exports"></a>

## module.exports(omc, [options]) ⏏
**Kind**: Exported function  

| Param | Type |
| --- | --- |
| omc | <code>OmcJson</code> | 
| [options] | <code>ValidationOptions</code> | 


* * *

<a name="module_omcValidate--module.exports.omcValidate"></a>

### module.exports.omcValidate(omc, options) ⇒ <code>Array.&lt;ValidationResult&gt;</code>
Validates OmcJson against the OMC schema

- Each entity in an array are validated separately
- Nested entities are validated in a single validation, mixing different schema versions in nested entities could cause validation errors
- Setting options.atomic to true, will evaluate all entities after validation and only respond true if all entities pass
- Setting options.schemaVersion to a specific schema, regardless of what the entity was encoded in, will validate against that version

**Kind**: static method of [<code>module.exports</code>](#exp_module_omcValidate--module.exports)  
**Overload**:   

| Param | Type | Description |
| --- | --- | --- |
| omc | <code>OmcJson</code> | Valid JSON to be validated |
| options | <code>ValidationOptions</code> | Must have `atomic: false` to produce a per-entity result array |


* * *

<a name="module_omcValidate--module.exports..ValidationOptions"></a>

### module.exports~ValidationOptions : <code>Object</code>
**Kind**: inner typedef of [<code>module.exports</code>](#exp_module_omcValidate--module.exports)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [atomic] | <code>boolean</code> | <code>true</code> | When true, all entities must pass or result is false |
| [schemaVersion] | <code>string</code> \| <code>null</code> | <code>null</code> | The schema version to validate against if not the native schema of the entity |


* * *

<a name="module_omcValidate--module.exports..ValidationResult"></a>

### module.exports~ValidationResult : <code>Object</code>
**Kind**: inner typedef of [<code>module.exports</code>](#exp_module_omcValidate--module.exports)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| valid | <code>boolean</code> | Whether this entity passed validation or not |
| error | <code>Object</code> \| <code>null</code> | The error report from the validator or null if no error |
| omcEntity | <code>OmcEntity</code> | The entity that was being validated |


* * *
