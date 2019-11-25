import {PopupSelect} from "./popup-select.js";
import {seatTypes} from "../../utils.js";

export const SelectSeatType = Vue.component('select-seat-type', {
    extends: PopupSelect,
    template: '#vue-select-seat-type-template',
    props: ['value'],
    data() {
        return {
            seatTypes,
        }
    },
    methods: {
        select(value) {
            this.$emit('select', value);
            this.close();
        }
    },
    delimiters: ['[[', ']]'],
    computed: {
        text() {
            return seatTypes[this.value];
        }
    }
});
