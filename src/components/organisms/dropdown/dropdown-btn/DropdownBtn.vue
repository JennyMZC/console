<template>
    <div class="dropdown-btn-container" :class="{block}">
        <p-button :disabled="disabled"
                  :class="btnClassObject"
                  class="dropdown-btn menu-btn"
                  @click="onClick"
                  @mouseover="onMouseOver"
                  @mouseout="onMouseOut"
        >
            <slot />
        </p-button>
        <p-icon-button class="dropdown-btn dropdown-toggle-split"
                       :class="btnClassObject"
                       :name="popup ? 'ic_arrow_top' : 'ic_arrow_bottom'"
                       :disabled="disabled"
                       :color="`transparent ${ disabled ? colorSets.disabled : popup||mouseover ? colorSets.popup : colorSets.mouseover}`"
                       :hover-color="iconHoverColor"
                       button-style="white"
                       @click="onClick"
                       @mouseenter="onMouseOver"
                       @mouseleave="onMouseOut"
        />
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import PButton from '@/components/atoms/buttons/Button.vue';
import PIconButton from '@/components/molecules/buttons/IconButton.vue';

export default defineComponent({
    name: 'PDropdownBtn',
    components: { PButton, PIconButton },
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        popup: {
            type: Boolean,
            default: false,
        },
        block: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // Consider to specify color according to Jenny's
            colorSets: {
                disabled: '#A7A9B2',
                popup: '#0080FB',
                mouseover: '#222532',
            },
            mouseover: false,
            iconHoverColor: 'transparent inherit',
        };
    },
    computed: {
        btnClassObject() {
            return {
                'dropdown-opened': this.popup,
                'dropdown-mouseover': this.mouseover,
                block: this.block,
            };
        },
    },
    methods: {
        onClick(event) {
            this.$emit('click', event);
            this.$emit('update:popup', !this.popup);
        },
        onMouseOver() {
            if (!this.disabled) {
                this.mouseover = true;
            }
        },
        onMouseOut() {
            if (!this.disabled) {
                this.mouseover = false;
            }
        },
    },

});
</script>

<style lang="postcss" scoped>
.dropdown-btn-container {
    display: inline-flex;
    &.block {
        display: flex;
    }
}
.dropdown-btn{
    @apply bg-white border-gray2;
    border-bottom-width: 1px;
    border-style: solid;
    min-width: 2rem;
    &:hover {
        @apply text-secondary;
    }
    &.disabled{
        @apply border-gray2 bg-gray2 text-gray1;
    }
    &:not(:disabled):not(.disabled):hover{
        @apply border-secondary bg-white text-secondary;
    }
}
.dropdown-toggle-split{
    min-width:2rem;
    max-width:2rem;
    border-radius: 0px 2px 2px 0px;
}
.menu-btn{
    @apply text-dark;
    min-width: 6.5rem;
    width: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    border-radius: 2px 0px 0px 2px;
    text-align: left;
    justify-content: flex-start;
    margin-right: -4px;
    &.block {
        width: 100%;
    }
}

.dropdown-mouseover, .dropdown-opened{
    border-color: theme('colors.secondary') !important;
    color: theme('colors.secondary') !important;
}


</style>
