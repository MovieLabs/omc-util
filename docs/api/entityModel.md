<a name="module_entityModel"></a>

# entityModel
Wrap a single OMC entity so its own accessors can be called as methods.

The entity's properties are copied onto an object whose prototype carries the
[omcEdges](#module_omcEdges) readers, so `entity.getIntrinsicProps()` replaces
`getIntrinsicProps(entity)`. Nothing is computed or cached at wrap time and the behaviour is
exactly that of the underlying functions — this is a calling convention, not a second
implementation. [omcSDK](#module_omcSDK) wraps the entities it holds this way, over a shallow
copy, so a change to a wrapped entity does not reach the object it was built from.


* [entityModel](#module_entityModel)
    * _static_
        * [.EntityModel](#module_entityModel.EntityModel)
    * _inner_
        * [~entityModel(omcEntity)](#module_entityModel..entityModel) ⇒ <code>EntityModel</code>
        * [~EntityModelMethods](#module_entityModel..EntityModelMethods) : <code>Object</code>


* * *

<a name="module_entityModel.EntityModel"></a>

## entityModel.EntityModel
A set of methods for conducting operations on a single OMC entity

**Kind**: static typedef of [<code>entityModel</code>](#module_entityModel)  

* * *

<a name="module_entityModel..entityModel"></a>

## entityModel~entityModel(omcEntity) ⇒ <code>EntityModel</code>
**Kind**: inner method of [<code>entityModel</code>](#module_entityModel)  

| Param | Type |
| --- | --- |
| omcEntity | <code>OmcEntity</code> | 


* * *

<a name="module_entityModel..EntityModelMethods"></a>

## entityModel~EntityModelMethods : <code>Object</code>
**Kind**: inner typedef of [<code>entityModel</code>](#module_entityModel)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| getBaseKeys | <code>function</code> | [getBaseKeys](#module_omcEdges.getBaseKeys) |
| getBaseProps | <code>function</code> | [getBaseProps](#module_omcEdges.getBaseProps) |
| getIntrinsicKeys | <code>function</code> | [getIntrinsicKeys](#module_omcEdges.getIntrinsicKeys) |
| getIntrinsicProps | <code>function</code> | [getIntrinsicProps](#module_omcEdges.getIntrinsicProps) |
| getContextKeys | <code>function</code> | [getContextKeys](#module_omcEdges.getContextKeys) |
| getContextProps | <code>function</code> | [module:omcEdges.getContextProps](module:omcEdges.getContextProps) |


* * *
