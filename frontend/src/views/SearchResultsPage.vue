<template>
  <div class="search-result" id="main" v-cloak>
    <!-- Mobile View Start   -->
    <search-progress :is-visible="searchProgress">
      Give us a few moments while we load your search results
    </search-progress>
    <div
      class="search-result__mobile"
      v-if="searchResults.length !== 0 && isMobile && !searchProgress"
    >
      <search-results-mobile />
    </div>
    <!-- Mobile View Ends-->

    <!-- Desktop View Start -->
    <div class="search-result__desktop" v-else>
      <div class="search-result__inner">
        <!-- Desktop Inner Start -->
        <header class="header">
          <nav-bar />
        </header>
        <div class="search-result__search">
          <div class="container search-container">
            <search-header />
          </div>
        </div>
        <!-- Desktop Inner Ends -->
        <!-- Search Container Start -->
        <div class="search-result__container">
          <div class="search-result__container__inner">
            <div class="search-result__container__left" style="display:none;">
              <!-- <div class="search-flight-home">
                <h3>{{ cityFromTo }}</h3>
                <p>Carriers: {{ airlineNames }}</p>
                <div class="search-flight-divider"></div>
              </div> -->
              <div id="dealform" class="h-dealform" v-cloak>
                <div class="search-form__filters">
                  <div class="filters__container">
                    <select-destination
                      :value="form.destinationTypeId"
                      @select="setDestinationType"
                    />
                  </div>
                  <div class="filters__container">
                    <select-passenger-count />
                  </div>
                  <div class="filters__container">
                    <select-seat-type
                      :value="form.seatType"
                      @select="setSeatType"
                    />
                  </div>
                </div>

                <div class="input-group input-group-sm search-dropdown-outer">
                  <location-input
                    :prompt="'From:'"
                    :promptMobile="'From Where?'"
                    @place-selected="updatePlaceFrom"
                    :initial-value="form.placeFrom"
                  />
                </div>
                <div class="input-group input-group-sm search-dropdown-outer">
                  <location-input
                    :prompt="'To:'"
                    :promptMobile="'To Where?'"
                    @place-selected="updatePlaceTo"
                    :initial-value="form.placeTo"
                  />
                </div>

                <div class="h-dealform__dates">
                  <div class="input-group input-group-sm search-dropdown">
                    <div class="bg-white-close-holes">
                      <span class="input-group-text search-form-input"
                        >Dep:</span
                      >
                      <input
                        type="text"
                        id="departure_date"
                        autocomplete="off"
                        aria-describedby="basic-addon3"
                        class="form-control search-input"
                        v-model="form.departure_date"
                      />
                    </div>
                  </div>

                  <div
                    v-if="form.destinationTypeId === 'round'"
                    class="input-group input-group-sm search-dropdown"
                  >
                    <div class="bg-white-close-holes">
                      <span class="input-group-text search-form-input"
                        >Ret:</span
                      >
                      <input
                        type="text"
                        id="return_date"
                        autocomplete="off"
                        aria-describedby="basic-addon3"
                        class="form-control search-input"
                        data-return="Ret"
                        v-model="form.return_date"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="$mq !== 'sm'" class="dealform__filters">
                  <div class="filter-field">
                    <span>Filters (Optional)</span>
                    <button
                      class="clear-filters"
                      @click="clearFiltersAndUpdate"
                    >
                      <!-- <i class="fa fa-close"></i> -->
                      clear
                    </button>
                  </div>
                  <div class="filter-devider"></div>
                  <collapse title="Filter By Airline">
                    <airline-filter
                      :data="form.airlines"
                      @select="toggleAirline"
                    />
                  </collapse>
                  <collapse title="Filter By Stops">
                    <max-stops-filter
                      :data="form.maxStops"
                      @select="setMaxStops"
                    />
                  </collapse>
                  <collapse title="Filter By Price">
                    <price-filter
                      v-if="searchResults"
                      @select="setPriceRange"
                    />
                  </collapse>
                </div>
                <div class="search-button">
                  <button
                    type="button"
                    class="btn btn-info"
                    @click="search({ clearFilters: false, saveSearch: false })"
                    :disabled="isFormIncomplete"
                  >
                    View Flights
                  </button>
                </div>
              </div>
            </div>
            <div class="search-result__container__left">
              <!-- <div class="search-flight-home">
                <div>
                  <h3>{{ cityFromTo }}</h3>
                  <p>Carriers: {{ airlineNames }}</p>
                </div>
                <div>
                  <router-link
                    tag="button"
                    type="button"
                    class="btn btn-info flyline-101"
                    :to="{ name: 'flyline101' }"
                  >
                    FlyLine 101
                  </router-link>
                  <h5>How to get the most savings on FlyLine</h5>
                </div>
              </div> -->
            </div>
            <div class="search-result__container__right">
              <transition name="slide" mode="out-in" appear>
                <router-view />
              </transition>
            </div>
          </div>
        </div>
        <!-- Search Container Ends -->

        <!-- Mobile View Info Start -->
        <div v-if="isMobile" class="fly-linesetion">
          <h3>What is FlyLine</h3>
          <p>
            We flipped the script on air travel booking by eliminating booking
            fees with the creation of a more travel- friendly flight club model.
            in other words, the Costco for flying so you can save and do more.
          </p>
          <router-link to="/learn-more/" class="btn btn-default"
            >Learn More</router-link
          >
          <div class="email-mobile-view">joinflyline.com | Mobile</div>
        </div>
        <div id="footer-section" class="section">
          <main-landing-footer />
        </div>
        <!-- Mobile View Info Ends -->
      </div>
    </div>
    <!-- Desktop View Ends -->
  </div>
</template>

<script>
import SearchForm from "../components/SearchForm";
import FilterForm from "../components/FilterForm";
import Vuex from "vuex";
import NavBar from "../components/NavBar";
import SelectDestination from "../components/SelectDestination";
import SelectPassengerCount from "../components/SelectPassengerCount";
import SelectSeatType from "../components/SelectSeatType";
import MaxStopsFilter from "../components/MaxStopsFilter";
import PriceFilter from "../components/PriceFilter";
import AirlineFilter from "../components/AirlineFilter";
import Collapse from "../components/Collapse";
import LocationInput from "../components/LocationInput";
import MainLandingFooter from "../components/MainLandingFooter";
import SearchResultsMobile from "../components/SearchResultsMobile";
import SearchProgress from "../components/SearchProgress";
import SearchHeader from "../components/SearchHeader";

export default {
  components: {
    NavBar,
    SelectDestination,
    SelectPassengerCount,
    SelectSeatType,
    LocationInput,
    Collapse,
    AirlineFilter,
    PriceFilter,
    MaxStopsFilter,
    MainLandingFooter,
    SearchResultsMobile,
    SearchProgress,
    SearchHeader
  },
  delimiters: ["{{", "}}"],
  mixins: [SearchForm, FilterForm],
  metaInfo() {
    let cityFromToTitle = this.cityFromTo ? this.cityFromTo : "";
    return {
      title: `FlyLine | Search Results | ${cityFromToTitle}`
    };
  },
  computed: {
    ...Vuex.mapState("user", ["user"]),
    ...Vuex.mapState("search", ["searchProgress", "searchResults", "form"]),
    ...Vuex.mapGetters("search", ["airlineNames", "cityFromTo"]),
    ...Vuex.mapState("dashboard", ["showDashboardNavigation"]),
    isMobile() {
      return this.$mq === "sm";
    }
  },
  mounted() {
    this.calcHeightOfHeader();
    window.addEventListener("resize", this.calcHeightOfHeader);
  },
  methods: {
    calcHeightOfHeader() {
      const headerEl = document.querySelector(".header");
      const searchContainer = document.querySelector(".search-container");
      const searchForm = document.querySelector(
        ".search-result__container__left"
      );
      searchForm ? (searchForm.style.top = headerEl.offsetHeight + "px") : 0;
      if (headerEl) {
        const headerHeight = headerEl.offsetHeight;
        searchContainer.style.paddingTop = headerHeight + "px";
      }
    },

    proceedToSearchResults() {
      this.$router.push({ name: "results" });
    }
  }
};
</script>
<style>
.btn.btn-info.flyline-101 {
  border-radius: 0;
  border: none;
}
</style>
