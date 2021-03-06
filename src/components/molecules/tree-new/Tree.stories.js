import {
    toRefs, reactive, ref, computed, Ref,
} from '@vue/composition-api';
import { action } from '@storybook/addon-actions';
import _ from 'lodash';
import { number, select, object } from '@storybook/addon-knobs/vue';
import PTree from './Tree.vue';
import TreeItem, { TreeState, TreeToolSet } from '@/components/molecules/tree-new/ToolSet';

export default {
    title: 'molecules/tree-new/Tree',
    component: PTree,
    parameters: {
        info: {
            summary: '',
            components: { PTree },
        },
        knobs: { escapeHTML: false },
    },
};

const actions = {
    'node:clicked': action('node:clicked'),
    'node:clicked:right': action('node:clicked:right'), // added event
    'node:selected': action('node:selected'),
    'node:unselected': action('node:unselected'),
    'node:checked': action('node:checked'),
    'node:unchecked': action('node:unchecked'),
    'node:expanded': action('node:expanded'),
    'node:collapsed': action('node:collapsed'),
    'node:added': action('node:added'),
    'node:removed': action('node:removed'),
    'node:text:changed': action('node:text:changed'),
    'node:editing:start': action('node:editing:start'),
    'node:editing:stop': action('node:editing:stop'),
    'node:dragging:start': action('node:dragging:start'),
    'node:dragging:finish': action('node:dragging:finish'),
    'node:disabled': action('node:disabled'),
    'node:enabled': action('node:enabled'),
    'node:shown': action('node:shown'),
    'node:hidden': action('node:hidden'),
    'node:dblclick': action('node:dblclick'),
    'tree:mounted': action('tree:mounted'),
    'tree:filtered': action('tree:filtered'),
    'tree:data:fetch': action('tree:data:fetch'),
    'tree:data:received': action('tree:data:received'),
    'tree:clicked:right': action('tree:clicked:right'), // added event
};

export const defaultCase = () => ({
    components: { PTreeNew: PTree },
    template: '<p-tree-new v-bind="state" v-on="actions"></p-tree-new>',
    setup(props, context) {
        const state = new TreeState().state;

        const arr = _.range(5);
        arr.forEach((i) => {
            state.data.push(new TreeItem(`Item ${i}`));
        });

        return {
            state,
            actions,
        };
    },
});

export const redefineData = () => ({
    components: { PTreeNew: PTree },
    template: `<div>
        <p-tree-new v-bind="state"  v-on="actions"></p-tree-new>
        <br>
        <hr>
        <br>
        <div style="display: flex;">
            <div>
                <h4>data</h4>
                <pre>{{state.data}}</pre>
            </div>
            <div>
                <h4>options</h4>
                <pre>{{state.options}}</pre>
            </div>
        </div>
    </div>
    `,
    setup(props, context) {
        const state = new TreeState().state;

        state.data = [
            { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 1' },
            { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 2' },
            {
                'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3',
                kids: [
                    { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.1' },
                    {
                        'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.2',
                        kids: [
                            { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.2.1' },
                            { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.2.2' },
                            {
                                'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.2.3',
                                kids: [
                                    { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.2.3.1' },
                                    { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.2.3.2' },
                                    { 'SOME-AWESOME-PROPERTY-FOR-TEXT': 'Item 3.2.3.3' },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
        state.options = {
            propertyNames: {
                text: 'SOME-AWESOME-PROPERTY-FOR-TEXT',
                children: 'kids',
            },
        };
        return {
            state,
            actions,
        };
    },
});

export const asyncData = () => ({
    components: { PTreeNew: PTree },
    template: `<div>
        <p-tree-new v-bind="state"
                    v-on="actions"
        >
        </p-tree-new>
        <br>
        <hr>
        <br>
        <div style="display: flex;">
            <div>
                <h4>options</h4>
                <pre>{{state.options}}</pre>
            </div>
        </div>
    </div>
    `,
    setup(props, context) {
        const state = new TreeState().state;

        let count = 0;

        const getData = () => new Promise((resolve) => {
            setTimeout(() => {
                state.data = [{
                    id: `pg-e1c7d31869a${count}`,
                    name: `pg ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: true,
                }, {
                    id: `project-e1c7d31869a${count}`,
                    name: `project ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: false,
                }];
                count += 1;
                resolve(state.data);
            }, 1000);
        });

        state.options = {
            async fetchData(node) {
                state.loading = true;
                const res = await getData();
                state.loading = false;
                return res;
            },
            propertyNames: {
                id: 'id',
                text: 'name',
                isBatch: 'has_child',
            },
        };

        return {
            state,
            actions,
        };
    },
});


export const dragAndDrop = () => ({
    components: { PTreeNew: PTree },
    template: `<div>
        <p-tree-new v-bind="state"
                    v-on="actions"
        >
        </p-tree-new>
        <br>
        <hr>
        <br>
        <div style="display: flex;">
            <div>
                <h4>options</h4>
                <pre>{{state.options}}</pre>
            </div>
        </div>
    </div>
    `,
    setup(props, context) {
        const state = new TreeState().state;

        let count = 0;

        const getData = () => new Promise((resolve) => {
            setTimeout(() => {
                state.data = [{
                    id: `pg-e1c7d31869a${count}`,
                    name: `pg ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: true,
                    item_type: 'PROJECT_GROUP',
                }, {
                    id: `project-e1c7d31869a${count}`,
                    name: `project ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: false,
                    item_type: 'PROJECT',
                }];
                count += 1;
                resolve(state.data);
            }, 1000);
        });

        state.options = {
            async fetchData(node) {
                state.loading = true;
                const res = await getData();
                res.forEach((d) => {
                    d.data = { type: d.item_type };
                });
                state.loading = false;
                return res;
            },
            propertyNames: {
                id: 'id',
                text: 'name',
                isBatch: 'has_child',
                data: 'data',
            },
            dnd: {
                onDragStart(node) {
                    return node.depth !== 0;
                },
                onDragOn(targetNode, destinationNode) {
                    return true;
                },
                onDragFinish(targetNode, destinationNode) {
                    if (destinationNode.data.type === 'PROJECT') {
                        window.alert('can not drag to project type');
                        return false;
                    }
                    if (destinationNode.depth === 0) {
                        window.alert('can not drag to root');
                        return false;
                    }
                    return true;
                },
            },
        };

        return {
            state,
            actions,
        };
    },
});


export const deletion = () => ({
    components: { PTreeNew: PTree },
    template: `<div>
        <p-tree-new ref="tree" 
                    v-bind="state"
                    v-on="actions"
                    @node:clicked="nodeClick"
        >
        </p-tree-new>
        <br>
        <hr>
        <br>
        <h3>Click the tree node for deletion</h3>
        <div style="display: flex;">
            <div>
                <h4>options</h4>
                <pre>{{state.options}}</pre>
            </div>
        </div>
    </div>
    `,
    setup(props, context) {
        const state = new TreeState().state;

        let count = 0;

        const getData = () => new Promise((resolve) => {
            setTimeout(() => {
                state.data = [{
                    id: `pg-e1c7d31869a${count}`,
                    name: `pg ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: true,
                    item_type: 'PROJECT_GROUP',
                }, {
                    id: `project-e1c7d31869a${count}`,
                    name: `project ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: false,
                    item_type: 'PROJECT',
                }];
                count += 1;
                resolve(state.data);
            }, 1000);
        });

        state.options = {
            async fetchData(node) {
                state.loading = true;
                const res = await getData();
                res.forEach((d) => {
                    d.data = { type: d.item_type };
                });
                state.loading = false;
                return res;
            },
            propertyNames: {
                id: 'id',
                text: 'name',
                isBatch: 'has_child',
                data: 'data',
            },
        };

        const tree = ref(null);
        const nodeClick = (node) => {
            if (node.depth === 0) {
                window.alert('can not remove root node');
                return;
            }

            tree.value.deleteNode(node);
        };

        return {
            state,
            tree,
            actions,
            nodeClick,
        };
    },
});


export const add = () => ({
    components: { PTreeNew: PTree },
    template: `<div>
        <p-tree-new ref="tree" 
                    v-bind="state"
                    v-on="actions"
                    @node:clicked="nodeClick"
        >
        </p-tree-new>
        <br>
        <hr>
        <br>
        <h3>Click the target node where you want to add</h3>
        <h3>Select add mode below: </h3>
        <span v-for="(mode, idx) in addMode"
              :style="{backgroundColor: addModeIdx === idx ? 'pink' : 'transparent'}"
              style="padding: 15px; display: inline-block; cursor: pointer;"
              @click="addModeIdx = idx"
        >{{mode}}</span>
    </div>
    `,
    setup(props, context) {
        const state = new TreeState().state;

        let count = 0;

        const getData = () => new Promise((resolve) => {
            setTimeout(() => {
                state.data = [{
                    id: `pg-e1c7d31869a${count}`,
                    name: `pg ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: true,
                    item_type: 'PROJECT_GROUP',
                }, {
                    id: `project-e1c7d31869a${count}`,
                    name: `project ${count}`,
                    // eslint-disable-next-line camelcase
                    has_child: false,
                    item_type: 'PROJECT',
                }];
                count += 1;
                resolve(state.data);
            }, 1000);
        });

        state.options = {
            async fetchData(node) {
                state.loading = true;
                const res = await getData();
                res.forEach((d) => {
                    d.data = { type: d.item_type };
                });
                state.loading = false;
                return res;
            },
            propertyNames: {
                id: 'id',
                text: 'name',
                isBatch: 'has_child',
                data: 'data',
            },
        };

        const tree = ref(null);
        const addMode = ['append', 'prepend', 'before', 'after'];
        const addModeIdx = ref(0);
        const nodeClick = (node) => {
            tree.value.addNode(node, 'new Node!', addMode[addModeIdx.value]);
        };

        return {
            state,
            tree,
            addMode,
            addModeIdx,
            actions,
            nodeClick,
        };
    },
});


export const selectMode = () => ({
    components: { PTreeNew: PTree },
    template: `<div>
        <p-tree-new v-bind="state" :selectMode="true" v-on="actions"></p-tree-new>
        <br>
        <hr>
        <br>
        <div style="display: flex;">
            <div>
                <h4>data</h4>
                <pre>{{state.data}}</pre>
            </div>
            <div>
                <h4>options</h4>
                <pre>{{state.options}}</pre>
            </div>
        </div>
    </div>
    `,
    setup(props, context) {
        const state = new TreeState().state;

        state.data = [
            { text: 'Item 1' },
            { text: 'Item 2' },
            {
                text: 'Item 3',
                kids: [
                    { text: 'Item 3.1' },
                    {
                        text: 'Item 3.2',
                        kids: [
                            { text: 'Item 3.2.1' },
                            { text: 'Item 3.2.2' },
                            {
                                text: 'Item 3.2.3',
                                kids: [
                                    { text: 'Item 3.2.3.1' },
                                    { text: 'Item 3.2.3.2' },
                                    { text: 'Item 3.2.3.3' },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
        state.options = {
            propertyNames: {
                text: 'text',
                children: 'kids',
            },
        };
        return {
            state,
            actions,
        };
    },
});

export const useToolSet = () => ({
    components: { PTree },
    template: `<div>
        <p-tree
                ref="treeApi"
                v-bind="treeTs.state"
                v-on="actions"
                @node:selected="update"
                @node:unselected="update"
        ></p-tree>
        <br>
        <hr>
        <br>
        <div style="display: flex;">
            <div>
                <h4>select node</h4>
                <pre>{{treeTs.metaState.selectedNode}}</pre>
            </div>
            <div>
                <h4>first select node</h4>
                <pre>{{treeTs.metaState.firstSelectedNode}}</pre>
            </div>
        </div>
    </div>
    `,
    setup(props, context) {
        const treeTs = new TreeToolSet();

        treeTs.state.data = [
            { text: 'Item 1' },
            { text: 'Item 2' },
            {
                text: 'Item 3',
                kids: [
                    { text: 'Item 3.1' },
                    {
                        text: 'Item 3.2',
                        kids: [
                            { text: 'Item 3.2.1' },
                            { text: 'Item 3.2.2' },
                        ],
                    },
                ],
            },
        ];
        treeTs.state.options = {
            propertyNames: {
                text: 'text',
                children: 'kids',
            },
        };
        return {
            actions,
            treeTs,
            treeApi: treeTs.treeRef,
            update: (event) => {
                treeTs.getSelectedNode(event);
            },
        };
    },
});
