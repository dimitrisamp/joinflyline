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
          {{ label }} from {{ form.cityFrom }}<br />
          {{ form.departure_date_data.format("ddd") }}
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
      limits: [0, 60 * 24]
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
    }
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
