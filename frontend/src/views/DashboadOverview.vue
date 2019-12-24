<template>
  <div class="overview">
    <modal
      :showCloseButton="false"
      v-show="user.subscription === null"
      @close="showModal = false"
      @click-outside="showModal = false"
    >
      <template slot="body">
        <MembershipGuest />
      </template>
    </modal>
    <div class="section-heading">
      <div class="section-heading__inner">
        <h1 class="section-heading__title">Dashboard</h1>
        <p class="section-heading__text">
          View Deal Alerts, Suggested Trips, Trip Stats and much much more.
        </p>
      </div>
    </div>
    <div class="main-padding--dashboard">
      <tile-component
        class="tile--trip-summary"
        title="Total Trips Taken : "
        v-if="trip_summary"
      >
        <div class="tile__body-top">
          <div class="tile__body-top-numbers">
            <span>{{ trip_summary.count.domestic }}</span> <span>Domestic</span>
          </div>
          <div class="tile__body-top-numbers">
            <span>{{ trip_summary.count.international }}</span>
            <span>International</span>
          </div>
        </div>
        <div class="tile__body-bottom">
          <p class="booking">
            {{ trip_summary.remaining }} Booking{{
              trip_summary.remaining > 1 ? "s" : ""
            }}
            Remain
          </p>
          <p class="upgrade">Upgrade Plan</p>
        </div>
      </tile-component>
      <tile-component title="Estimated Savings : " class="tile--estimated">
        <template v-if="trip_summary">
          <div class="tile__body-top">
            <div class="tile__body-top-numbers">
              <span>${{ trip_summary.savings.domestic }}</span>
              <span>Domestic</span>
            </div>
            <div class="tile__body-top-numbers">
              <span>${{ trip_summary.savings.international }}</span>
              <span>International</span>
            </div>
          </div>
          <div class="tile__body-bottom">
            *Based on Average Savings from FlyLine members
          </div>
        </template>
      </tile-component>
      <div class="tile tile--recent-search">
        <h3 class="tile__heading">Recently Searched</h3>
        <div class="tile__body">
          <p class="tile__body-no-result" v-if="searchHistory.length === 0">
            No Recent Searches, Lets Find a Deal
          </p>
          <div class="tile__list">
            <div
              v-for="(hi, i) in searchHistory"
              :key="`history-${i}`"
              @click="performSearch(i)"
              class="tile__item"
            >
              <div class="tile__item-left">
                <p class="tile__item-left-top--clickable">
                  {{ hi.place_from.name }} ({{ hi.place_from.code }}) ->
                  {{ hi.place_to.name }} ({{ hi.place_to.code }}) |
                  {{ formatDateDeals(hi.departure_date) }}
                  {{
                    hi.return_date
                      ? ` -
                  ${formatDateDeals(hi.return_date)}`
                      : ""
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <tile-component class="tile--flights" title="Trending on FlyLine">
        <div class="tile__list">
          <deal
            v-for="(deal, index) in deals"
            :deal="deal"
            :key="`treding-deal-${index}`"
          />
        </div>
      </tile-component>
      <tile-component
        class="tile--flights"
        :title="`Suggested Trips From ${user.market.name}`"
        v-if="user && user.market"
      >
        <div class="tile__list">
          <deal
            v-for="(deal, index) in suggested_deals"
            :deal="deal"
            :key="`upcoming-deal-${index}`"
          />
        </div>
      </tile-component>
    </div>
  </div>
</template>

<script>
import api from "../utils/http";
import { formatDateDeals } from "../utils/utils";
import TileComponent from "../components/TileComponent";
import MembershipGuest from "../components/MembershipGuest";
import Vuex from "vuex";

export default {
  components: {
    TileComponent,
    MembershipGuest
  },
  data() {
    return {
      deals: [],
      suggested_deals: [],
      trip_summary: null,
      searchHistory: [],
      showModal: false
    };
  },
  metaInfo: {
    title: "Travel Portal | FlyLine"
  },
  delimiters: ["{{", "}}"],
  methods: {
    ...Vuex.mapActions("search", ["setFormAndSearch"]),
    formatDateDeals,
    updateDeals() {
      if (!this.user || this.user.anonymous || this.user.market === null)
        return;
      api
        .get("/deals/", {
          params: {
            city_from: `${this.user.market.type}:${this.user.market.code}`
          }
        })
        .then(response => (this.suggested_deals = response.data.results));
    },
    performSearch(i) {
      this.setFormAndSearch(this.searchHistory[i]);
      this.$router.push({ name: "results" });
    }
  },
  watch: {
    user() {
      this.updateDeals();
    }
  },
  created() {
    api.get("/deals/").then(response => {
      this.deals = response.data.results;
    });
    api.get("/bookings/summary/").then(response => {
      this.trip_summary = response.data;
    });
    api.get("/search-history/").then(response => {
      this.searchHistory = response.data;
    });
    this.updateDeals();
  },
  computed: {
    ...Vuex.mapState("user", ["user"])
  }
};
</script>
