<a name="module_omcGraphQl"></a>

# omcGraphQl
OMC Query Builder

Utilities for building and executing GraphQL queries for OMC entities.


* [omcGraphQl](#module_omcGraphQl)
    * _static_
        * [.queryBuilder(params)](#module_omcGraphQl.queryBuilder) ⇒ <code>string</code>
        * [.stripGraphQl(graphQlResponse)](#module_omcGraphQl.stripGraphQl) ⇒ <code>OmcJson</code>
        * [.queryVariables(entityType)](#module_omcGraphQl.queryVariables) ⇒ <code>Array.&lt;Object.&lt;string, string&gt;&gt;</code>
        * [.entityQueries()](#module_omcGraphQl.entityQueries) ⇒ <code>Array.&lt;{entityType: string, variables: Array.&lt;queryVariables&gt;}&gt;</code>
    * _inner_
        * [~QueryTemplate](#module_omcGraphQl..QueryTemplate) : <code>Object</code>


* * *

<a name="module_omcGraphQl.queryBuilder"></a>

## omcGraphQl.queryBuilder(params) ⇒ <code>string</code>
**Kind**: static method of [<code>omcGraphQl</code>](#module_omcGraphQl)  
**Returns**: <code>string</code> - A graphQl query string  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Parameters used for generating the query |
| params.entityType | <code>OmcEntityType</code> | The root entity type from which to start the query |
| params.template | <code>QueryTemplate</code> | The template for the query |
| params.variables | <code>QueryVariable</code> | Query variables to be included in the query as filters |


* * *

<a name="module_omcGraphQl.stripGraphQl"></a>

## omcGraphQl.stripGraphQl(graphQlResponse) ⇒ <code>OmcJson</code>
Strip the graphQl wrapper from a graphQl response and return the OmcJson

**Kind**: static method of [<code>omcGraphQl</code>](#module_omcGraphQl)  
**Returns**: <code>OmcJson</code> - The OmcJson in the graphQl query response  

| Param | Type | Description |
| --- | --- | --- |
| graphQlResponse | <code>Object</code> | The response from a graphQl query |
| graphQlResponse.data | <code>OmcJson</code> | Valid OMC-JSON |


* * *

<a name="module_omcGraphQl.queryVariables"></a>

## omcGraphQl.queryVariables(entityType) ⇒ <code>Array.&lt;Object.&lt;string, string&gt;&gt;</code>
For a given entityType returns the set of properties that can be filtered using a variable in graphQl query
The keys are the property name with the primitive type as the value

**Kind**: static method of [<code>omcGraphQl</code>](#module_omcGraphQl)  
**Returns**: <code>Array.&lt;Object.&lt;string, string&gt;&gt;</code> - Array of objects with property names as keys and their types as values  

| Param | Type |
| --- | --- |
| entityType | <code>OmcEntityType</code> | 

**Example**  
```js
queryVariables('Depiction');
// returns [
//    { "identifierScope": "string" },
//    { "identifierValue": "string" },
//    { "name": "string" },
//    { "depictionType": "string" }
// ]
```

* * *

<a name="module_omcGraphQl.entityQueries"></a>

## omcGraphQl.entityQueries() ⇒ <code>Array.&lt;{entityType: string, variables: Array.&lt;queryVariables&gt;}&gt;</code>
Returns a set of all entities for which a graphQl query can be made and for each entity the properties
that can be filtered using a variable in graphQl query

**Kind**: static method of [<code>omcGraphQl</code>](#module_omcGraphQl)  
**Returns**: <code>Array.&lt;{entityType: string, variables: Array.&lt;queryVariables&gt;}&gt;</code> - Array of entity query configurations  

* * *

<a name="module_omcGraphQl..QueryTemplate"></a>

## omcGraphQl~QueryTemplate : <code>Object</code>
- Templates only need to enumerate the entityType that is to be queried, all the properties for the entity are added automatically
- Will correctly handle union types in graphql by including the inline fragments needed.
- Any individual property in an entity can be overwritten by including an alternative in the template
- The template can indicate whether the full entity should be returned, or just the reference
- The template can include variables for properties that allow them in the graphql schema
- Custom variables can be passed into the top level entity as query filters

**Kind**: inner typedef of [<code>omcGraphQl</code>](#module_omcGraphQl)  

* * *
