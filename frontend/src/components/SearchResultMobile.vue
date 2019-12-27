<template>
  <div>
    <div class="m-result-detailbox">
      <img
        class="flight__interlining"
        v-if="interlining"
        src="@/assets/img/FlyLine_Interline.png"
        alt="interlining"
      />
      <summary-leg-mobile :flights="flightsTo" />
      <div v-if="flightsReturn.length !== 0" class="m-oof-nights">
        {{ nightsInDest }} night{{ nightsInDest > 1 ? "s" : "" }} in {{ dest }}
      </div>
      <summary-leg-mobile
        v-if="flightsReturn.length !== 0"
        :flights="flightsReturn"
      />
      <div class="m-total-p-section">
        <ul>
          <li>
            <b>Trip Price : ${{ price }}</b>
          </li>
          <li>
            <a
              href="#"
              @click="bookFlight(data.srIndex)"
              class="btn btn-default"
              >Book</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";
import SummaryLegMobile from "./SummaryLegMobile";

export default {
  props: ["data"],
  delimiters: ["{{", "}}"],
  components: {
    SummaryLegMobile
  },
  methods: {
    ...Vuex.mapMutations("search", ["setSearchResultIndex"]),
    bookFlight(index) {
      this.setSearchResultIndex(index);
      if (this.user.anonymous) {
        this.$router.push({ name: "search-booking" });
      } else {
        this.$router.push({ name: "booking" });
      }
    }
  },
  computed: {
    flightsTo() {
      return this.data.route.filter(o => o.return === 0);
    },
    flightsReturn() {
      return this.data.route.filter(o => o.return === 1);
    },
    nightsInDest() {
      return this.data.nightsInDest;
    },
    dest() {
      return this.data.cityTo;
    },
    interlining() {
      return false;
      // TODO: disabled for now, enable later
      // return new Set(this.data.route.map(o=>o.airline)).size > 1;
    },
    price() {
      return this.data.conversion.USD;
    },
    ...Vuex.mapState("user", ["user"])
  }
};
</script>
