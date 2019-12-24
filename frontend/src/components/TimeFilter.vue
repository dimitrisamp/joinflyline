<template>
  <tabs class="tabs--alpha-theme">
    <tab
      v-for="(label, direction, i) in timeLabels"
      :title="label"
      :selected="selectedTab === i"
      :key="`time-filters-tab-${i}`"
    >
      <div
        v-for="destination in destinations"
        class="filter-sidebar__item-spacing"
        :key="`block-${direction}-${destination}`"
      >
        <div class="filter-sidebar__item-text">
          {{ label }} {{ directionPrep[direction] }}
          {{ form[destinationKeys[destination]].code }}<br />
          {{ form[destinationDateKeys[destination]].format("ddd") }}
          {{
            `${formatMin(
              form.timeFilters[destination][direction][0]
            )} - ${formatMin(form.timeFilters[destination][direction][1])}`
          }}
        </div>
        <time-slider
          :value="form.timeFilters[destination][direction]"
          @change="select(destination, direction, ...arguments)"
        />
      </div>
    </tab>
  </tabs>
</template>

<script>
import { formatMin } from "../utils/utils";
import Vuex from "vuex";
import Tabs from "./Tabs";
import Tab from "./Tab";
import TimeSlider from "./TimeSlider";

const timeLabels = {
  takeoff: "Take-off",
  landing: "Landing"
};

const directionPrep = {
  takeoff: "from",
  landing: "to"
};

const destinationKeys = {
  departure: "placeFrom",
  return: "placeTo"
};

const destinationDateKeys = {
  departure: "departure_date_data",
  return: "return_date_data"
};

export default {
  delimiters: ["{{", "}}"],
  components: {
    Tabs,
    Tab,
    TimeSlider
  },
  data() {
    return {
      timeLabels: timeLabels,
      selectedTab: 0,
      limits: [0, 60 * 24 - 1],
      destinationKeys,
      destinationDateKeys,
      directionPrep
    };
  },
  methods: {
    ...Vuex.mapActions("search", ["setTimeFilters"]),
    text(destination, direction) {
      return this.form.timeFilters[destination][direction]
        .map(formatMin)
        .join(" - ");
    },

    select(destination, direction, value) {
      const payload = {
        destination,
        direction,
        value
      };
      this.setTimeFilters(payload);
    },
    formatMin
  },
  computed: {
    destinations() {
      if (this.form.destinationTypeId === "round")
        return ["departure", "return"];
      return ["departure"];
    },
    ...Vuex.mapState("search", ["form"])
  }
};
</script>
