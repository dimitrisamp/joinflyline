import { secs2hm, pick, stripAirlines } from "../../utils.js";
import { legacyAirlines, lowcostAirlines } from "../../airlineCodes.js";


Vue.component("quicklinks", {
  template: "#vue-quicklinks-template",
  props: ["data", "sort", "airlinesFilter"],
  delimiters: ["{(", ")}"],
  computed: {
    ...Vuex.mapState(["user", "form"]),
    airlineFilters() {
      const legacySet = new Set(legacyAirlines);
      const lowcostSet = new Set(lowcostAirlines);
      const legacyAvailable = this.form.airlines.filter(o =>
        legacySet.has(o.code)
      );
      const lowcostAvailable = this.form.airlines.filter(o =>
        lowcostSet.has(o.code)
      );
      return {
        legacy:
          legacyAvailable.length > 0
            ? stripAirlines(pick(legacyAvailable).name)
            : null,
        lowcost:
          lowcostAvailable.length > 0
            ? stripAirlines(pick(lowcostAvailable).name)
            : null
      };
    },
    columns() {
      const additionalCol =
        this.user && this.user.anonymous ? { date: "Earliest" } : {};
      return {
        price: "Cheapest",
        quality: "Recommended",
        duration: "Quickest",
        ...additionalCol
      };
    }
  },
  methods: {
    secs2hm,
    ...Vuex.mapActions(["sortResultsBy", "applyAirlinesFilter"])
  }
});
