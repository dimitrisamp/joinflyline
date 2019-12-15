import { formatMin } from "../../utils.js";

const timeLabels = {
  takeoff: "Take-off",
  landing: "Landing"
};

export const TimeFilter = Vue.component("time-filter", {
  template: "#vue-time-filter-template",
  delimiters: ["[[", "]]"],
  data() {
    return {
      timeLabels: timeLabels,
      selectedTab: 0,
      limits: [0, 60 * 24]
    };
  },
  methods: {
    ...Vuex.mapActions("search", ["setTimeFilters"]),
    text(destination, direction) {
      return this.form.timeFilters[destination][direction].map(formatMin).join(" - ");
    },

    select(destination, direction, value) {
      const payload = {
        destination,
        direction,
        value
      };
      this.setTimeFilters(payload)
    }
  },
  computed: {
    destinations() {
      if (this.form.destinationTypeId === "round")
        return ["departure", "return"];
      return ["departure"];
    },
    ...Vuex.mapState("search", ["form"]),
  }
});
