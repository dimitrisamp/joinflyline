import { recentDeals, durationLabels } from "../trending.js";
import { airlineIcon, cityThumbnail } from "../../utils.js";

export const MainLandingTiles = Vue.component("main-landing-tiles", {
  template: "#vue-main-landing-tiles-template",
  data() {
    return {
      recentDeals,
      airlineIcon,
      cityThumbnail,
      durationLabels
    };
  },
  methods: {
    ...Vuex.mapMutations('search', ['updatePlaceFrom', 'updatePlaceTo']),
    setFromTo(from, to) {
      this.updatePlaceFrom(from);
      this.updatePlaceTo(to);
    }
  },
  delimiters: ["[[", "]]"]
});
