import {seatTypes} from "../../utils.js";

export const FilterForm = {
  data() {
    return {
    }
  },
  methods: {
    ...Vuex.mapMutations([
      "clearFilters",
      "setMaxStops",
      "setPriceRange",
      "toggleAirline",
    ]),
  },
  computed: {
    ...Vuex.mapState(['form']),
    seatTypeName: st => seatTypes[st],
  }
};
