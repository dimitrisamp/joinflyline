import { PopupSelect } from "./popup-select.js";

export const PriceFilter = Vue.component("price-filter", {
  template: "#vue-price-filter-template",
  extends: PopupSelect,
  props: ["data"],
  delimiters: ["[[", "]]"],
  components: {
    VueSlider: window["vue-slider-component"]
  },
  methods: {
    select(value) {
      this.$emit('select', value);
    }
  },
  computed: {
    text() {
      const [a, b] = this.data;
      return `$${a}-$${b}`;
    }
  }
});
