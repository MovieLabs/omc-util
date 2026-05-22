/**
 * @module edges
 *
 * Consolidated, predicate-centric definition of every OMC v3-0 edge.
 *
 * This file is the single source of truth for relationship *meaning*. It replaces the
 * per-entity `$edge` / `edges` / `cxtEdges` blocks that were previously hand-authored in
 * each entity template. The build (templates/v3-0/index.js) expands these definitions into
 * the existing `entityTemplate[type].edgeTable = { intrinsic, edges, cxtEdges }` shape, so
 * downstream consumers (omcEdges, the GraphQL builder, the SDK) are unaffected.
 *
 * MODEL
 * -----
 * Each entry is one predicate (an RDF property family). It carries:
 *   - cardinality : 'array' | 'object'  — how the reference is stored on the source entity
 *   - inverse     : predicate name (resolved against inverseEdges.js) or null when the
 *                   reverse direction is not materialised as a JSON edge
 *   - rdf         : ({ domain, predicate, range }) => string  — generates the formal RDF
 *                   predicate name (template driven). Defaults below; override per predicate.
 *   - placement   : 'edges' (default) | 'property'
 *                     'edges'    → reference lives at  edges.{predicate}.{range}
 *                     'property' → reference lives at a named property (intrinsic edge),
 *                                  path defaults to {predicate}
 *   - pathTemplate: optional override using {predicate} and {range} placeholders
 *   - connects    : [{ domain:[...], range:[...], inverse?, path?, pathTemplate?, rdfMap? }]
 *                     each element is a domain→range constraint group (an OWL-restriction
 *                     style pairing). `inverse` / `path` may be overridden per group when a
 *                     predicate behaves asymmetrically across domains (e.g. Depiction).
 *
 * RDF ALIGNMENT (rdfMap)
 * ----------------------
 * `rdfMap` is a per-group array naming the EXISTING CANONICAL RDF predicate(s) in the
 * parallel RDF model (../Prodtech-OMC-Data-Model .../omc.ttl, v2.8) that express the same
 * relationship. It is curated alignment documentation, not generated output — the long-term
 * goal is to converge the two models. The Tentative (machine-expanded, `v2.8Tentative#`,
 * `omcT:a<Domain><Predicate>.<Range>`) layer is intentionally NOT listed here: it mirrors the
 * JSON edges 1:1 and is already produced per entry by the `rdf` generator (the `omcPredicate`
 * field). rdfMap therefore captures only what omcPredicate does not — the curated `omc:`
 * layer. Notation used inside rdfMap strings:
 *   - `omc:foo`   — a canonical (curated) RDF object property
 *   - `~` prefix  — the named RDF property runs in the INVERSE direction
 *   - `(Type)`    — the predicate only covers that slice of the JSON domain/range
 *                   (RDF uses owl:unionOf where JSON splits by type)
 *   - `[]`        — no canonical omc: predicate (the edge may still have a Tentative
 *                   `omcPredicate`, or be genuinely JSON-only)
 * Two structural mismatches recur and explain most `(Type)` notes and `[]` gaps:
 *   1. RDF has class inheritance, JSON does not. JSON folds RDF subclasses into one
 *      entityType (e.g. AssetGroup⊂Asset, AssetAsStructure≈AssetSC, ParticipantAsStructure
 *      ≈Person/Org/...), so a JSON Asset→Asset edge maps to an RDF Asset→AssetGroup property.
 *   2. RDF reifies some relationships JSON keeps generic (Storyboard, Contribution, etc.).
 * See reference_omc_rdf_model and project_v3-edge-consolidation memory for the full synopsis.
 *
 * SCOPE OF THIS DRAFT
 * -------------------
 * Covers the regular (`edges`) and intrinsic partitions. The Context-mediated `cxtEdges`
 * projection is intentionally NOT hand-authored here — it is largely a mechanical
 * transform of the forward edges and will be generated in a later phase (see notes by the
 * Context section). `// TODO` marks judgement calls (cardinalities/inverses) that were
 * cleaned up relative to the current — sometimes buggy — data and want review.
 */

const VOWELS = /^[AEIOU]/;
const article = (word) => (VOWELS.test(word) ? 'an' : 'a');
const cap = (word) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Default tentative ("omcT") layer name, e.g. omcT:aNarrativeSceneFeatures.Character
 * Matches the dominant pattern in the existing data: omcT:a{Domain}{Predicate}.{Range}
 */
export const tentativeRdf = ({ domain, predicate, range }) =>
    `omcT:${article(domain)}${domain}${cap(predicate)}.${range}`;

/** Default name for intrinsic "has-a" property edges, e.g. omc:hasProvenance */
export const intrinsicRdf = ({ predicate }) => `omc:has${cap(predicate)}`;

/**
 * Entities that may carry an attached Context (and thus expose `edges.hasCxt.Context`).
 * Includes `Context` itself so Contexts can nest. Used by the hasCxt/cxtFor predicates.
 */
const CONTEXT_BEARERS = [
    'Asset', 'Character', 'Collection', 'Composition', 'Context', 'CreativeWork', 'Depiction',
    'Effect', 'Infrastructure', 'Location', 'NarrativeAudio', 'NarrativeLocation', 'NarrativeObject',
    'NarrativeScene', 'NarrativeStyling', 'NarrativeWardrobe', 'Participant', 'ProductionLocation',
    'ProductionScene', 'Provenance', 'Slate', 'SpecialAction', 'Task',
];

export const edgeDefinitions = {

    /* ===================================================================== *
     *  Relational predicates  (stored at  edges.{predicate}.{range})
     * ===================================================================== */

    has: {
        predicate: 'has',
        cardinality: 'array',
        inverse: 'for',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['CreativeWork'],
                range: ['Asset', 'NarrativeScene'],
                rdfMap: ['omc:hasNarrativeScene (NarrativeScene)'],
            },
            {
                domain: ['Asset'],
                range: ['Participant', 'Slate'],
                rdfMap: ['~omc:isSlateFor (Slate)'], // Participant: none
            },
            {
                domain: ['NarrativeScene'],
                range: ['Asset', 'ProductionScene'],
                rdfMap: ['omc:hasStoryboard (Asset)', '~omc:hasNarrativeScene (ProductionScene)'],
            },
            {
                domain: ['ProductionScene'],
                range: ['Slate'],
                rdfMap: ['omc:hasSlate'],
            },
            {
                domain: ['Slate'],
                range: ['Infrastructure', 'Participant'],
                rdfMap: ['omc:hasCameraUnit (Participant)', 'omc:hasDirector (Participant)'], // Infrastructure: none
            },
            {
                domain: ['Infrastructure'],
                range: ['SpecialAction'],
                rdfMap: [], // JSON-only: Infrastructure barely modelled in RDF v2.8
            },
            {
                domain: ['Character', 'NarrativeLocation', 'NarrativeObject', 'NarrativeStyling', 'NarrativeWardrobe'],
                range: ['Depiction'],
                inverse: 'depicts',
                rdfMap: [],
            },
            {
                domain: ['Asset', 'Participant', 'Composition'],
                range: ['Depiction'],
                inverse: 'depictedBy',
                rdfMap: [],
            },
        ],
    },

    for: {
        predicate: 'for',
        cardinality: 'array',
        inverse: 'has',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Asset'],
                range: ['NarrativeScene'],
                rdfMap: ['omc:isStoryboardFor'],
            },
            {
                domain: ['NarrativeScene'],
                range: ['CreativeWork'],
                rdfMap: ['omc:isFromWork'],
            },
            {
                domain: ['ProductionScene'],
                range: ['NarrativeScene'],
                rdfMap: ['omc:hasNarrativeScene'],
            },
            {
                domain: ['Slate'],
                range: ['Asset', 'ProductionScene'],
                rdfMap: ['omc:isSlateFor (ProductionScene)'],
            },
            {
                domain: ['Participant'],
                range: ['Asset'],
                inverse: null,
                rdfMap: [], // JSON-only
            },
            // These two reverse intrinsic edges on CreativeWork/Slate (asymmetric inverse):
            {
                domain: ['Participant'],
                range: ['CreativeWork'],
                inverse: 'ProductionCompany',
                rdfMap: [], // inverse of CreativeWork.ProductionCompany; no canonical omc: predicate
            },
            {
                domain: ['Participant'],
                range: ['Slate'],
                inverse: 'Director',
                rdfMap: ['omc:isDirectorFor'],
            },
        ],
    },

    needs: {
        predicate: 'needs',
        cardinality: 'array',
        inverse: 'neededBy',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Character'],
                range: ['Effect', 'NarrativeAudio', 'NarrativeObject',
                    'NarrativeStyling', 'NarrativeWardrobe', 'SpecialAction'],
                rdfMap: ['omc:usesWardrobe (NarrativeWardrobe)'],
            },
        ],
    },

    neededBy: {
        predicate: 'neededBy',
        cardinality: 'array',
        inverse: 'needs',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Effect', 'NarrativeAudio', 'NarrativeObject',
                    'NarrativeStyling', 'NarrativeWardrobe', 'SpecialAction'],
                range: ['Character'],
                rdfMap: ['omc:isWardrobeFor (NarrativeWardrobe)', 'omc:interactsWithCharacter (NarrativeObject)'],
            },
        ],
    },

    features: {
        predicate: 'features',
        cardinality: 'array',
        inverse: 'featuresIn',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['NarrativeScene'],
                range: ['Character', 'Effect', 'NarrativeAudio', 'NarrativeLocation',
                    'NarrativeObject', 'NarrativeStyling', 'NarrativeWardrobe', 'SpecialAction'],
                rdfMap: [], // no canonical omc: predicate — Tentative layer only (see omcPredicate)
            },
        ],
    },

    featuresIn: {
        predicate: 'featuresIn',
        cardinality: 'array',
        inverse: 'features',
        rdf: tentativeRdf,
        // SpecialAction added to mirror `features` (its missing featuresIn was a bug).
        connects: [
            {
                domain: ['Character', 'Effect', 'NarrativeAudio', 'NarrativeLocation',
                    'NarrativeObject', 'NarrativeStyling', 'NarrativeWardrobe', 'SpecialAction'],
                range: ['NarrativeScene'],
                rdfMap: [], // no canonical omc: predicate — Tentative layer only (see omcPredicate)
            },
        ],
    },

    depicts: {
        predicate: 'depicts',
        cardinality: 'array',
        inverse: 'has',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Depiction'],
                range: ['Character', 'NarrativeLocation', 'NarrativeObject', 'NarrativeStyling', 'NarrativeWardrobe'],
                rdfMap: [], // no canonical omc: predicate — Tentative layer only (see omcPredicate)
            },
        ],
    },

    depictedBy: {
        predicate: 'depictedBy',
        cardinality: 'array',
        inverse: 'has',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Depiction'],
                range: ['Asset', 'Participant', 'Composition'],
                rdfMap: [], // no canonical omc: predicate — Tentative layer only (see omcPredicate)
            },
        ],
    },

    uses: {
        predicate: 'uses',
        cardinality: 'array',
        inverse: 'usedIn',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Depiction'],
                range: ['Asset'],
                rdfMap: [], // JSON-only
            },
            {
                domain: ['ProductionScene'],
                range: ['Asset', 'Depiction', 'ProductionLocation'],
                rdfMap: ['omc:representedBy (Asset)'],
            },
        ],
    },

    usedIn: {
        predicate: 'usedIn',
        cardinality: 'array',
        inverse: 'uses',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Asset'],
                range: ['ProductionLocation', 'ProductionScene'],
                rdfMap: ['~omc:representedBy (ProductionScene; i.e. omc:represents)'], // ProductionLocation: none
            },
            {
                domain: ['Depiction'],
                range: ['ProductionScene'],
                rdfMap: ['omc:hasProductionScene', 'omc:isUsedBy'],
            },
            {
                domain: ['ProductionLocation'],
                range: ['ProductionScene'],
                rdfMap: ['omc:hasProductionScene'],
            },
        ],
    },

    contributesTo: {
        predicate: 'contributesTo',
        cardinality: 'array',
        inverse: 'contributor',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Participant'],
                range: ['CreativeWork'],
                rdfMap: [],
            },
        ],
    },

    contributor: {
        predicate: 'contributor',
        cardinality: 'array',
        inverse: 'contributesTo',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['CreativeWork'],
                range: ['Participant'],
                rdfMap: [],
            },
        ],
    },

    informs: {
        predicate: 'informs',
        cardinality: 'array',
        inverse: 'informedBy',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Task'],
                range: ['Task'],
                rdfMap: [],
            },
        ],
    },

    informedBy: {
        predicate: 'informedBy',
        cardinality: 'array',
        inverse: 'informs',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Task'],
                range: ['Task'],
                rdfMap: [],
            },
        ],
    },

    related: {
        predicate: 'related',
        cardinality: 'array',
        inverse: 'related', // self-inverse
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['CreativeWork'],
                range: ['CreativeWork'],
                rdfMap: [], // no canonical omc: predicate — Tentative layer only
            },
            {
                domain: ['ProductionScene'],
                range: ['ProductionScene'],
                rdfMap: ['omc:hasRelatedScene'],
            },
        ],
    },

    productOf: {
        predicate: 'productOf',
        cardinality: 'array',
        inverse: 'Product', // intrinsic reverse on Composition
        rdf: () => 'omc-legacy:isProducedBy.Composition',
        connects: [
            {
                domain: ['Asset'],
                range: ['Composition'],
                rdfMap: ['omc:isProducedBy.Composition'], // dotted canonical local-name in omc.ttl
            },
        ],
    },

    // Regular reverse of the intrinsic `Member` group property (asymmetric pair):
    // each member points back to its group. Member types match their group type.
    // RDF models the group as a distinct subclass (AssetGroup/TaskGroup/ParticipantGroup);
    // JSON folds the group back into the base type, hence the `(range <X>Group)` notes.
    memberOf: {
        predicate: 'memberOf',
        cardinality: 'array',
        inverse: 'Member',
        rdf: tentativeRdf,
        connects: [
            {
                domain: ['Asset'],
                range: ['Asset'],
                rdfMap: ['omc:isAssetComponentOf (range AssetGroup)'],
            },
            {
                domain: ['Infrastructure'],
                range: ['Infrastructure'],
                rdfMap: [], // JSON-only
            },
            {
                domain: ['Task'],
                range: ['Task'],
                rdfMap: ['omc:isTaskComponentOf (range TaskGroup)'],
            },
            {
                domain: ['Participant'],
                range: ['Participant'],
                rdfMap: ['omc:isParticipantComponentFor (range ParticipantGroup)',
                    'omc:isMemberOfOrganization (Organization)'],
            },
        ],
    },

    /* ===================================================================== *
     *  Context — LEFT SIDE attachment
     *
     *  An entity A attaches to a Context C, and the Context refers back to A:
     *      (A) --hasCxt--> (C)        (C) --cxtFor--> (A)
     *
     *  RIGHT SIDE — the Context inheriting A's outbound edges, e.g.
     *  (C) --featuresIn--> (B) and (B) --features--> (C) — is NOT authored here.
     *  It is generated per-subject into the cxtEdges partition (next phase),
     *  reusing the ordinary relational predicates above. Context therefore does
     *  NOT appear as a domain on has/needs/usedIn/etc.; its only authored edges
     *  are the cxtFor back-edges below.
     * ===================================================================== */

    hasCxt: {
        predicate: 'hasCxt',
        cardinality: 'array',
        inverse: 'cxtFor',
        rdf: () => 'omc:hasContext',
        connects: [
            {
                domain: CONTEXT_BEARERS,
                range: ['Context'],
                rdfMap: ['omc:hasContext'], // RDF range MediaCreationContext; domain unconstrained
            },
        ],
    },

    cxtFor: {
        predicate: 'cxtFor',
        cardinality: 'array',
        inverse: 'hasCxt',
        rdf: () => 'omc:isContextFor',
        connects: [
            {
                domain: ['Context'],
                range: CONTEXT_BEARERS,
                rdfMap: ['omc:hasContextComponent'], // MediaCreationContext -> MediaCreationContextComponent
            },
        ],
    },

    /* ===================================================================== *
     *  Intrinsic edges  (stored at a named property, not under `edges`)
     * ===================================================================== */

    // --- Structural characteristics (single nested sub-objects) ------------
    // In RDF these are subclass trees reached via has<X>StructuralCharacteristic;
    // JSON inlines the concrete subtype object, hence the `(range <X>AsStructure)` notes.
    AssetSC: {
        predicate: 'AssetSC',
        placement: 'property',
        cardinality: 'array',
        inverse: null,
        rdf: () => 'omc:hasAssetStructuralCharacteristic',
        connects: [{
            domain: ['Asset'],
            range: ['AssetSC'],
            rdfMap: ['omc:hasAssetStructuralCharacteristic (range AssetAsStructure)'],
        }],
    },

    ParticipantSC: {
        predicate: 'ParticipantSC',
        placement: 'property',
        cardinality: 'array',
        inverse: null,
        rdf: () => 'omc:hasParticipantStructuralCharacteristic',
        connects: [{
            domain: ['Participant'],
            range: ['Organization', 'Department', 'Person', 'Service'],
            rdfMap: ['omc:hasParticipantStructuralCharacteristic (range ParticipantAsStructure)'],
        }],
    },

    InfrastructureSC: {
        predicate: 'InfrastructureSC',
        placement: 'property',
        cardinality: 'array', // structural characteristic — single object (validate vs schema)
        inverse: null,
        rdf: () => 'omc:hasInfrastructureStructuralCharacteristic',
        connects: [{
            domain: ['Infrastructure'],
            range: ['InfrastructureSC'],
            rdfMap: [], // JSON-only: Infrastructure has no SC predicate in RDF v2.8
        }],
    },

    TaskSC: {
        predicate: 'TaskSC',
        placement: 'property',
        cardinality: 'array', // structural characteristic — single object (validate vs schema)
        inverse: null,
        rdf: () => 'omc:hasTaskStructuralCharacteristic',
        connects: [{
            domain: ['Task'],
            range: ['TaskSC'],
            rdfMap: ['omc:hasTaskStructuralCharacteristic (range TaskAsStructure)'],
        }],
    },

    // --- Membership / containment -----------------------------------------
    // `Member` is INTRINSIC (a group, by definition, has members) and its reverse
    // `memberOf` is a REGULAR edge (being a member of a group does not define what
    // you are) — see the `memberOf` predicate in the relational section above.
    // RDF domain is the distinct <X>Group subclass (folded into the base type in JSON).
    Member: {
        predicate: 'Member',
        placement: 'property',
        cardinality: 'array',
        inverse: 'memberOf',
        rdf: intrinsicRdf,
        connects: [
            {
                domain: ['Asset'],
                range: ['Asset'],
                rdfMap: ['omc:hasAssetComponent (domain AssetGroup)'],
            },
            {
                domain: ['Infrastructure'],
                range: ['Infrastructure'],
                rdfMap: [], // JSON-only
            },
            {
                domain: ['Task'],
                range: ['Task'],
                rdfMap: ['omc:hasTaskComponent (domain TaskGroup)'],
            },
            {
                domain: ['Participant'],
                range: ['Participant'],
                rdfMap: ['omc:hasParticipantComponent (domain ParticipantGroup)',
                    'omc:hasOrganizationMember (Organization)'],
            },
        ],
    },

    includes: {
        predicate: 'includes',
        placement: 'property',
        pathTemplate: 'includes.{range}', // one entry per range, keyed by range type
        cardinality: 'array',
        inverse: null,
        rdf: intrinsicRdf,
        connects: [
            {
                domain: ['Collection'],
                range: ['Asset', 'AssetSC', 'Character', 'Collection', 'Composition', 'CreativeWork',
                    'Depiction', 'Effect', 'Infrastructure', 'Location', 'NarrativeAudio',
                    'NarrativeLocation', 'NarrativeObject', 'NarrativeScene', 'NarrativeStyling',
                    'NarrativeWardrobe', 'Participant', 'ProductionLocation', 'ProductionScene',
                    'Slate', 'SpecialAction'],
                rdfMap: [], // JSON-only: Collection membership not modelled in RDF v2.8
            },
            {
                domain: ['Composition'],
                range: ['Asset', 'AssetSC', 'Composition'],
                rdfMap: ['omc:includesAsset (Asset)', 'omc:includesComposition (Composition)'],
            },
        ],
    },

    ConfigurationFile: {
        predicate: 'ConfigurationFile',
        placement: 'property',
        path: 'software.ConfigurationFile',
        cardinality: 'object',
        inverse: null,
        rdf: () => 'omc:hasConfigurationFile',
        connects: [{
            domain: ['Collection', 'Composition'],
            range: ['Asset'],
            rdfMap: ['omc:hasConfigurationFile (RDF domain Software)'],
        }],
    },

    StartHere: {
        predicate: 'StartHere',
        placement: 'property',
        cardinality: 'array',
        inverse: null,
        rdf: () => 'omc:startHere',
        connects: [{
            domain: ['Composition'],
            range: ['Asset', 'AssetSC'],
            rdfMap: ['omc:startHere'],
        }],
    },

    Product: {
        predicate: 'Product',
        placement: 'property',
        cardinality: 'array',
        inverse: 'productOf',
        rdf: intrinsicRdf,
        connects: [{
            domain: ['Composition'],
            range: ['Asset'],
            rdfMap: ['omc:produces.Asset'], // dotted canonical local-name in omc.ttl
        }],
    },

    // --- Provenance --------------------------------------------------------
    Provenance: {
        predicate: 'Provenance',
        placement: 'property',
        cardinality: 'array',
        inverse: 'has', // Provenance points back to its owner via `has` (per decision, for now)
        rdf: () => 'omc:hasProvenance',
        connects: [{
            domain: ['Asset', 'Composition'],
            range: ['Provenance'],
            rdfMap: ['omc:hasProvenance'],
        }],
    },

    CreatedBy: {
        predicate: 'CreatedBy',
        placement: 'property',
        cardinality: 'array',
        inverse: null,
        rdf: () => 'omc:hasAuthor',
        connects: [{
            domain: ['Provenance'],
            range: ['Participant'],
            rdfMap: ['omc:isCreatedBy', 'omc:hasAuthor'],
        }],
    },

    Origin: {
        predicate: 'Origin',
        placement: 'property',
        cardinality: 'array',
        inverse: null,
        rdf: intrinsicRdf,
        connects: [{
            domain: ['Provenance'],
            range: ['Asset'],
            rdfMap: ['omc:hasOrigin'],
        }],
    },

    // --- Role (two placements: Participant.participantFC.Role & Provenance.Role) ---
    Role: {
        predicate: 'Role',
        placement: 'property',
        cardinality: 'array',
        inverse: null,
        rdf: intrinsicRdf,
        connects: [
            {
                domain: ['Participant'], range: ['Role'], path: 'participantFC.Role', rdfMap: ['omc:hasRole'],
            },
            {
                domain: ['Provenance'], range: ['Role'], path: 'Role', rdfMap: ['omc:hasRole'],
            },
        ],
    },

    // --- Slate intrinsics --------------------------------------------------
    Director: {
        predicate: 'Director',
        placement: 'property',
        cardinality: 'array',
        inverse: 'for', // Slate.Director inverse edges.for.Slate
        rdf: () => 'omc:hasDirector',
        connects: [{
            domain: ['Slate'],
            range: ['Participant'],
            rdfMap: ['omc:hasDirector'],
        }],
    },

    CreativeWork: {
        predicate: 'CreativeWork',
        placement: 'property',
        cardinality: 'object',
        inverse: 'has', // Slate.CreativeWork inverse edges.has.Slate
        rdf: () => 'omc:hasCreativeWork',
        connects: [{
            domain: ['Slate'],
            range: ['CreativeWork'],
            rdfMap: ['omc:hasCreativeWork', 'omc:isSlateFor.CreativeWork'],
        }],
    },

    // --- CreativeWork intrinsics ------------------------------------------
    ProductionCompany: {
        predicate: 'ProductionCompany',
        placement: 'property',
        cardinality: 'array', // TODO: source omitted $type — confirm cardinality
        inverse: 'for',
        rdf: () => 'omc:hasProductionCompany',
        connects: [{
            domain: ['CreativeWork'],
            range: ['Participant'],
            rdfMap: [], // Tentative layer only (see omcPredicate); ProductionCompany is also an RDF class ⊂ Participant
        }],
    },

    Series: {
        predicate: 'Series',
        placement: 'property',
        cardinality: 'array',
        inverse: 'related',
        rdf: intrinsicRdf,
        connects: [{
            domain: ['CreativeWork'],
            range: ['CreativeWork'],
            rdfMap: [], // no distinct Series predicate; generic related only (Tentative layer)
        }],
    },

    Season: {
        predicate: 'Season',
        placement: 'property',
        cardinality: 'array',
        inverse: 'related',
        rdf: intrinsicRdf,
        connects: [{
            domain: ['CreativeWork'],
            range: ['CreativeWork'],
            rdfMap: [], // no distinct Series predicate; generic related only (Tentative layer)
        }],
    },

    Episode: {
        predicate: 'Episode',
        placement: 'property',
        cardinality: 'array',
        inverse: 'related',
        rdf: intrinsicRdf,
        connects: [{
            domain: ['CreativeWork'],
            range: ['CreativeWork'],
            rdfMap: [], // no distinct Episode predicate; generic related only (Tentative layer)
        }],
    },

    // --- Location (real-world location reference) --------------------------
    Location: {
        predicate: 'Location',
        placement: 'property',
        cardinality: 'array',
        inverse: null,
        rdf: intrinsicRdf,
        connects: [
            {
                domain: ['Department', 'NarrativeLocation', 'Organization', 'Person',
                    'ProductionLocation', 'Service'],
                range: ['Location'],
                rdfMap: ['omc:hasAssociatedLocation'],
            },
        ],
    },
};
