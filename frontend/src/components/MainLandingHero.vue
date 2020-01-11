<template>
  <div
    id="search-hero"
    class="hero search-container header-background homepage-background mobile-before first-page-body js-steps-small-blue"
  >
    <div class="search-container__head">
      <div class="container align-self-center">
        <div class="h-headermain">
          <div class="row">
            <div class="col-12 col-md-12">
              <div class="search-flight-home">
                <div>
                  <cd-intro />
                </div>
                <div>
                  <div id="dealform" class="h-dealform horizontal-form">
                    <div class="horizontal-form__head">
                      <div class="row">
                        <div class="col">
                          <div class="main-filters">
                            <div class="main-filters__item">
                              <select-deal
                                :value="form.searchType"
                                @select="setSearchType"
                              />
                            </div>
                            <div class="main-filters__item">
                              <select-destination
                                :value="form.destinationTypeId"
                                @select="setDestinationType"
                              />
                            </div>
                            <div class="main-filters__item">
                              <select-seat-type
                                :value="form.seatType"
                                @select="setSeatType"
                              />
                              <select-passenger-count />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="horizontal-form__body">
                      <div class="row">
                        <!-- TODO: insert controls -->
                        <div class="col">
                          <div class="hero-search">
                            <div class="hero-search__item is-wide">
                              <div
                                class="input-group input-group-sm search-dropdown"
                              >
                                <location-input
                                  :prompt="'Departure City'"
                                  :promptMobile="'Departure City'"
                                  :promptMobileFocus="'From Where?'"
                                  :initialValue="form.placeFrom"
                                  @place-selected="updatePlaceFrom"
                                />
                              </div>
                            </div>
                            <div class="hero-search__item is-wide">
                              <div
                                class="input-group input-group-sm search-dropdown"
                              >
                                <location-input
                                  :prompt="'Arrival City'"
                                  :promptMobile="'Arrival City'"
                                  :promptMobileFocus="'To where?'"
                                  :initialValue="form.placeTo"
                                  @place-selected="updatePlaceTo"
                                />
                              </div>
                            </div>
                            <div
                              class="hero-search__item"
                              v-if="form.searchType === 'dealAlerts'"
                            >
                              <div
                                class="input-group input-group-sm search-item search-dropdown"
                              >
                                <input
                                  type="text"
                                  placeholder="Max Price"
                                  class="form-control search-input"
                                />
                              </div>
                            </div>
                            <div
                              class="hero-search__item"
                              v-if="form.searchType === 'dealAlerts'"
                            >
                              <div
                                class="input-group input-group-sm search-item search-dropdown"
                              >
                                <input
                                  type="text"
                                  placeholder="Carriers"
                                  class="form-control search-input"
                                />
                              </div>
                            </div>
                            <div
                              class="hero-search__item"
                              v-if="form.searchType === 'searchNBook'"
                            >
                              <div
                                class="input-group input-group-sm search-dropdown home-date-field-dep"
                              >
                                <div class="dat-blue-border dep-date">
                                  <input
                                    type="text"
                                    id="departure_date"
                                    autocomplete="off"
                                    aria-describedby="basic-addon3"
                                    class="form-control search-input"
                                    v-model="form.departure_date"
                                  />
                                  <span
                                    class="input-group-text search-form-input"
                                    >Dep:</span
                                  >
                                </div>
                              </div>
                            </div>

                            <div
                              v-if="
                                form.destinationTypeId === 'round' &&
                                  form.searchType === 'searchNBook'
                              "
                            >
                              <div class="hero-search__item">
                                <div
                                  class="input-group input-group-sm search-dropdown home-date-field-ret"
                                >
                                  <div class="dat-blue-border ret-date">
                                    <input
                                      type="text"
                                      id="return_date"
                                      autocomplete="off"
                                      aria-describedby="basic-addon3"
                                      class="form-control search-input"
                                      v-model="form.return_date"
                                    />
                                    <span
                                      class="input-group-text search-form-input"
                                      >Ret:</span
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="hero-search__item is-last">
                              <div class="search-button horizontal-f-btn">
                                <button
                                  type="button"
                                  class="btn-search"
                                  @click="searchFromHome"
                                  :disabled="isFormIncomplete"
                                >
                                  <img
                                    v-if="$mq !== 'sm'"
                                    src="@/assets/img/search.png"
                                  />
                                  <span v-else>Search Flights</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- h-headermain -->
      </div>
    </div>

    <div class="search-container__footer">
      <div class="container">
        <div class="search-container__footer-text">
          Find the cheapest flights online. <br />
          We’re leverging <a href="#">virtual interlining</a> technoloy so you
          can spend less, and travel more
        </div>
        <div class="search-container__footer-title">
          What is FlyLine
        </div>
        <div class="hero-features">
          <div class="hero-feature">
            <div class="hero-feature__img">
              <img
                class="hero-feature__img-src"
                src="../assets/img/icons/worldwide.svg"
              />
            </div>
            <div class="hero-feature__text">
              <h5 class="hero-feature__title">
                We make it easier to travel the world
              </h5>
              <p class="hero-feature__descr">
                Find unique flights. Save hundreds of dollars through virtual
                interlining
              </p>
            </div>
          </div>

          <div class="hero-feature">
            <div class="hero-feature__img">
              <img
                class="hero-feature__img-src"
                src="../assets/img/icons/transfer.svg"
              />
            </div>
            <div class="hero-feature__text">
              <h5 class="hero-feature__title">
                Save through virtual interlining
              </h5>
              <p class="hero-feature__descr">
                Find unique flight and hotel rates. Save hundreds of dollars
                compared to other sites.
              </p>
            </div>
          </div>

          <div class="hero-feature">
            <div class="hero-feature__img">
              <img
                class="hero-feature__img-src"
                src="../assets/img/icons/dollar-sign.svg"
              />
            </div>
            <div class="hero-feature__text">
              <h5 class="hero-feature__title">
                We show you the cheapest regular flights
              </h5>
              <p class="hero-feature__descr">
                This way you can be sure you’re seeing the best available rates
                anywhere.
              </p>
            </div>
          </div>
        </div>
        <div class="hero-features__more">
          <a href="#">Learn More</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from "./SearchForm";
import FilterForm from "./FilterForm.vue";
import { trending } from "../utils/trending";
import Vuex from "vuex";
import CdIntro from "./CdIntro";
import LocationInput from "./LocationInput";
import SelectPassengerCount from "./SelectPassengerCount";
import SelectDestination from "./SelectDestination";
import SelectDeal from "./SelectDeal";
import SelectSeatType from "./SelectSeatType";

export default {
  delimiters: ["{{", "}}"],
  mixins: [SearchForm, FilterForm],
  components: {
    CdIntro,
    LocationInput,
    SelectPassengerCount,
    SelectSeatType,
    SelectDestination,
    SelectDeal
  },
  data() {
    return {
      trending
    };
  },
  methods: {
    ...Vuex.mapMutations("search", ["updatePlaceFrom", "updatePlaceTo"]),
    searchFromHome() {
      this.search({ clearFilters: true, saveSearch: false });
      this.$router.push({ name: "search-results" });
    },
    setFormFromTo(i) {
      const data = this.trending[i];
      this.updatePlaceFrom(data.from);
      this.updatePlaceTo(data.to);
    }
  }
};
</script>

<style lang="scss">
.hero-search {
  .hero-search__item {
    .search-form-input {
      background: #fff;
      border-radius: 0px;
      border-right: none;
      font-size: 0.8em;
      font-weight: 600;
      font-family: Dona-Bold;
      color: #7d7d7d;
      border: 2px solid #ececec;
      border-right: transparent;
    }
    .search-input {
      border: 2px solid #ececec;
      border-left: none;
    }
    .search-input:focus + span {
      border-color: #0aaeff;
    }
  }
}
</style>
