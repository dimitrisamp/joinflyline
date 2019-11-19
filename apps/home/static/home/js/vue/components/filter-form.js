import {seatTypes} from "../../utils.js";

export const FilterForm = {
  data() {
    return {
    }
  },
  methods: {
    ...Vuex.mapMutations([
      "setMaxStops",
      "setPriceRange",
      "toggleAirline",
    ]),
    ...Vuex.mapActions(['search', 'clearFiltersAndUpdate'])
  },
  computed: {
    ...Vuex.mapState(['form']),
    seatTypeName: st => seatTypes[st],
  }
};
