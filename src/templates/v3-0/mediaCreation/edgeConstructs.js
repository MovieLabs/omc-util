export const cxtFeaturesInNarrativeScene = {
    $type: 'array',
    $edge: {
        $allowed: ['NarrativeScene'],
        $inverse: 'edges.isIn.NarrativeScene',
        $predicate: 'featuresIn',
        $omcPredicate: 'isContextComponent',
    },
};

export const cxtIsInContext = {
    $type: 'array',
    $edge: {
        $allowed: ['Context'],
        $predicate: 'isIn',
        $omcPredicate: 'isContextComponent',
    },
};

export const cxtNeedsEffect = {
    $type: 'array',
    $edge: {
        $allowed: ['Effect'],
        $inverse: 'edges.isIn.Context',
        $predicate: 'isIn',
        $omcPredicate: 'isContextComponent',
    },
};

export const cxtNeedsNarrativeAudio = {
    $type: 'array',
    $edge: {
        $allowed: ['NarrativeAudio'],
        $inverse: 'edges.isIn.Context',
        $predicate: 'isIn',
        $omcPredicate: 'isContextComponent',
    },
};
