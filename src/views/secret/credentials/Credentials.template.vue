<template>
    <general-page-layout>
        <p-horizontal-layout>
            <template #container="{ height }">
                <p-toolbox-table
                    ref="toolbox"
                    :items="items"
                    :fields="fields"
                    :selectable="true"
                    :sortable="true"
                    :dragable="true"
                    :hover="true"
                    :responsive="true"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :all-page="allPage"
                    :this-page.sync="thisPage"
                    :select-index.sync="selectIndex"
                    :page-size.sync="pageSize"
                    :responsive-style="{'height': height+'px', 'overflow-y':'auto','overflow-x':'auto'}"
                    :setting-visible="false"
                    :loading="loading"
                    :use-spinner-loading="true"
                    :use-cursor-loading="true"
                    @changePageSize="getCredentials"
                    @changePageNumber="getCredentials"
                    @clickRefresh="getCredentials"
                    @changeSort="getCredentials"
                >
                    <template #col-credential_group_id-format="{item}">
                        <div>
                            <PBadge v-for="(label, idx) in item.credential_groups" :key="idx" class="p-label"
                                    style-type="gray2"
                            >
                                {{ getEmptyString(label.name) }}
                            </PBadge>
                        </div>
                    </template>
                    <template slot="toolbox-left">
                        <p-button style-type="primary-dark" @click="clickCreate">
                            {{ $t('BTN.CREATE') }}
                        </p-button>
                        <PDropdownMenuBtn
                            id="server-dropdown-btn"
                            class="left-toolbox-item"
                            :menu="dropdown"
                            @click-delete="clickDelete"
                        >
                            Action
                        </PDropdownMenuBtn>
                        <div class="left-toolbox-item">
                            <p-search :search-text.sync="searchText" @onSearch="getCredentials" />
                        </div>
                    </template>
                    <template #col-created_at-format="data">
                        {{ timestampFormatter(data.value) }}
                    </template>
                </p-toolbox-table>
            </template>
        </p-horizontal-layout>
        <PTab v-if="isSelectedOne" :tabs="tabs" :active-tab.sync="activeTab">
            <template #detail="{tabName}">
                <p-credentials-detail ref="credentialsDetail"
                                      :item="items[selectIndex[0]]"
                                      :tag-confirm-event="tagConfirmEvent"
                                      :tag-reset-event="tagResetEvent"
                />
            </template>
        </PTab>
        <PTab v-else-if="isSelectedMulti" :tabs="multiSelectTabs" :active-tab.sync="multiSelectActiveTab">
            <template #data="{tabName}">
                <p-data-table
                    :fields="multiSelectFields"
                    :sortable="false"
                    :selectable="false"
                    :items="getSelectedCredentialsItems"
                    :col-copy="true"
                />
            </template>
        </PTab>

        <div v-else id="empty-space">
            Select a Credentials from above in details.
        </div>
        <p-table-check-modal
            v-if="!!checkTableModalState.mode && checkTableModalState.visible"
            :visible.sync="checkTableModalState.visible"
            :header-title="checkTableModalState.title"
            :sub-title="checkTableModalState.subTitle"
            :theme-color="checkTableModalState.themeColor"
            :fields="multiSelectFields"
            size="lg"
            :centered="true"
            :selectable="false"
            :double-confirm="doubleState.doubleConfirm"
            :double-confirm-origin="doubleState.origin"
            :double-confirm-title="doubleState.title"
            :double-confirm-place-holder="doubleState.placeHolder"
            :items="getSelectedCredentialsItems"
            @confirm="checkModalConfirm"
        />
        <p-credentials-form v-if="credentialsFormState.visible"
                            ref="CREDENTIAL_FORM"
                            :header-title="credentialsFormState.headerTitle"
                            :update-mode="credentialsFormState.updateMode"
                            :item="credentialsFormState.item"
                            :visible.sync="credentialsFormState.visible"
                            :dynamic-form-state="dynamicFormTemp"
                            @confirm="credentialsFormConfirm"
                            @close="credentialsFormCancel"
        />
    </general-page-layout>
</template>

<script>
import {
    reactive, toRefs, ref, computed,
} from '@vue/composition-api';
import PButton from '@/components/atoms/buttons/Button.vue';
import { requestToolboxTableMetaReactive } from '@/components/organisms/tables/toolbox-table/ToolboxTable.util';
import { timestampFormatter, getValue } from '@/lib/util';
import { makeTrItems } from '@/lib/view-helper';
import credentialsEventBus from '@/views/secret/credentials/CredentialsEventBus';
import PCredentialsForm from '@/views/secret/credentials/modules/CredentialsForm.vue';
import PBadge from '@/components/atoms/badges/Badge.vue';
import GeneralPageLayout from '@/views/containers/page-layout/GeneralPageLayout.vue';

const PTab = () => import('@/components/organisms/tabs/tab/Tab');
const PDataTable = () => import('@/components/organisms/tables/data-table/DataTable');
const PHorizontalLayout = () => import('@/components/organisms/layouts/horizontal-layout/HorizontalLayout');
const PToolboxTable = () => import('@/components/organisms/tables/toolbox-table/ToolboxTable');
const PDropdownMenuBtn = () => import('@/components/organisms/dropdown/dropdown-menu-btn/DropdownMenuBtn');
const PSearch = () => import('@/components/molecules/search/Search');
const PCredentialsDetail = () => import('@/views/secret/credentials/modules/CredentialsDetail');
const PTableCheckModal = () => import('@/components/organisms/modals/action-modal/ActionConfirmModal');

export const getDataInputType = () => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const plugin_id = url.searchParams.get('plugin_id');
    const repository_id = url.searchParams.get('repository_id');
    return plugin_id;
};

export const CredentialsTableReactive = parent => reactive({
    fields: makeTrItems([
        ['credential_id', 'COMMON.ID', { style: { width: '400px' } }],
        ['name', 'COMMON.NAME', { style: { width: '400px' } }],
        ['issue_type', 'COMMON.ISSUE_TYPE', { style: { width: '400px' } }],
        ['credential_group_id', 'COMMON.GROUP', { style: { width: '800px' }, sortable: false }],
        ['created_at', 'COMMON.CREATED', { style: { width: '300px' } }],
    ],
    parent),
    multiSelectFields: makeTrItems([
        ['credential_id', 'COMMON.ID', { style: { width: '400px' } }],
        ['name', 'COMMON.NAME', { style: { width: '600px' } }],
    ],
    parent),
    selectIndex: [],
    items: [],
    searchText: '',
    loading: false,
    toolbox: null, // template refs
});

export const eventNames = {
    tagResetEvent: '',
    tagConfirmEvent: '',
    getCredentialsList: '',
    deleteCredentials: '',
    createCredentials: '',
};

export const credentialsSetup = (props, context, eventName) => {
    const eventBus = credentialsEventBus;
    const tableState = CredentialsTableReactive(context.parent);
    const tabData = reactive({
        tabs: makeTrItems([
            ['detail', 'COMMON.DETAILS', { keepAlive: true }],
        ],
        context.parent),
        activeTab: 'detail',
        multiSelectTabs: makeTrItems([
            ['data', 'COMMON.DATA', { keepAlive: true }],
        ], context.parent),
        multiSelectActiveTab: 'data',
        credentialsDetail: null, // template refs
    });
    const tags = ref({});
    const tabAction = reactive({
        isSelectedOne: computed(() => tableState.selectIndex.length === 1),
        isSelectedMulti: computed(() => tableState.selectIndex.length > 1),
    });
    const state = requestToolboxTableMetaReactive();

    state.sortBy = 'name';

    state.daynamicForm = {
        form: [],
        value: {},
    };

    const dynamicFormTemp = computed(() => state.daynamicForm);

    const getCredentials = () => {
        eventBus.$emit(eventName.getCredentialsList);
    };

    const sortSelectIndex = computed(() => {
        console.debug('temp sortable', tableState.selectIndex);
        const idxs = [...tableState.selectIndex];
        idxs.sort((a, b) => a - b);
        console.debug('idxs', idxs);
        return idxs;
    });

    const isNotSelected = computed(() => tableState.selectIndex.length === 0);
    const isNotOnlyOneSelected = computed(() => tableState.selectIndex.length !== 1);

    const getSelectedCredentialsItems = computed(() => {
        const items = [];
        sortSelectIndex.value.forEach((idx) => {
            items.push(tableState.items[idx]);
        });
        return items;
    });

    const getPluginTemplate = () => {
        credentialsEventBus.$emit('getPluginCredentialsForm', { plugin_id: getDataInputType() });
    };

    const getSelectCredentialsIds = computed(() => {
        const ids = [];
        getSelectedCredentialsItems.value.forEach((item) => {
            ids.push(item.server_id);
        });
        return ids;
    });
    const getFirstSelectedCredentialsId = computed(() => (getSelectCredentialsIds.value.length >= 1 ? getSelectCredentialsIds[0] : ''));

    const credentialsFormState = reactive({
        visible: false,
        mode: '',
        headerTitle: '',
        item: null,
        eventName: '',
    });

    const clickCreate = () => {
        credentialsFormState.updateMode = false;
        credentialsFormState.headerTitle = 'Create Credentials';
        credentialsFormState.item = null;
        credentialsFormState.eventName = eventNames.createCredentials;
        credentialsFormState.visible = true;
    };

    const credentialsFormConfirm = (item) => {
        eventBus.$emit(credentialsFormState.eventName, item);
        credentialsFormState.visible = false;
        credentialsFormState.mode = '';
    };
    const credentialsFormCancel = () => {
        credentialsFormState.visible = false;
        credentialsFormState.mode = '';
    };


    const checkTableModalState = reactive({
        visible: false,
        mode: '',
        item: null,
        confirmEventName: '',
        title: '',
        subTitle: '',
        themeColor: '',
    });

    const doubleState = reactive({
        doubleConfirm: true,
        origin: '',
        title: '',
        placeHolder: 'Please, enter the name from above to delete selected item.',
    });

    const resetCheckTableModalState = () => {
        checkTableModalState.visible = false;
        checkTableModalState.mode = '';
        checkTableModalState.confirmEventName = '';
        checkTableModalState.title = '';
        checkTableModalState.subTitle = '';
        checkTableModalState.themeColor = '';
    };

    const clickDelete = () => {
        const selectedItemName = tableState.items[tableState.selectIndex].name;
        doubleState.origin = selectedItemName;
        doubleState.title = `Type ${selectedItemName} to confirm`;
        doubleState.placeHolder = `Please, enter the name from above to delete selected item: ${selectedItemName} .`;
        checkTableModalState.mode = 'delete';
        checkTableModalState.confirmEventName = eventNames.deleteCredentials;
        checkTableModalState.title = 'Delete Credentials';
        checkTableModalState.subTitle = 'Are you sure you want to delete selected Credentials below?';
        checkTableModalState.themeColor = 'alert';
        checkTableModalState.visible = true;
    };

    const getEmptyString = object => (_.isEmpty(object) ? '' : object);

    const checkModalConfirm = (event) => {
        console.debug(checkTableModalState.confirmEventName, event);
        eventBus.$emit(checkTableModalState.confirmEventName, event);
        resetCheckTableModalState();
        console.debug('tableState.selectIndex', tableState.selectIndex);
        tableState.selectIndex = [];
        console.debug('tableState.selectIndex', tableState.selectIndex);
    };

    const dropdownMenu = reactive({
        ...makeTrItems([
            ['delete', 'BTN.DELETE', { disabled: isNotOnlyOneSelected }],
        ],
        context.parent,
        { type: 'item' }),
    });

    if (!_.isEmpty(getDataInputType())) {
        getPluginTemplate();
    }

    return reactive({
        ...toRefs(state),
        ...toRefs(tableState),
        ...toRefs(tabData),
        ...toRefs(tabAction),
        checkTableModalState,
        doubleState,
        tags,
        dropdown: dropdownMenu,
        timestampFormatter,
        clickCollectData() {
            console.debug('add');
        },
        getCredentials,
        ...eventNames,
        getSelectedCredentialsItems,
        getSelectCredentialsIds,
        getFirstSelectedCredentialsId,
        credentialsFormState,
        dynamicFormTemp,
        clickCreate,
        credentialsFormConfirm,
        credentialsFormCancel,
        clickDelete,
        getEmptyString,
        checkModalConfirm,

    });
};

export default {
    name: 'CredentialsTemplate',
    filters: {
        getValue,
    },
    components: {
        GeneralPageLayout,
        PCredentialsForm,
        PButton,
        PHorizontalLayout,
        PToolboxTable,
        PDropdownMenuBtn,
        PCredentialsDetail,
        PTab,
        PDataTable,
        PSearch,
        PBadge,
        PTableCheckModal,
    },
    setup(props, context) {
        const dataBind = reactive({
            items: computed(() => []),
        });
        const state = credentialsSetup(props, context, dataBind.items);

        return {
            ...toRefs(state),
            ...toRefs(dataBind),
        };
    },
};

</script>

<style lang="postcss" scoped>
    .left-toolbox-item{
        margin-left: 1rem;
        &:last-child {
            flex-grow: 1;
        }
    }

    #empty-space{
        @apply text-primary2;
        text-align: center;
        margin-bottom: 0.5rem;
        font: 24px/32px Arial;
    }
    .p-label {
        @apply text-dark;
        left-margin: 0.5rem;
        margin-bottom:5px;
        margin-right: 0.5rem;
    }
</style>
