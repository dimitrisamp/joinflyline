<template>
  <ul>
    <li>
      <span class="info">{{ duration }}</span>
    </li>
    <li v-for="airline in airlines" :key="airline">
      <img :src="airlineIcon(airline)" alt="airline" />
    </li>
    <li>
      <span class="info">{{ stopOversText }}</span>
    </li>
    <li>
      <span class="info">{{ seatTypeText }}</span>
    </li>
  </ul>
</template>

<script>
import { airlineIcon, secs2hm, seatTypes } from "../utils/utils";

export default {
  props: ["duration", "airlines", "stopOvers", "seat_type"],
  delimiters: ["{{", "}}"],
  methods: {
    airlineIcon,
    secs2hm
  },
  computed: {
    stopOversText() {
      if (this.stopOvers === 0) return "Direct";
      if (this.stopOvers === 1) return "1 Stopover";
      return `${this.stopOvers} Stopovers`;
    },
    seatTypeText() {
      return seatTypes[this.seat_type];
    }
  }
};
</script>
