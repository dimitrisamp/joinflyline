<template>
  <div class="search-rmobile-view">
    <search-info-mobile
      :form="form"
      :sort-results-by="sortResultsBy"
      v-on:back-pressed="backPressed"
    />
    <search-result-mobile
      v-for="data in finalResults"
      :key="data.id"
      :data="data"
    />
  </div>
</template>

<script>
import Vuex from "vuex";
import SearchResultMobile from "./SearchResultMobile";
import SearchInfoMobile from "./SearchInfoMobile";

export default {
  methods: {
    backPressed() {
      this.$emit("back-pressed");
    },
    bookFlight(index) {
      this.setSearchResultIndex(index);
      if (this.user.anonymous) {
        this.$router.push({ name: "search-booking" });
      } else {
        this.$router.push({ name: "booking" });
      }
    },
    ...Vuex.mapActions("search", ["sortResultsBy"])
  },
  delimiters: ["{{", "}}"],
  components: {
    SearchResultMobile,
    SearchInfoMobile
  },
  computed: {
    ...Vuex.mapState("search", ["searchProgress", "form"]),
    ...Vuex.mapGetters("search", ["finalResults"])
  }
};
</script>
