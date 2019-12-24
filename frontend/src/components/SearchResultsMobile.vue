<template>
  <div class="search-rmobile-view">
    <search-info-mobile
      :form="form"
      :sort-results-by="sortResultsBy"
      v-on:back-pressed="backPressed"
    />
    <search-result-mobile
      v-for="data in searchResults"
      :key="data"
      :data="data"
      @showPopup="showPopup"
    />
    <search-results-popup />
  </div>
</template>

<script>
import { showPopup } from "../utils/utils";
import Vuex from "vuex";
import SearchResultsPopup from "./SearchResultsPopup";
import SearchResultMobile from "./SearchResultMobile";
import SearchInfoMobile from "./SearchInfoMobile";

export default {
  methods: {
    backPressed() {
      this.$emit("back-pressed");
    },
    showPopup,
    ...Vuex.mapActions("search", ["sortResultsBy"])
  },
  delimiters: ["{{", "}}"],
  components: {
    SearchResultsPopup,
    SearchResultMobile,
    SearchInfoMobile
  },
  computed: {
    ...Vuex.mapState("search", ["searchProgress", "searchResults", "form"])
  }
};
</script>
