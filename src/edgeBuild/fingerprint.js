/**
 * A fingerprint of a schema document: which schema an edge table was built against.
 *
 * Pure JavaScript rather than `node:crypto`, so the browser build and the CLI compute the same value.
 * It answers "is this the same schema?", not anything cryptographic. It is taken over the parsed
 * document's JSON, so a line-ending change on checkout does not make two copies look different.
 *
 * @module edgeBuild/fingerprint
 */

/**
 * Two independent 32-bit FNV-1a-style lanes over the string, joined as 16 hex characters.
 *
 * @param {string} text
 * @returns {string}
 */
const hash64 = ((text) => {
    let h1 = 0x811c9dc5;
    let h2 = 0x01000193 ^ text.length;
    for (let i = 0; i < text.length; i += 1) {
        const c = text.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 0x01000193);
        h2 = Math.imul(h2 ^ c, 0x5bd1e995);
        h2 ^= h2 >>> 15;
    }
    const hex = (n) => (n >>> 0).toString(16).padStart(8, '0');
    return `${hex(h1)}${hex(h2)}`;
});

/**
 * @param {object} schema - A parsed schema document
 * @returns {string} 16 hex characters
 */
export const schemaFingerprint = ((schema) => hash64(JSON.stringify(schema)));

export default schemaFingerprint;
