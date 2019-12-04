import { airlineCodes } from "../../airlineCodes.js";
import { formatDateDeals } from "../../utils.js";

export const Deal = Vue.component("deal", {
  props: ["deal"],
  template: "#vue-deal-template",
  delimiters: ["[[", "]]"],
  methods: {
    ...Vuex.mapMutations(["setForm"]),
    ...Vuex.mapActions(["search"]),
    formatDateDeals,
    searchMe() {
      this.setForm({
        place_from: {
          code: this.deal.fly_from,
          name: this.deal.city_from_name,
          type: "airport"
        },
        place_to: {
          code: this.deal.fly_to,
          name: this.deal.city_to_name,
          type: "airport"
        },
        adults: 1,
        children: 0,
        infants: 0,
        seat_type: 'M',
        destination_type: 'round',
        departure_date: this.deal.departure_date,
        return_date: this.deal.return_date,
      });
      this.search({ clearFilters: true, saveSearch: true });
      this.$router.push({name: 'results'})
    }
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
