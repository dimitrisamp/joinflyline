<template>
  <div>
    <!-- Search progress -->
    <search-progress :is-visible="searchProgress">
      Give us a few moments while we load your search results
    </search-progress>
    <quick-links
      :sort="form.sort"
      :data="quickFiltersData"
      :airlinesFilter="form.airlinesFilter"
      @sort-by="sortResultsBy"
    />
    <div
      class="search-results"
      :class="{ anonymous: user.anonymous }"
      v-if="searchProgress"
      v-cloak
    >
      <div class="w-100" v-for="i in 4" :key="i">
        <div class="result-item mb-2 w-100" style="width: 90%">
          <div
            class="result-block result-toggler w-100 d-block d-md-flex justify-content-start p-2 pt-3 pb-3"
            data-toggle="collapse"
            data-target="#result-item27180"
          >
            <div class="loading_animation">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-2">
                    <div class="animate-element animate-element-01"></div>
                  </div>
                  <div class="col-md-2">
                    <div class="animate-element animate-element-02"></div>
                    <div class="animate-element animate-element-03"></div>
                  </div>
                  <div class="col-md-8">
                    <div class="animate-element animate-element-04"></div>
                    <div class="animate-element animate-element-05"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider-30"></div>
      </div>
    </div>
    <div
      class="search-results normal-scroll"
      :class="{ anonymous: user.anonymous }"
      v-cloak
      v-if="!searchProgress && finalResults.length !== 0"
    >
      <template v-if="!user.anonymous">
        <flight
          v-for="flight in finalResults"
          :flight="flight"
          :form="form"
          :user="user"
          :key="flight.id"
          @proceed-to-booking="bookFlight(flight.srIndex)"
        />
      </template>
      <template v-else>
        <flight
          v-for="flight in finalResults.slice(0, 2)"
          :flight="flight"
          :form="form"
          :user="user"
          :key="flight.id"
          @proceed-to-booking="bookFlight(flight.srIndex)"
        />
      </template>
      <div v-if="user.anonymous" class="fake-results">
        <flight
          v-for="flight in finalResults.slice(2, 3)"
          :flight="flight"
          :form="form"
          :user="user"
          :key="flight.id"
          @proceed-to-booking="bookFlight(flight.srIndex)"
        />
        <overlay-component
          v-if="user.anonymous"
          :link="{ name: 'get-started' }"
          label="Start Trial"
          class="fake-results__content"
        >
          <div class="fake-results__left">
            <h5 class="overlay-component__heading">
              Want to view more great deals?
            </h5>
            <p class="overlay-component__text">
              Sign up for your free 14 day trial of either Basic or Premium to
              see all available flights on FlyLine. Save hundreds on FlyLine
              fares
            </p>
          </div>

          <template #footer>
            <div class="text-center">
              <br />
              Want to learn more about FlyLine memberships? <br />
              Click
              <router-link :to="{ name: 'membership-explained' }"
                >HERE</router-link
              >
            </div>
          </template>
        </overlay-component>
      </div>
      <div v-if="!user.anonymous" class="h-btngroups">
        <a class="btn btn-default" href="#" @click="loadMore">Load More</a>
      </div>
    </div>
    <search-results-popup />
  </div>
</template>

<script>
import Vuex from "vuex";
import Flight from "./Flight";
import QuickLinks from "./QuickLinks";
import SearchProgress from "./SearchProgress";
import SearchResultsPopup from "./SearchResultsPopup";
import OverlayComponent from "./OverlayComponent";

export default {
  components: {
    Flight,
    SearchResultsPopup,
    SearchProgress,
    QuickLinks,
    OverlayComponent
  },
  methods: {
    ...Vuex.mapMutations("search", ["setSearchResultIndex"]),
    ...Vuex.mapActions("search", ["loadMore", "sortResultsBy"]),
    bookFlight(index) {
      this.setSearchResultIndex(index);
      if (this.user.anonymous) {
        this.$router.push({ name: "search-booking" });
      } else {
        this.$router.push({ name: "booking" });
      }
    }
  },
  delimiters: ["{{", "}}"],
  computed: {
    ...Vuex.mapState("search", ["form", "searchProgress"]),
    ...Vuex.mapGetters("search", ["finalResults", "quickFiltersData"]),
    ...Vuex.mapState("user", ["user"])
  }
};
</script>
