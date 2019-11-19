import {PopupSelect} from "./popup-select.js";
import {destinationTypes} from "../../utils.js";

export const SelectDestination = Vue.component('select-destination', {
  extends: PopupSelect,
  props: ['value'],
  data() {
    return {
      destinationTypes,
    }
  },
  methods: {
      select(value) {
          this.$emit('select', value);
          this.close();
      }
  },
  template: '#vue-select-destination-template',
  delimiters: ['[[', ']]'],
  computed: {
    text() {
      return this.destinationTypes[this.value];
    }
  }
});
