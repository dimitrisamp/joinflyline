<template>
  <div class="flight__details">
    <ul class="clander-list">
      <li>{{ formatDate(flight.local_departure) }}</li>
      <li>{{ seatTypes[flight.fare_category] }}</li>
    </ul>

    <div class="detail-box">
      <p>
        {{ formatTime(flight.local_departure) }}
        <span>{{ flight.cityFrom }} {{ flight.flyFrom }}</span>
      </p>
      <p>
        {{ formatTime(flight.local_arrival) }}
        <span>{{ flight.cityTo }} {{ flight.flyTo }}</span>
      </p>
      <img :src="airlineIcon(flight.airline)" :alt="flight.airline" />
      <sub class="col-sub">{{ timeInterval(flight) }}</sub>
    </div>
  </div>
</template>

<script>
import {
  airlineIcon,
  seatTypes,
  formatDate,
  formatTime,
  secs2hm,
  timeInterval
} from "../utils/utils";

export default {
  props: ["flight"],
  data() {
    return {
      seatTypes
    };
  },
  methods: {
    airlineIcon,
    formatDate,
    secs2hm,
    formatTime,
    timeInterval
  },
  delimiters: ["{{", "}}"]
};
</script>
