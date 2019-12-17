<template>
  <div
    id="search-hero"
    class="hero search-container d-flex header-background homepage-background mobile-before first-page-body js-steps-small-blue"
  >
    <div class="container align-self-center">
      <div class="h-headermain">
        <div class="row">
          <div class="col-12 col-md-12 wide-form">
            <div class="search-flight-home">
              <div>
                <cd-intro />
              </div>
              <div>
                <div id="dealform" class="h-dealform horizontal-form">
                  <div class="row">
                    <div class="col">
                      <div class="main-filters">
                        <select-destination
                          :value="form.destinationTypeId"
                          @select="setDestinationType"
                        />
                        <select-seat-type
                          :value="form.seatType"
                          @select="setSeatType"
                        />
                        <select-passenger-count />
                      </div>
                    </div>
                  </div>
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
                        <div class="hero-search__item">
                          <div
                            class="input-group input-group-sm search-dropdown home-date-field-dep"
                          >
                            <div class="dat-blue-border dep-date">
                              <span class="input-group-text search-form-input"
                                >Dep:</span
                              >
                              <input
                                type="text"
                                id="departure_date"
                                aria-describedby="basic-addon3"
                                class="form-control search-input"
                                v-model="form.departure_date"
                              />
                            </div>
                          </div>
                        </div>

                        <div v-if="form.destinationTypeId === 'round'">
                          <div class="hero-search__item">
                            <div
                              class="input-group input-group-sm search-dropdown home-date-field-ret"
                            >
                              <div class="dat-blue-border ret-date">
                                <span class="input-group-text search-form-input"
                                  >Ret:</span
                                >
                                <input
                                  type="text"
                                  id="return_date"
                                  aria-describedby="basic-addon3"
                                  class="form-control search-input"
                                  v-model="form.return_date"
                                />
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
                  <div class="row mt-0">
                    <div class="col-12 trending-flights-container">
                      <!-- Trending Flights -->
                      <span>Trending Flights</span>
                      <div class="trending-flights">
                        <div
                          class="trending-flights__item"
                          v-for="(o, i) in trending"
                          :key="`trending-${i}`"
                          @click="setFormFromTo(i)"
                        >
                          {{ o.from.name }} -> {{ o.to.name }}
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
import SelectSeatType from "./SelectSeatType";

export default {
  delimiters: ["{{", "}}"],
  mixins: [SearchForm, FilterForm],
  components: {
    CdIntro,
    LocationInput,
    SelectPassengerCount,
    SelectSeatType,
    SelectDestination
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

<style scoped>
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
</style>
