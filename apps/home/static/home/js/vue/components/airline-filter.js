import {PopupSelect} from "./popup-select.js";
import {airlineIcon} from "../../utils.js";

export const AirlineFilter = Vue.component("airline-filter", {
  extends: PopupSelect,
  template: "#vue-airline-filter-template",
  props: ['data'],
  data() {
    return {
      text: "",
    }
  },
  methods: {
    airlineIcon,
    select(value) {
      this.$emit('select', value)
    }

  },
  delimiters: ["[[", "]]"]
});
