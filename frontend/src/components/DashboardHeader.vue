<template>
  <div class="main-header__container">
    <div class="main-header__mobile">
      <div class="main-header__mobile-left">
        <router-link to="/dashboard">
          <img
            class="main-header__mobile-logo"
            src="@/assets/img/dashboard/logo.svg"
            alt="FlyLine Logo"
          />
        </router-link>
      </div>
      <div class="main-header__mobile-right">
        <a
          href="#"
          class="main-header__mobile-search"
          :class="{ active: isOpen }"
          @click.prevent="isOpen = !isOpen"
        >
          <svg
            width="25px"
            height="25px"
            viewBox="0 0 25 25"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Mobile"
                transform="translate(-242.000000, -18.000000)"
                fill="#222222"
                fill-rule="nonzero"
              >
                <g id="search" transform="translate(242.000000, 18.000000)">
                  <path
                    d="M24.7230424,23.6017129 L18.2788744,17.260522 C19.9663948,15.4270799 21.0032626,13.0023246 21.0032626,10.3341354 C21.002447,4.62638662 16.3011419,0 10.5013458,0 C4.70154975,0 0.000244698206,4.62638662 0.000244698206,10.3341354 C0.000244698206,16.0418842 4.70154975,20.6682708 10.5013458,20.6682708 C13.0072594,20.6682708 15.3056281,19.8015089 17.1109706,18.360522 L23.5801387,24.7267129 C23.8953507,25.0372349 24.4070962,25.0372349 24.7223083,24.7267129 C25.0382545,24.4162317 25.0382545,23.9122349 24.7230424,23.6017129 Z M10.5013458,19.0783035 C5.59408646,19.0783035 1.61598695,15.1634176 1.61598695,10.3341354 C1.61598695,5.50485318 5.59408646,1.58996737 10.5013458,1.58996737 C15.408646,1.58996737 19.3867048,5.50485318 19.3867048,10.3341354 C19.3867048,15.1634176 15.408646,19.0783035 10.5013458,19.0783035 Z"
                    id="Shape"
                  />
                </g>
              </g>
            </g>
          </svg>
        </a>
        <button
          type="button"
          class="hamburger hamburger--slider"
          :class="{ 'is-active': toggleSidebar }"
          @click="$store.dispatch('dashboard/toggleSidebar')"
        >
          <span class="hamburger-box">
            <span class="hamburger-inner" />
          </span>
        </button>
      </div>
    </div>
    <transition name="slide-up" mode="out-in" appear>
      <header class="main-header" v-show="isOpen">
        <h1 class="main-header__title">Where are you going?</h1>
        <div class="main-header__form">
          <div class="main-header__top">
            <div class="main-filters">
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
              </div>
              <div class="main-filters__item">
                <select-passenger-count />
              </div>
            </div>
          </div>
          <div class="main-header__bottom">
            <form action="">
              <div class="search-form-field__container">
                <location-input
                  :prompt="'From:'"
                  :initial-value="form.placeFrom"
                  :promptMobile="'From Where?'"
                  @place-selected="updatePlaceFrom"
                />
              </div>
              <div class="search-form-field__container">
                <location-input
                  :prompt="'To:'"
                  :promptMobile="'To Where?'"
                  :initial-value="form.placeTo"
                  @place-selected="updatePlaceTo"
                />
              </div>
              <div class="search-form-field__container">
                <input
                  type="text"
                  class="form-control"
                  id="departure_date"
                  autocomplete="off"
                  v-model="form.departure_date"
                  placeholder="Dep: "
                />
              </div>
              <div
                v-if="form.destinationTypeId === 'round'"
                class="search-form-field__container"
              >
                <input
                  type="text"
                  class="form-control"
                  id="return_date"
                  v-model="form.return_date"
                  autocomplete="off"
                  placeholder="Ret: "
                />
              </div>
              <button class="btn btn-search" @click.prevent="doSearch">
                <svg class="icon icon--search" width="21" height="21">
                  <use xlink:href="#icon-search" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </header>
    </transition>
  </div>
</template>

<script>
import SearchForm from "./SearchForm.vue";
import Vuex from "vuex";
import SelectDestination from "./SelectDestination";
import SelectPassengerCount from "./SelectPassengerCount";
import SelectSeatType from "./SelectSeatType";
import LocationInput from "./LocationInput";

export default {
  extends: SearchForm,
  delimiters: ["{{", "}}"],
  computed: {
    ...Vuex.mapGetters("dashboard", ["toggleSidebar"])
  },
  components: {
    SelectDestination,
    SelectPassengerCount,
    SelectSeatType,
    LocationInput
  },
  data() {
    return {
      isOpen: false
    };
  },
  watch: {
    $mq: {
      handler: "showSearchFormHandler"
    }
  },
  mounted() {
    this.showSearchFormHandler();
  },
  methods: {
    doSearch() {
      this.search({ clearFilters: true, saveSearch: true });
      this.$router.push({ name: "results" });
    },
    showSearchFormHandler() {
      this.isOpen = this.$mq !== "sm";
    }
  }
};
</script>
