/**
 * The RDF property-name templates an edge definition can carry.
 *
 * Naming templates, not edges: they say how a predicate's RDF name is spelt, and the Edge Editor's
 * published document names one of them with a token (`tentative`, `intrinsic`) that `edgesHydrate`
 * turns back into the function. A row only falls back to one of these where the publication's `rdf`
 * projection names no property for it.
 *
 * @module rdfTemplates
 */

const VOWELS = /^[AEIOU]/;
const article = (word) => (VOWELS.test(word) ? 'an' : 'a');
const cap = (word) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Default tentative ("omcT") layer name, e.g. omcT:aNarrativeSceneFeatures.Character
 * Matches the dominant pattern in the existing data: omcT:a{Domain}{Predicate}.{Range}
 *
 * @param {{domain: string, predicate: string, range: string}} params
 * @returns {string}
 */
export const tentativeRdf = ({ domain, predicate, range }) =>
    `omcT:${article(domain)}${domain}${cap(predicate)}.${range}`;

/**
 * Default name for intrinsic "has-a" property edges, e.g. omc:hasProvenance
 *
 * @param {{predicate: string}} params
 * @returns {string}
 */
export const intrinsicRdf = ({ predicate }) => `omc:has${cap(predicate)}`;

export default { tentativeRdf, intrinsicRdf };
