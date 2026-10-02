/**
 * Edge definitions, from the document the Edge Editor publishes.
 *
 * The document carries two projections of each stored edge: `json`, whose `edgeDefinitions` the
 * table is built from, and `rdf`, whose `properties` name an RDF property per domain/range pairing.
 * The barer forms — `edgeDefinitions` at the top, or the definitions as the whole document — are
 * accepted for a hand-cut file or an older export.
 *
 * In JSON an edge's RDF name generator cannot be a function, so each definition carries a token
 * instead (`tentative`, `intrinsic`, `const:<name>`), which `hydrate` turns back into one.
 *
 * @module edgeBuild/definitions
 * @ignore
 */

const VOWELS = /^[AEIOU]/;
const article = (word) => (VOWELS.test(word) ? 'an' : 'a');
const cap = (word) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * The tentative ("omcT") name, e.g. `omcT:aNarrativeSceneFeatures.Character`. A row falls back to
 * it only where the publication's `rdf` projection names no property.
 *
 * @param {{domain: string, predicate: string, range: string}} params
 * @returns {string}
 */
export const tentativeRdf = ({ domain, predicate, range }) =>
    `omcT:${article(domain)}${domain}${cap(predicate)}.${range}`;

/**
 * The name for an intrinsic "has-a" property, e.g. `omc:hasProvenance`.
 *
 * @param {{predicate: string}} params
 * @returns {string}
 */
export const intrinsicRdf = ({ predicate }) => `omc:has${cap(predicate)}`;

/** The RDF name generator a token stands for. */
const rdfFromToken = ((token) => {
    if (token === 'intrinsic') return intrinsicRdf;
    if (typeof token === 'string' && token.startsWith('const:')) {
        const name = token.slice('const:'.length);
        return () => name;
    }
    return tentativeRdf;
});

/**
 * The `edgeDefinitions` of a published document, wherever the document carries them.
 *
 * @param {Object} doc - A parsed published document
 * @returns {Object} The definitions, still holding `rdf` tokens
 */
export const definitionsOf = ((doc) => doc?.json?.edgeDefinitions ?? doc?.edgeDefinitions ?? doc);

/**
 * The definitions of a published document with each `rdf` token turned into its function, refused
 * unless they look like definitions.
 *
 * Without the refusal, a document shaped differently from expected is read as a set of predicates
 * named after its top-level keys — `generated`, `namespace`, `json`, `rdf`. A nonsense build that
 * runs is worse than one that refuses.
 *
 * @param {Object} doc - A parsed published document
 * @param {string} where - What to name in the error
 * @returns {Object<string, object>}
 * @throws {Error} When the document holds nothing shaped like edge definitions
 */
export function definitionsFrom(doc, where) {
    const found = definitionsOf(doc);
    const entries = found && typeof found === 'object' ? Object.entries(found) : [];
    const looksRight = entries.length
        && entries.every(([, value]) => value && typeof value === 'object'
            && (Array.isArray(value.connects) || typeof value.predicate === 'string'));
    if (!looksRight) {
        throw new Error([
            `${where} holds no edge definitions.`,
            '  Expected them at `json.edgeDefinitions` (the published document), at',
            '  `edgeDefinitions`, or as the whole document — each value carrying `connects`.',
            `  Found top-level keys: ${Object.keys(doc || {}).join(', ') || '(none)'}`,
        ].join('\n'));
    }
    return Object.fromEntries(entries
        .map(([predicate, definition]) => [predicate, { ...definition, rdf: rdfFromToken(definition.rdf) }]));
}

/**
 * The flat inverse map, predicate → inverse predicate: each definition's top-level `inverse`.
 *
 * This is what omc-util's deprecated `inverseEdge()` answers from, and fMam still reads it. It
 * cannot hold a per-group override or an intrinsic inverse; the table's own `inverseEdge` can, and
 * the inverse check counts where the two disagree.
 *
 * @param {Object} definitions
 * @returns {Object<string, string>}
 */
export const inverseMapFrom = (definitions) => Object.entries(definitions)
    .reduce((map, [predicate, def]) => {
        if (def.inverse) map[predicate] = def.inverse;
        return map;
    }, {});
