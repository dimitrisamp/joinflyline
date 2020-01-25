<template>
  <div class="search-rmobile-view">
    <search-info-mobile
      :form="form"
      :sort-results-by="sortResultsBy"
      v-on:back-pressed="backPressed"
    />
    <template v-if="user.anonymous">
      <search-result-mobile
        v-for="data in finalResults.slice(0, 2)"
        :key="data.id"
        :data="data"
      />
      <div v-if="user.anonymous" class="fake-results">
        <search-result-mobile
          v-for="data in finalResults.slice(2, 4)"
          :key="data.id"
          :data="data"
        />
        <overlay-component
          v-if="user.anonymous"
          :link="{ name: 'get-started' }"
          label="View them all"
        >
          <h5 class="overlay-component__heading">
            Create Your FlyLine Account to view all of our flights
          </h5>
          <p>
            We have thousands of flights from hundreds of carriers upgrade to
            FlyLine Basic or Premium to view thew all!
          </p>
        </overlay-component>
      </div>
    </template>
    <template v-else>
      <search-result-mobile
        v-for="data in finalResults"
        :key="data.id"
        :data="data"
      />
    </template>
  </div>
</template>

<script>
import Vuex from "vuex";
import SearchResultMobile from "./SearchResultMobile";
import SearchInfoMobile from "./SearchInfoMobile";
import OverlayComponent from "./OverlayComponent";

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
    SearchInfoMobile,
    OverlayComponent
  },
  computed: {
    ...Vuex.mapState("search", ["searchProgress", "form"]),
    ...Vuex.mapState("user", ["user"]),
    ...Vuex.mapGetters("search", ["finalResults"])
  }
};
</script>
