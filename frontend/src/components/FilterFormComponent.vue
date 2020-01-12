<template>
  <div>
    <div class="result__filters-info">
      <div class="result__filters-count">
        Available Results : {{ searchResults.length }}
      </div>
      <router-link :to="{ name: 'sign-in' }" class="result__filters-info-link">
        Sign up to view all
      </router-link>
    </div>
    <form action="" class="bg-white">
      <overlay-component
        v-if="user.anonymous"
        :link="{ name: 'get-started' }"
        label="Start Trial"
      >
        <h5 class="overlay-component__heading">
          Join for free to view flight filters
        </h5>
        <p>
          Sign up for your free 14 day trial of either Basic or Premium to see
          all that FlyLine has to offer
        </p>
        <template #footer>
          <br />
          <br />
          <p>
            Want to learn more about FlyLine memberships? <br />
            Click
            <router-link :to="{ name: 'membership-explained' }"
              >HERE</router-link
            >
          </p>
        </template>
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
            <airline-filter
              :data="filterableAirlines"
              @select="toggleAirline"
            />
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
  </div>
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
    ...Vuex.mapState("search", ["form", "searchResults"]),
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
