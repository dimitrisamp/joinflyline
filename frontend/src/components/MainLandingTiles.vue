<template>
  <div class="tiles__container hide-element-on-mobile">
    <div class="container">
      <div class="tiles">
        <h3 class="title--black-small">Recent Deals on FlyLine</h3>
        <div class="row">
          <!-- Tile 1 Start -->
          <div
            v-for="(o, i) in recentDeals"
            :key="`recent-deal-${i}`"
            class="col-12 col-lg-6"
          >
            <div class="tiles__card">
              <div class="tiles__card-img">
                <img :src="cityThumbnail(o.to.city)" :alt="o.to.city" />
              </div>
              <div class="tiles__card-content">
                <h4 class="tiles__card-title">
                  {{ o.from.city }} ({{ o.from.code }}) -> {{ o.to.city }} ({{
                    o.to.code
                  }})
                </h4>
                <div class="tiles__card-airports">
                  <div class="tiles__card-icons">
                    <img
                      v-for="(airline, ai) in o.airlines"
                      :src="airlineIcon(airline)"
                      :alt="airline"
                      :key="`deal-${i}-airline-${ai}`"
                    />
                  </div>
                  <div class="tiles__card-text--small">
                    <template v-for="(value, durationType) in o.duration"
                      ><!-- v-if="value" -->
                      {{ durationLabels[durationType] }} {{ value }}
                    </template>
                  </div>
                </div>
                <p class="tiles__card-text">
                  ${{ o.savings }} Less than other sites
                </p>
                <div class="tiles__card-details">
                  <p class="tiles__card-text--blue">Average ${{ o.average }}</p>
                  <button
                    class="button button--outline-blue"
                    @click="setFromTo(o.from, o.to)"
                  >
                    View Flights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { recentDeals, durationLabels } from "../utils/trending";
import { airlineIcon, cityThumbnail } from "../utils/utils";
import Vuex from "vuex";

export default {
  delimiters: ["{{", "}}"],
  data() {
    return {
      recentDeals,
      airlineIcon,
      cityThumbnail,
      durationLabels
    };
  },
  methods: {
    ...Vuex.mapMutations("search", ["updatePlaceFrom", "updatePlaceTo"]),
    setFromTo(from, to) {
      this.updatePlaceFrom(from);
      this.updatePlaceTo(to);
    }
  }
};
</script>
