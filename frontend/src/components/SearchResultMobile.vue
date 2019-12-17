<template>
  <div>
    <div class="m-result-detailbox">
      <img
        class="flight__interlining"
        v-if="interlining"
        src="@/assets/img/FlyLine_Interline.png"
        alt="interlining"
      />
      <summary-leg-mobile :flights="flightsTo" :key="0" />
      <div v-if="flightsReturn.length !== 0" class="m-oof-nights">
        {{ nightsInDest }} night{{ nightsInDest > 1 ? "s" : "" }} in {{ dest }}
      </div>
      <summary-leg-mobile
        v-if="flightsReturn.length !== 0"
        :flights="flightsReturn"
        :key="1"
      />
      <div class="m-total-p-section">
        <ul>
          <li>
            <b>Trip Price : ${{ price }}</b>
          </li>
          <li>
            <a href="#" @click="bookFlight(data)" class="btn btn-default"
              >Book</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { proceedToBooking, showPopup } from "../utils/utils";
import Vuex from "vuex";

export default {
  props: ["data"],
  delimiters: ["{{", "}}"],
  methods: {
    showPopup,
    bookFlight(flight) {
      if (this.user.anonymous) {
        this.$emit("showPopup");
      } else {
        proceedToBooking(flight);
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
