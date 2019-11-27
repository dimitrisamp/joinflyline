import { airlineCodes } from "../../airlineCodes.js";
import {formatDateDeals} from "../../utils.js";


export const Deal = Vue.component("deal", {
  props: ["deal"],
  template: "#vue-deal-template",
  delimiters: ["[[", "]]"],
  methods: {
    formatDateDeals,
  },
  computed: {
    airlines() {
      return this.deal.airlines
        .map(o => airlineCodes[o])
        .filter(o => o)
        .join(", ");
    },
    price() {
      return parseFloat(this.deal.price).toFixed(0);
    }
  }
});
