export function tentativeRdf({ domain, predicate, range }: {
    domain: string;
    predicate: string;
    range: string;
}): string;
export function intrinsicRdf({ predicate }: {
    predicate: string;
}): string;
declare namespace _default {
    export { tentativeRdf };
    export { intrinsicRdf };
}
export default _default;
//# sourceMappingURL=rdfTemplates.d.ts.map