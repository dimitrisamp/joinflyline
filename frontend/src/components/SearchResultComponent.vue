<template>
  <div class="result">
    <div class="result__container main-padding">
      <div class="row">
        <div class="col-12 col-xl-3 result__filters">
          <filter-form-component />
        </div>
        <div class="col-12 col-xl-9">
          <search-results />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";
import FilterForm from "./FilterForm";
import SearchResults from "./SearchResults";
import FilterFormComponent from "./FilterFormComponent";

export default {
  mixins: [FilterForm],
  delimiters: ["{{", "}}"],
  components: {
    FilterFormComponent,
    SearchResults
  },
  data() {
    return {
      searchProgress: false,
      user: {
        anonymous: true,
        value3: [0, 50]
      }
    };
  },
  methods: {
    ...Vuex.mapActions("search", ["sortResultsBy", "loadMore", "search"]),
    ...Vuex.mapMutations("search", ["toggleAirline"]),
    ...Vuex.mapMutations("search", ["setMaxStops"])
  },
  computed: {
    ...Vuex.mapState("search", ["form"]),
    ...Vuex.mapGetters("search", [
      "cityFromTo",
      "airlineNames",
      "filterableAirlines",
      "quickFiltersData",
      "finalResults"
    ])
  }
};
</script>
