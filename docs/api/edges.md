<a name="module_edges"></a>

# edges
Consolidated, predicate-centric definition of every OMC v3-0 edge.

This file is the single source of truth for relationship *meaning*. It replaces the
per-entity `$edge` / `edges` / `cxtEdges` blocks that were previously hand-authored in
each entity template. The build (templates/v3-0/index.js) expands these definitions into
the existing `entityTemplate[type].edgeTable = { intrinsic, edges, cxtEdges }` shape, so
downstream consumers (omcEdges, the GraphQL builder, the SDK) are unaffected.

MODEL
-----
Each entry is one predicate (an RDF property family). It carries:
  - cardinality : 'array' | 'object'  — how the reference is stored on the source entity
  - inverse     : predicate name (resolved against inverseEdges.js) or null when the
                  reverse direction is not materialised as a JSON edge
  - rdf         : ({ domain, predicate, range }) => string  — generates the formal RDF
                  predicate name (template driven). Defaults below; override per predicate.
  - placement   : 'edges' (default) | 'property'
                    'edges'    → reference lives at  edges.{predicate}.{range}
                    'property' → reference lives at a named property (intrinsic edge),
                                 path defaults to {predicate}
  - pathTemplate: optional override using {predicate} and {range} placeholders
  - connects    : [{ domain:[...], range:[...], inverse?, path?, pathTemplate?, rdfMap? }]
                    each element is a domain→range constraint group (an OWL-restriction
                    style pairing). `inverse` / `path` may be overridden per group when a
                    predicate behaves asymmetrically across domains (e.g. Realization).

RDF ALIGNMENT (rdfMap)
----------------------
`rdfMap` is a per-group array naming the EXISTING CANONICAL RDF predicate(s) in the
parallel RDF model (../Prodtech-OMC-Data-Model .../omc.ttl, v2.8) that express the same
relationship. It is curated alignment documentation, not generated output — the long-term
goal is to converge the two models. The Tentative (machine-expanded, `v2.8Tentative#`,
`omcT:a<Domain><Predicate>.<Range>`) layer is intentionally NOT listed here: it mirrors the
JSON edges 1:1 and is already produced per entry by the `rdf` generator (the `omcPredicate`
field). rdfMap therefore captures only what omcPredicate does not — the curated `omc:`
layer. Notation used inside rdfMap strings:
  - `omc:foo`   — a canonical (curated) RDF object property
  - `~` prefix  — the named RDF property runs in the INVERSE direction
  - `(Type)`    — the predicate only covers that slice of the JSON domain/range
                  (RDF uses owl:unionOf where JSON splits by type)
  - `[]`        — no canonical omc: predicate (the edge may still have a Tentative
                  `omcPredicate`, or be genuinely JSON-only)
Two structural mismatches recur and explain most `(Type)` notes and `[]` gaps:
  1. RDF has class inheritance, JSON does not. JSON folds RDF subclasses into one
     entityType (e.g. AssetGroup⊂Asset, AssetAsStructure≈AssetSC, ParticipantAsStructure
     ≈Person/Org/...), so a JSON Asset→Asset edge maps to an RDF Asset→AssetGroup property.
  2. RDF reifies some relationships JSON keeps generic (Storyboard, Contribution, etc.).
See reference_omc_rdf_model and project_v3-edge-consolidation memory for the full synopsis.

SCOPE OF THIS DRAFT
-------------------
Covers the regular (`edges`) and intrinsic partitions. The Context-mediated `cxtEdges`
projection is intentionally NOT hand-authored here — it is largely a mechanical
transform of the forward edges and will be generated in a later phase (see notes by the
Context section). `// TODO` marks judgement calls (cardinalities/inverses) that were
cleaned up relative to the current — sometimes buggy — data and want review.


* [edges](#module_edges)
    * _static_
        * [.tentativeRdf](#module_edges.tentativeRdf)
        * [.intrinsicRdf](#module_edges.intrinsicRdf)
    * _inner_
        * [~CONTEXT_BEARERS](#module_edges..CONTEXT_BEARERS)


* * *

<a name="module_edges.tentativeRdf"></a>

## edges.tentativeRdf
Default tentative ("omcT") layer name, e.g. omcT:aNarrativeSceneFeatures.Character
Matches the dominant pattern in the existing data: omcT:a{Domain}{Predicate}.{Range}

**Kind**: static constant of [<code>edges</code>](#module_edges)  

* * *

<a name="module_edges.intrinsicRdf"></a>

## edges.intrinsicRdf
Default name for intrinsic "has-a" property edges, e.g. omc:hasProvenance

**Kind**: static constant of [<code>edges</code>](#module_edges)  

* * *

<a name="module_edges..CONTEXT_BEARERS"></a>

## edges~CONTEXT\_BEARERS
Entities that may carry an attached Context (and thus expose `edges.hasCxt.Context`).
Includes `Context` itself so Contexts can nest. Used by the hasCxt/cxtFor predicates.

**Kind**: inner constant of [<code>edges</code>](#module_edges)  

* * *
