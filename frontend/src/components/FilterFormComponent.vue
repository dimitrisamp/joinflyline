<template>
  <form action="" class="bg-white">
    <div class="search-filter">
      <div class="search-filter__header">
        <div class="search-quick-filter-filter-name">
          <strong>Flight Filters</strong>
        </div>
        <p>Filter by : Stops, Airlines,Times, and more</p>
      </div>
      <div class="search-filter__body">
        <collapse :collapsed="false" title="Filter By Airlines">
          <airline-filter :data="filterableAirlines" @select="toggleAirline" />
        </collapse>
        <collapse title="Filter By Time">
          <time-filter />
        </collapse>
        <collapse title="Filter By Stops">
          <max-stops-filter :data="form.maxStops" @select="setMaxStops" />
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
</template>

<script>
import Collapse from "./Collapse";
import AirlineFilter from "./AirlineFilter";
import TimeFilter from "./TimeFilter";
import MaxStopsFilter from "./MaxStopsFilter";
import PriceFilter from "./PriceFilter";
import Vuex from "vuex";

export default {
  name: "FilterFormComponent",
  methods: {
    ...Vuex.mapActions("search", ["sortResultsBy", "loadMore", "search"]),
    ...Vuex.mapMutations("search", [
      "toggleAirline",
      "setMaxStops",
      "setPriceRange"
    ])
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
  },
  components: {
    Collapse,
    AirlineFilter,
    TimeFilter,
    MaxStopsFilter,
    PriceFilter
  }
};
</script>

