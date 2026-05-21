/**
 * A table describing the inverse of all edges
 */

export const inverseEdges = {
    contributor: 'contributesTo',
    contributesTo: 'contributor',
    featuresIn: 'features',
    features: 'featuresIn',
    neededBy: 'needs',
    needs: 'neededBy',
    has: 'for',
    for: 'has',
    represents: 'representedBy',
    representedBy: 'represents',
    usedIn: 'uses',
    uses: 'usedIn',
    related: 'related',
    idea: 'subject',
    isIn: 'isIn', // Not sure about this?
    subject: 'idea',
    hasProduct: 'productOf',
    productOf: 'hasProduct',
    // Asymmetric pair: `Member` is an intrinsic group property, `memberOf` is a regular edge
    Member: 'memberOf',
    memberOf: 'Member',
};
