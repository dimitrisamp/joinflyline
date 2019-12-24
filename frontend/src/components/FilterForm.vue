<script>
import { seatTypes } from "../utils/utils";
import Vuex from "vuex";

export const FilterForm = {
  data() {
    return {};
  },
  methods: {
    ...Vuex.mapMutations("search", [
      "setMaxStops",
      "setPriceRange",
      "toggleAirline"
    ]),
    ...Vuex.mapActions("search", ["search", "clearFiltersAndUpdate"])
  },
  computed: {
    ...Vuex.mapState("search", ["form"]),
    seatTypeName: st => seatTypes[st]
  }
};

export default FilterForm;
</script>
