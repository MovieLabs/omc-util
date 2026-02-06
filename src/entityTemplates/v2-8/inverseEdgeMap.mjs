/**
 * A map with each type of edge and it's inverse
 *
 * @memberOf namespace:OMC-Util
 */

export const inverseEdgeMap = {
    contributor: 'contributesTo',
    contributesTo: 'contributor',
    featuresIn: 'features',
    features: 'featuresIn',
    neededBy: 'needs',
    needs: 'neededBy',
    has: 'for',
    for: 'has',
    hasProduct: 'productOf',
    productOf: 'hasProduct',
    represents: 'representedBy',
    representedBy: 'represents',
    usedIn: 'uses',
    uses: 'usedIn',
    related: 'related',
    idea: 'subject',
    subject: 'idea',
};
