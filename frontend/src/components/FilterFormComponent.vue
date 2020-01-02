<template>
  <form action="" class="bg-white">
    <overlay-component v-if="user.anonymous" :link="{ name: 'get-started' }" label="Get Started">
      <h5 class="overlay-component__heading">
        Create Your FlyLine Account to view Filters
      </h5>
      <p>
        Choose FlyLine Basic or Pro
      </p>
    </overlay-component>
    <div class="search-filter">
      <div class="search-filter__header">
        <div class="search-quick-filter-filter-name right-pane">
          <strong>Flight Filters</strong>
          <h3 class="filter-sidebar__title">
            <span @click="clearFiltersAndUpdate">Clear All</span>
          </h3>
        </div>

        <p>Filter by : Stops, Airline, Times, and more</p>
      </div>
      <div
        class="search-filter__body"
        :class="{ 'search-filter__body--logged': !user.anonymous }"
      >
        <collapse :collapsed="airlineCollapse" title="Filter By Airline">
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
import OverlayComponent from "./OverlayComponent";
import Vuex from "vuex";

export default {
  props: {
    airlineCollapse: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  name: "FilterFormComponent",
  methods: {
    ...Vuex.mapActions("search", [
      "sortResultsBy",
      "loadMore",
      "search",
      "clearFiltersAndUpdate"
    ]),
    ...Vuex.mapMutations("search", [
      "toggleAirline",
      "setMaxStops",
      "setPriceRange"
    ])
  },
  computed: {
    ...Vuex.mapState("search", ["form"]),
    ...Vuex.mapState("user", ["user"]),
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
    PriceFilter,
    OverlayComponent
  }
};
</script>
<style>
form {
  position: relative;
}
</style>
