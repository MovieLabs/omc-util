/**
 * If you allow for named Object classes in the edge structure, you would have to define every one of these in JSON-schema,
 * along with the entity types they connect to. The alternative is to allow a completely permissive relationship structure,
 * i.e. if you use {*} for the predicate it becomes a list of all entity types, but that would mean you could name an
 * edge for a Character, but nest any entity class in the JSON.
 * - This also potentially limits people to extend the use of JSON, it gets harder to implement your own edges, or collections
 * etc, these would fail validation.
 *
 * This creates a problem in graphQl, as you would need to have every query use an inline fragment for every nested entity,
 * this almost negates any point of using graphQl, or you maintain the constraint in graphQl and generate types from the
 * validation tables.
 *
 * Using the pattern name in the OMC-JSON loses you semantic expressiveness in the JSON itself (constraints can still
 * be applied in a validator, and the information is encoded in the referenced entity). You could still find a way to include
 * some of the semantics in documentation, i.e. you talk about a Concept that uses the edgeBundle pattern.
 *
 * How do you handle self-referencing, i.e. are you constraining what types of Collections certain Collections can include?
 *
 * How are you constraining Context, since some of the constraints are about what type of entity the Context is for
 */

const validation = {
    Asset: [
        {
            condition: {
                entityType: 'Asset',
                assetFC: {
                    functionalType: 'script',
                },
            },
            constraint: {
                AssetSC: {
                    structuralType: ['physical.document', 'digital.document'], // This is not in the same entity, so it may not be available
                },
                Member: ['Asset'],
                assetFC: {
                    assetProperties: null, // There are no defined assetProperties for a script!
                    edges: {
                        for: {
                            CreativeWork: ['CreativeWork'],
                        },
                        has: {
                            NarrativeScene: ['NarrativeScene'],
                        },
                    },
                },
            },
        },
    ],
    Character: [
        {
            condition: {
                entityType: 'Character',
                characterType: 'character',
            },
            constraint: {
                edges: {
                    featuresIn: {
                        NarrativeScene: ['NarrativeScene'],
                    },
                    has: {
                        Portrayal: ['Depiction'], // This might be an EdgeBundle at some point
                        Context: ['EdgeBundle'],
                    },
                },
            },
        },
    ],
};
