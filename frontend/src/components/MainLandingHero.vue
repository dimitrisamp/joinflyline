<template>
  <div
    id="search-hero"
    class="hero search-container header-background homepage-background mobile-before first-page-body js-steps-small-blue"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
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
                            <div class="main-filters__item is-dynamic">
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
                          <div class="search-form">
                            <div class="search-form__item has-dropdown">
                              <div class="search-form__subitem">
                                <location-input
                                  is-wide
                                  :prompt="'Departure City'"
                                  :promptMobile="'Departure City'"
                                  :promptMobileFocus="'From Where?'"
                                  :initialValue="form.placeFrom"
                                  @place-selected="updatePlaceFrom"
                                />
                              </div>
                              <div class="search-form__subitem">
                                <location-input
                                  is-wide
                                  :prompt="'Arrival City'"
                                  :promptMobile="'Arrival City'"
                                  :promptMobileFocus="'To where?'"
                                  :initialValue="form.placeTo"
                                  @place-selected="updatePlaceTo"
                                />
                              </div>
                            </div>
                            <div
                              class="search-form__item"
                              v-if="form.searchType === 'dealAlerts'"
                            >
                              <input
                                type="text"
                                placeholder="Email"
                                class="form-control search-input"
                                v-model="email"
                              />
                            </div>
                            <div
                              class="search-form__item"
                              v-if="form.searchType === 'dealAlerts'"
                            >
                              <input
                                type="text"
                                placeholder="Max Price"
                                class="form-control search-input"
                              />
                            </div>
                            <div
                              class="search-form__item"
                              v-if="form.searchType === 'searchNBook'"
                              data-label="Dep:"
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

                            <div
                              v-if="
                                form.destinationTypeId === 'round' &&
                                  form.searchType === 'searchNBook'
                              "
                            >
                              <div class="search-form__item" data-label="Ret:">
                                <input
                                  type="text"
                                  id="return_date"
                                  autocomplete="off"
                                  aria-describedby="basic-addon3"
                                  class="form-control search-input"
                                  v-model="form.return_date"
                                />
                              </div>
                            </div>
                            <div
                              v-if="form.searchType === 'searchNBook'"
                              class="search-form__item is-last"
                            >
                              <button
                                type="button"
                                class="search-form__btn"
                                :class="{ 'has-icon': $mq !== 'sm' }"
                                @click="searchFromHome"
                                :disabled="isFormIncomplete"
                              >
                                <span class="search-form__btn-txt"
                                  >Search Flights</span
                                >
                              </button>
                            </div>
                            <div v-else class="search-form__item is-last">
                              <button
                                type="button"
                                class="search-form__btn"
                                @click="anonymousDealAlertsSubscribe"
                                :disabled="isDealFormIncomplete"
                              >
                                <span>Set</span>
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
        <!-- h-headermain -->
      </div>
    </div>

    <div class="search-container__footer">
      <div class="container">
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
                Stop Paying Retail With a FlyLine Membership
              </h5>
              <p class="hero-feature__descr">
                We source flights from 250+ airlines and sell them directly to
                you with zero markup.
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
                Save With Our Exclusive Virtual Interlining
              </h5>
              <p class="hero-feature__descr">
                We connect one-way flights from different carriers to deliver
                the best savings.
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
                Search & Book both FlyLine and Public Fares
              </h5>
              <p class="hero-feature__descr">
                We will always display the cheapest fare, whether it's a public
                or FlyLine fare.
              </p>
            </div>
          </div>
        </div>
        <div class="hero-features__more">
          <router-link :to="{ name: 'membership-explained' }"
            >Learn More</router-link
          >
        </div>
      </div>
    </div>
    <booking-popup
      v-if="dealAlertsSubscribeSuccess"
      title="Deal Alerts"
      body="Congrats! You have subscribed to deal alerts"
      button-label="Close"
      @button-click="setDealAlertsSubscribeSuccess(false)"
    />
    <modal v-if="dealAlertsSubscribeFailure">
      <template #body>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Deal alerts
            </h5>
          </div>
          <div class="modal-body">
            <h1>
              Seems like account with email {{ form.email }} already exists.
              Please
              <router-link :to="{ name: 'sign-in' }">sign in</router-link>
            </h1>
          </div>
          <div class="modal-footer">
            <button
              @click="setDealAlertsSubscribeFailure(false)"
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </template>
    </modal>
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
import { getRandomImage } from "../utils/imageRotator";
import BookingPopup from "./BookingPopup";

export default {
  delimiters: ["{{", "}}"],
  mixins: [SearchForm, FilterForm],
  components: {
    CdIntro,
    LocationInput,
    SelectPassengerCount,
    SelectSeatType,
    SelectDestination,
    SelectDeal,
    BookingPopup
  },
  data() {
    return {
      trending,
      backgroundImageUrl: getRandomImage()
    };
  },
  methods: {
    ...Vuex.mapMutations("search", ["updatePlaceFrom", "updatePlaceTo"]),
    ...Vuex.mapActions("search", [
      "anonymousDealAlertsSubscribe",
      "setDealAlertsSubscribeSuccess",
      "setDealAlertsSubscribeFailure"
    ]),
    searchFromHome() {
      this.search({ clearFilters: true, saveSearch: false });
      this.$router.push({ name: "search-results" });
    },
    setFormFromTo(i) {
      const data = this.trending[i];
      this.updatePlaceFrom(data.from);
      this.updatePlaceTo(data.to);
    }
  },
  computed: {
    email: {
      get() {
        return this.$store.getters["search/email"];
      },
      set(value) {
        this.$store.dispatch("search/setEmail", value);
      }
    },
    ...Vuex.mapGetters("search", ["isDealFormIncomplete"]),
    ...Vuex.mapState("search", [
      "dealAlertsSubscribeSuccess",
      "dealAlertsSubscribeFailure"
    ])
  },
  beforeDestroy(to, from, next) {
    this.setDealAlertsSubscribeSuccess(false);
    this.setDealAlertsSubscribeFailure(false);
    next();
  }
};
</script>
