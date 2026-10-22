/**
 * Guard: `omcFind.graph` answers a query template from a model the way fMam answers it as a query —
 * the top-level matches, and down each link the template names, the entities whose filters match —
 * and the matcher compares as fMam's filter does.
 *
 *   Usage: node test/omcFind.js
 */

import { omcEdges, omcFind, omcSDK } from '../index.js';

const schemaVersion = 'https://movielabs.com/omc/json/schema/v3.0';

let failures = 0;
const check = ((label, cond, detail = '') => {
    if (cond) {
        console.log(`  ✓ ${label}`);
        return;
    }
    failures += 1;
    console.error(`  ✗ ${label}   ${detail}`);
});

const make = ((entityType, value, extra = {}) => ({
    entityType, schemaVersion, identifier: [{ identifierScope: 'test', identifierValue: value }], ...extra,
}));

// Writes the edge on both entities in the model; `intrinsicEdge` picks one where several fit.
const model = omcSDK();
const link = ((from, to, intrinsicEdge = null) => {
    const { fromEntity, toEntity } = omcEdges.edgeCreate({
        fromEntity: model.get(from), toEntity: model.get(to), intrinsicEdge, inverse: true,
    });
    model.replace([fromEntity, toEntity]);
});

const scene1 = make('ProductionScene', 'ps1', { label: '1' });
const scene2 = make('ProductionScene', 'ps2', { label: '2' });
const event11 = make('CaptureEvent', 'ce11', { label: '1-1' });
const event12 = make('CaptureEvent', 'ce12', { label: '1-2' });
const slate = make('Slate', 'sl1', { label: '1-1' });
const point = make('CapturePoint', 'cp1');
const asset = make('Asset', 'as1');
const device = make('CaptureDevice', 'cd1');
const infra = make('Infrastructure', 'in1');
model.set([scene1, scene2, event11, event12, slate, point, asset, device, infra]);
link(scene1, event11);
link(scene1, event12);
link(scene1, slate);
link(event11, point);
link(point, asset, 'Capture');
link(point, device);
link(device, infra);

const names = ((nodes) => nodes.map((node) => node.entity.identifier[0].identifierValue).sort());

console.log('matcher');
{
    check('a value equals the filter', omcFind.matches({ label: '1' }, { label: '1' }));
    check('case counts', !omcFind.matches({ label: 'Ab' }, { label: 'ab' }));
    check('a list of filter values takes any one of them', omcFind.matches({ label: '1' }, { label: ['2', '1'] }));
    check('a list against a list needs every element', omcFind.matches({ tag: ['a', 'b'] }, { tag: ['b'] })
    && !omcFind.matches({ tag: ['a'] }, { tag: ['a', 'c'] }));
}

console.log('graph');
const chain = {
    label: '1',
    edges: {
        for: {
            CaptureEvent: {
                label: '1-1',
                CapturePoint: {
                    Capture: 'Asset',
                    CaptureDevice: { Infrastructure: 'Infrastructure' },
                },
            },
        },
    },
};
const found = omcFind.graph({ model, entityType: 'ProductionScene', template: chain });
{
    check('the top level keeps only the entities its filters match', names(found).join() === 'ps1', names(found).join());
    const [root] = found;
    check('a link keeps only the children its filters match', names(root.children).join() === 'ce11', names(root.children).join());
    check('links the template does not name are not followed', !names(root.children).includes('sl1'));
    const [event] = root.children;
    const [cp] = event.children;
    check('an unfiltered link keeps every child it reaches', names(event.children).join() === 'cp1');
    check('siblings are both followed, one by a link named differently from its type',
        names(cp.children).join() === 'as1,cd1', names(cp.children).join());
    const deviceNode = cp.children.find((node) => node.entity.entityType === 'CaptureDevice');
    check('and down to the last level', names(deviceNode.children).join() === 'in1');
    const infraNode = deviceNode.children[0];
    check('where the template ends, it says so', omcFind.children({ model, entity: infraNode.entity, spec: infraNode.spec }) === null);
}
{
    const all = omcFind.graph({ model, entityType: 'ProductionScene' });
    check('with no template, every entity of the type', names(all).join() === 'ps1,ps2');
    check('and no links followed', all.every((node) => node.children.length === 0));
}

if (failures) {
    console.error(`omcFind: ${failures} failed`);
    process.exit(1);
}
console.log('omcFind: OK');
