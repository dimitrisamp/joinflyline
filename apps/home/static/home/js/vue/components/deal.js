import { airlineCodes } from "../../airlineCodes.js";
import { formatDateDeals } from "../../utils.js";

function splitLocation(location) {
  const parts = location.split(':');
  let type = 'airport';
  let code;
  if (parts.length === 1) {
    code = parts[0];
  } else {
    [type, code] = parts;
  }
  return {code, type};
}

export const Deal = Vue.component("deal", {
  props: ["deal"],
  template: "#vue-deal-template",
  delimiters: ["[[", "]]"],
  methods: {
    ...Vuex.mapMutations('search', ["setForm"]),
    ...Vuex.mapActions('search', ["search"]),
    formatDateDeals,
    searchMe() {
      this.setForm({
        place_from: {
          ...splitLocation(this.deal.fly_from),
          name: this.deal.city_from_name,
        },
        place_to: {
          ...splitLocation(this.deal.fly_to),
          name: this.deal.city_to_name,
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
