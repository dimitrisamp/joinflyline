<template>
  <div class="filter-flights">
    <div
      v-for="(value, maxStops) in maxStopsFilterOptions"
      :key="`max-stops-${maxStops}`"
      class="filter-flights__item"
      @click="select(maxStops)"
    >
      <label class="control control--radio">
        <span>{{ value }}</span>
        <div
          class="control__indicator"
          :class="{ checked: data === parseInt(maxStops) }"
        ></div>
      </label>
      <div class="filter-flights__item-price">
        <!--{{ prices[airlineCode] }}-->
      </div>
    </div>
  </div>
</template>

<script>
import { maxStopsFilterOptions } from "../utils/utils";

export default {
  props: ["data"],
  data() {
    return {
      maxStopsFilterOptions
    };
  },
  methods: {
    select(data) {
      this.$emit("select", parseInt(data));
      this.close();
    }
  },
  computed: {
    text() {
      return this.maxStopsFilterOptions[this.data];
    }
  },
  delimiters: ["{{", "}}"]
};
</script>
