/**
 * The field entries for one entity type.
 *
 * @param {Object} params
 * @param {(Object|null)} params.shape - `omcTemplate.shape()` for the type
 * @param {(Object|null)} params.filter - `omcTemplate.graphQl().filter` for the type
 * @param {('edit'|'filter')} params.purpose
 * @param {string[]} params.recordKeys - Top-level keys that describe the record, not its data
 * @returns {Array<FieldEntry>}
 */
export default function deriveFields({ shape, filter, purpose, recordKeys, }: {
    shape: (any | null);
    filter: (any | null);
    purpose: ("edit" | "filter");
    recordKeys: string[];
}): Array<FieldEntry>;
//# sourceMappingURL=fields.d.ts.map