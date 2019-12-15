import { PopupSelect } from "./popup-select.js";
import { maxStopsFilterOptions } from "../../utils.js";

export const MaxStopsFilter = Vue.component("max-stops-filter", {
  extends: PopupSelect,
  props: ['data'],
  data() {
    return {
      maxStopsFilterOptions
    };
  },
  methods: {
    select(data) {
      this.$emit('select', parseInt(data));
      this.close();
    }
  },
  computed: {
    text() {
      return this.maxStopsFilterOptions[this.data];
    }
  },
  template: "#vue-max-stops-filter-template",
  delimiters: ["[[", "]]"]
});
