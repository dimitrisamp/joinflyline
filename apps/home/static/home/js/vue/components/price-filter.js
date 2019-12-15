import { PopupSelect } from "./popup-select.js";
import {debounce} from "../../utils.js";

export const PriceFilter = Vue.component("price-filter", {
  template: "#vue-price-filter-template",
  extends: PopupSelect,
  delimiters: ["[[", "]]"],
  components: {
    VueSlider: window["vue-slider-component"]
  },
  data() {
    const d = this.$store.getters['search/priceLimits'];
    return {
      limits: [d.min, d.max]
    };
  },
  methods: {
    select(value) {
      this.$emit("select", value);
    }
  },
  computed: {
    ...Vuex.mapGetters("search", ["priceLimits"]),
    text() {
      const [a, b] = this.data.limits;
      return `$${a}-$${b}`;
    }
  }
});
