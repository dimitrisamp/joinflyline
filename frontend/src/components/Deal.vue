<template>
  <div class="tile__item" @click="searchMe">
    <div class="tile__item-left">
      <p class="tile__item-left-top--clickable">
        {{ deal.city_from_name }} ({{ deal.fly_from }}) ->
        {{ deal.city_to_name }} ({{ deal.fly_to }}) |
        {{ formatDateDeals(deal.departure_date) }} -
        {{ formatDateDeals(deal.return_date) }}
      </p>
      <p class="tile__item-left-bottom">
        {{ airlines }} ${{ price }} Round Trip
      </p>
    </div>
  </div>
</template>

<script>
import { airlineCodes } from "../utils/airlineCodes";
import { formatDateDeals } from "../utils/utils";
import Vuex from "vuex";

function splitLocation(location) {
  const parts = location.split(":");
  let type = "airport";
  let code;
  if (parts.length === 1) {
    code = parts[0];
  } else {
    [type, code] = parts;
  }
  return { code, type };
}

export default {
  props: ["deal"],
  delimiters: ["{{", "}}"],
  methods: {
    ...Vuex.mapMutations("search", ["setForm"]),
    ...Vuex.mapActions("search", ["search"]),
    formatDateDeals,
    searchMe() {
      this.setForm({
        place_from: {
          ...splitLocation(this.deal.fly_from),
          name: this.deal.city_from_name
        },
        place_to: {
          ...splitLocation(this.deal.fly_to),
          name: this.deal.city_to_name
        },
        adults: 1,
        children: 0,
        infants: 0,
        seat_type: "M",
        destination_type: "round",
        departure_date: this.deal.departure_date,
        return_date: this.deal.return_date
      });
      this.search({ clearFilters: true, saveSearch: true });
      this.$router.push({ name: "results" });
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
};
</script>
