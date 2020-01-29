import { select, boolean, text } from '@storybook/addon-knobs';
import {
    toRefs, reactive, ref, computed,
} from '@vue/composition-api';
import { action } from '@storybook/addon-actions';
import PDynamicField from './DynamicField.vue';
import md from './DynamicField.md';

export default {
    title: 'organisms/dynamic-view/dynamic-field',
    component: PDynamicField,
    parameters: {
        notes: md,
    },
};


export const defaultCase = () => ({
    components: { PDynamicField },
    template: '<div><li v-for="raw in data"><PDynamicField view_type="text"  :data="raw"/></li></div>',
    setup() {
        return {
            data: [
                'this is text field',
                { key: 'this is object' },
                ['this is array', 'test'],
            ],
        };
    },
});

export const datetimeType = () => ({
    components: { PDynamicField },
    template: '<div><li v-for="ex in data"><PDynamicField view_type="datetime"  :view_option="ex.option" :data="ex.raw"/></li></div>',
    setup() {
        return {
            data: [
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        source_type: 'iso861',
                    },
                    raw: '2013-02-08 09:30:26.123',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        source_type: 'iso861',
                        // eslint-disable-next-line camelcase
                        source_format: 'MM-DD-YYYY',
                    },
                    raw: '10-20-2019',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        source_type: 'iso861',
                        // eslint-disable-next-line camelcase
                        source_format: 'MM-DD-YYYY',
                        // eslint-disable-next-line camelcase
                        display_format: 'YYYY-MM-DD',
                    },
                    raw: '4-20-2019',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        source_type: 'timestamp',
                    },
                    raw: '1318781876406',
                },
            ],
        };
    },
});


export const unSupportType = () => ({
    components: { PDynamicField },
    template: '<div><li v-for="raw in data"><PDynamicField view_type="mr.peng"  :data="raw"/></li></div>',
    setup() {
        return {
            data: [
                'this is text field',
                { key: 'this is object' },
                ['this is array', 'test'],
            ],
        };
    },
});

export const stateType = () => ({
    components: { PDynamicField },
    template: '<div><li v-for="{option,raw} in data"><PDynamicField view_type="state"  :view_option="option" :data="raw"/></li></div>',
    setup() {
        return {
            data: [
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        text_color: '#60B731',
                        icon: {
                            image: 'ic_round',
                        },
                    },
                    raw: 'active',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        text_color: '#EF3817',
                        icon: {
                            image: 'ic_delete',
                            color: '#EF3817',
                        },
                    },
                    raw: 'deactive',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        text_color: '#FFCE02',
                        icon: {
                            image: 'aws-ec2',
                            color: '#FFCE02',
                        },
                    },
                    raw: 'use icon',
                },
            ],
        };
    },
});


export const badgeType = () => ({
    components: { PDynamicField },
    template: '<div><li v-for="ex in data"><PDynamicField view_type="badge"  :view_option="ex.option" :data="ex.raw"/></li></div>',
    setup() {
        return {
            data: [
                {
                    option: { },
                    raw: 'no option',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        text_color: '#60B731',
                    },
                    raw: 'test',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        background_color: '#60B731',
                    },
                    raw: 'sample',
                },
                {
                    option: {
                        // eslint-disable-next-line camelcase
                        text_color: 'yellow',
                        // eslint-disable-next-line camelcase
                        background_color: '#000000',
                    },
                    raw: '펭수',
                },

            ],
        };
    },
});


export const listType = () => ({
    components: { PDynamicField },
    template: '<div><li v-for="ex in example"><PDynamicField view_type="list"  :view_option="ex.option" :data="ex.data"/></li></div>',
    setup() {
        return {
            example: [
                {
                    option: {
                        item: {
                        // eslint-disable-next-line camelcase
                            view_option: {
                            // eslint-disable-next-line camelcase
                                text_color: '#FFCE02',
                                icon: {
                                    image: 'aws-ec2',
                                    color: '#FFCE02',
                                },
                            },
                            // eslint-disable-next-line camelcase
                            view_type: 'state',
                        },

                    },
                    data: ['펭하', '구독', '좋아요'],
                },
                {
                    option: {
                        item: {
                            // eslint-disable-next-line camelcase
                            view_option: {
                                // eslint-disable-next-line camelcase
                                background_color: '#FFCE02',
                            },
                            // eslint-disable-next-line camelcase
                            view_type: 'badge',
                        },

                    },
                    data: ['펭하', '구독', '좋아요'],
                },
                {
                    option: {
                        item: {
                            // eslint-disable-next-line camelcase
                            view_type: 'text',
                        },

                    },
                    data: ['펭하', '구독', '좋아요'],
                },

            ],
        };
    },
});


export const enumType = () => ({
    components: { PDynamicField },
    template: '<div><li v-for="d in data"><PDynamicField view_type="enum"  :view_option="option" :data="d"/></li></div>',
    setup() {
        return {
            option: {
                AWS: {
                    // eslint-disable-next-line camelcase
                    view_option: {
                        // eslint-disable-next-line camelcase
                        text_color: '#FF7750',
                        icon: {
                            image: 'aws-ec2',
                            color: '#FF7750',
                        },
                    },
                    // eslint-disable-next-line camelcase
                    view_type: 'state',
                },
                GCP: {
                    // eslint-disable-next-line camelcase
                    view_option: {
                        // eslint-disable-next-line camelcase
                        text_color: '#60B731',
                        icon: {
                            image: 'aws-ec2',
                            color: '#60B731',
                        },
                    },
                    // eslint-disable-next-line camelcase
                    view_type: 'state',
                },
                AZURE: {
                    // eslint-disable-next-line camelcase
                    view_option: {
                        // eslint-disable-next-line camelcase
                        text_color: '#0080FB',
                        icon: {
                            image: 'aws-ec2',
                            color: '#0080FB',
                        },
                    },
                    // eslint-disable-next-line camelcase
                    view_type: 'state',
                },
                AWSBadge: {
                    // eslint-disable-next-line camelcase
                    view_option: {
                        // eslint-disable-next-line camelcase
                        background_color: '#FF7750',
                    },
                    // eslint-disable-next-line camelcase
                    view_type: 'badge',
                },
                GCPBadge: {
                    // eslint-disable-next-line camelcase
                    view_option: {
                        // eslint-disable-next-line camelcase
                        background_color: '#60B731',
                    },
                    // eslint-disable-next-line camelcase
                    view_type: 'badge',
                },
                AZUREBadge: {
                    // eslint-disable-next-line camelcase
                    view_option: {
                        // eslint-disable-next-line camelcase
                        background_color: '#0080FB',
                    },
                    // eslint-disable-next-line camelcase
                    view_type: 'badge',
                },
            },
            data: ['AWS', 'GCP', 'AZURE', 'SpaceOne', 'AWSBadge', 'GCPBadge', 'AZUREBadge'],
        };
    },
});