import {PopupSelect} from "./popup-select.js";
import {airlineIcon} from "../../utils.js";

export const AirlineFilter = Vue.component("airline-filter", {
  extends: PopupSelect,
  template: "#vue-airline-filter-template",
  props: ['data', 'prices'],
  methods: {
    airlineIcon,
    select(airlineCode) {
      this.$emit('select', airlineCode);
    }
  },
  computed: {
    text() {
      return this.data.filter(a=>a.checked).map(a=>a.name).join(', ');
    }
  },
  delimiters: ["[[", "]]"]
});
