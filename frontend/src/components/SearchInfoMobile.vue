<template>
  <div>
    <div class="m-view-filter">
      <ul>
        <li><img src="@/assets/img/Flyline_logo_1030-02.png" /></li>
        <li>
          <h3>
            {{ cityFromTo }}{{ roundTrip ? " and Back" : "" }}
            <router-link :to="{ name: 'index' }"
              ><img src="@/assets/img/back-pencil.png"
            /></router-link>
            <span>{{ dateFrom }} - {{ dateTo }}</span>
          </h3>
        </li>
      </ul>
    </div>
    <div class="s-result-tabs">
      <ul>
        <li v-for="(value, name) in sortOptions" :key="name">
          <a href="#" @click="sortResultsBy(name)">{{ value }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../utils/utils";
import Vuex from "vuex";

export default {
  data() {
    return {
      sortOptions: {
        quality: "Best",
        price: "Cheapest",
        duration: "Quickest"
      }
    };
  },
  props: ["form", "sortResultsBy", "placeTo", "placeFrom"],
  methods: {
    backPressed() {
      this.$emit("back-pressed");
    }
  },
  delimiters: ["{{", "}}"],
  computed: {
    cityFrom() {
      return this.placeFrom.code;
    },
    cityTo() {
      return this.placeTo.code;
    },
    roundTrip() {
      return this.form.destinationTypeId === "round";
    },
    dateFrom() {
      return formatDate(this.form.departure_date_data);
    },
    dateTo() {
      return formatDate(this.form.return_date_data);
    },
    ...Vuex.mapGetters("search", ["cityFromTo"])
  }
};
</script>
