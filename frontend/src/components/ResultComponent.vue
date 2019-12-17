<template>
  <div class="result">
    <div class="result__container main-padding">
      <div class="row">
        <div class="col-12 col-xl-9">
          <search-results />
        </div>
        <div class="col-12 col-xl-3 result__filters">
          <form action="" class="bg-white">
            <div class="filter-sidebar">
              <div class="filter-sidebar__header">
                <h3 class="filter-sidebar__title">
                  <span>Flight Filters</span>
                  <span @click="clearFiltersAndUpdate">Clear All</span>
                </h3>
                <p>Filter by : Stops, Airlines,Times, and more</p>
              </div>
              <div class="filter-sidebar__body">
                <collapse :collapsed="false" title="Filter By Airlines">
                  <airline-filter
                    :data="filterableAirlines"
                    @select="toggleAirline"
                  />
                </collapse>
                <collapse title="Filter By Time">
                  <time-filter />
                </collapse>
                <collapse title="Filter By Stops">
                  <max-stops-filter
                    :data="form.maxStops"
                    @select="setMaxStops"
                  />
                </collapse>
                <collapse title="Filter By Price">
                  <price-filter @select="setPriceRange" />
                </collapse>
                <button
                  type="button"
                  class="btn btn-primary w-100"
                  @click="search({ clearFilters: false, saveSearch: false })"
                >
                  Update Result
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";
import FilterForm from "./FilterForm";
import AirlineFilter from "./AirlineFilter";
import MaxStopsFilter from "./MaxStopsFilter";
import PriceFilter from "./PriceFilter";
import TimeFilter from "./TimeFilter";
import SearchResults from "./SearchResults";
import Collapse from "./Collapse";

export default {
  mixins: [FilterForm],
  delimiters: ["{{", "}}"],
  components: {
    AirlineFilter,
    MaxStopsFilter,
    PriceFilter,
    TimeFilter,
    SearchResults,
    Collapse
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
