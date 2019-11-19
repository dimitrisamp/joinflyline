import { PopupSelect } from "./popup-select.js";
import { maxStopsFilterOptions } from "../../utils.js";

export const MaxStopsFilter = Vue.component("max-stops-filter", {
  extends: PopupSelect,
  data() {
    return {
      text: "",
      data: maxStopsFilterOptions
    };
  },
  methods: {
    select(data) {
      this.text = this.data[data];
      this.$emit('select', data);
      this.close();
    }
  },
  template: "#vue-max-stops-filter-template",
  delimiters: ["[[", "]]"]
});
